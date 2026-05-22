import numpy as np
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from app.data_access.database import (
    get_all_ratings,
    get_book_mean_ratings,
    get_popular_books_from_db,
    get_unread_books,
    get_user_ratings_dict,
)


class CollaborativeItemEngine:
    def __init__(self, qdrant_host="localhost", qdrant_port=6333):
        self.client = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.collection_name = "item_item_cf"

    @staticmethod
    def _default_rating(all_book_means):
        values = [float(value) for value in all_book_means.values() if value is not None]
        return float(np.mean(values)) if values else 0.0

    def train_and_sync(self):
        """Train item-item collaborative filtering without dimensionality reduction."""
        print("--- Preparing item-item collaborative filtering matrix ---")
        ratings_df = get_all_ratings()
        if ratings_df.empty:
            print("No rating data available for collaborative training.")
            return

        ratings_df = ratings_df.loc[:, ["user_id", "book_id", "rating"]].copy()
        ratings_df["user_id"] = ratings_df["user_id"].astype(int)
        ratings_df["book_id"] = ratings_df["book_id"].astype(int)
        ratings_df["rating"] = ratings_df["rating"].astype(float)

        item_user_matrix = ratings_df.pivot_table(
            index="book_id",
            columns="user_id",
            values="rating",
            aggfunc="mean",
        ).fillna(0.0)

        book_means = item_user_matrix.replace(0.0, np.nan).mean(axis=1).fillna(0.0)
        centered_matrix = item_user_matrix.sub(book_means, axis=0).where(item_user_matrix != 0.0, 0.0)
        vector_size = centered_matrix.shape[1]

        self.client.recreate_collection(
            collection_name=self.collection_name,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
        )

        points = []
        for book_id, row in centered_matrix.iterrows():
            points.append(
                PointStruct(
                    id=int(book_id),
                    vector=row.astype(float).to_numpy().tolist(),
                    payload={"mean_rating": float(book_means.loc[book_id])},
                )
            )

            if len(points) >= 500:
                self.client.upsert(collection_name=self.collection_name, points=points)
                points = []

        if points:
            self.client.upsert(collection_name=self.collection_name, points=points)

        print(f"--- Synced {len(centered_matrix)} item vectors to Qdrant ---")

    def get_fallback_recommendations(self, top_n=10):
        """Return popular books when collaborative signals are not enough."""
        popular_df = get_popular_books_from_db(top_n)
        return [
            {
                "book_id": int(row["book_id"]),
                "title": row.get("title"),
                "score": 0.5,
                "type": "popular_fallback",
                "predicted_rating": 2.5,
            }
            for _, row in popular_df.iterrows()
        ]

    def predict_rating(self, user_id, target_book_id, user_ratings_dict, all_book_means, top_k=20):
        """Predict rating using item-item weighted deviation from item means."""
        target_book_id = int(target_book_id)
        user_ratings_dict = {int(k): float(v) for k, v in user_ratings_dict.items()}
        all_book_means = {int(k): float(v) for k, v in all_book_means.items()}

        try:
            target_res = self.client.retrieve(
                self.collection_name,
                ids=[target_book_id],
                with_vectors=True,
            )
            if not target_res:
                return all_book_means.get(target_book_id, self._default_rating(all_book_means))

            target_vec = target_res[0].vector
            ri_bar = float(target_res[0].payload.get("mean_rating", all_book_means.get(target_book_id, 0.0)))

            neighbors = self.client.query_points(
                collection_name=self.collection_name,
                query=target_vec,
                limit=top_k + 1,
                with_payload=True,
            ).points

            weighted_sum = 0.0
            sum_of_weights = 0.0

            for neighbor in neighbors:
                neighbor_id = int(neighbor.id)
                if neighbor_id == target_book_id or neighbor_id not in user_ratings_dict:
                    continue

                similarity = float(neighbor.score)
                rating = user_ratings_dict[neighbor_id]
                neighbor_mean = all_book_means.get(neighbor_id)
                if neighbor_mean is None and neighbor.payload:
                    neighbor_mean = neighbor.payload.get("mean_rating")
                if neighbor_mean is None:
                    continue

                weighted_sum += similarity * (rating - float(neighbor_mean))
                sum_of_weights += abs(similarity)

            if sum_of_weights == 0.0:
                return max(1.0, min(5.0, ri_bar)) if ri_bar > 0 else self._default_rating(all_book_means)

            prediction = ri_bar + (weighted_sum / sum_of_weights)
            return max(1.0, min(5.0, prediction))
        except Exception:
            fallback = all_book_means.get(target_book_id, self._default_rating(all_book_means))
            return max(0.0, min(5.0, float(fallback)))

    def recommend(self, user_id, top_n=10):
        """Recommend top-N unread books for a user using item-item CF."""
        user_ratings_dict = get_user_ratings_dict(user_id)
        if not user_ratings_dict:
            return self.get_fallback_recommendations(top_n)

        unread_ids = get_unread_books(user_id)
        if not unread_ids:
            return self.get_fallback_recommendations(top_n)

        all_book_means = get_book_mean_ratings()
        predictions = []
        for book_id in unread_ids:
            score = self.predict_rating(
                user_id,
                book_id,
                user_ratings_dict,
                all_book_means,
            )
            if score > 0:
                predictions.append(
                    {
                        "book_id": int(book_id),
                        "score": round(score / 5.0, 3),
                        "predicted_rating": round(score, 2),
                        "type": "collaborative",
                    }
                )

        if not predictions:
            return self.get_fallback_recommendations(top_n)

        predictions.sort(key=lambda item: item["predicted_rating"], reverse=True)
        return predictions[:top_n]


if __name__ == "__main__":
    engine = CollaborativeItemEngine()
    engine.train_and_sync()

    user_id = 25
    recs = engine.recommend(user_id=user_id)

    print(f"\n--- Recommendations for User {user_id} ---")
    for rec in recs:
        print(f"Book ID: {rec['book_id']} - Score: {rec['predicted_rating']} ({rec['type']})")
