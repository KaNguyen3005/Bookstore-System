import os
import pickle

import numpy as np
import pandas as pd
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams
from sklearn.feature_extraction.text import TfidfVectorizer

from app.data_access.database import (
    get_books_data,
    get_detailed_interactions,
    get_popular_books_from_db,
    get_user_interacted_book_ids,
)
from app.utils.stop_words import get_stop_words
from app.utils.text_processing import my_vietnamese_tokenizer


class ContentEngine:
    INTERACT_WEIGHTS = {
        "VIEW_BOOK": 1.0,
        "ADD_TO_CART": 3.0,
        "PURCHASE": 8.0,
        "REVIEW": 0.0,
    }

    def __init__(self, qdrant_host="localhost", qdrant_port=6333, model_path="tfidf_model.pkl"):
        self.client = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.book_col = "books_collection"
        self.user_col = "users_collection"
        self.model_path = model_path

        self.tfidf = None
        self.vector_size = 2048
        self._load_model()

    def _load_model(self):
        if os.path.exists(self.model_path):
            with open(self.model_path, "rb") as f:
                self.tfidf = pickle.load(f)
                self.tfidf.token_pattern = None
                self.vector_size = len(self.tfidf.get_feature_names_out())
            return

        self.tfidf = TfidfVectorizer(
            tokenizer=my_vietnamese_tokenizer,
            stop_words=get_stop_words(),
            max_features=self.vector_size,
        )
        self.tfidf.token_pattern = None

    @staticmethod
    def _content_text(df):
        return (
            df["title"].fillna("").astype(str)
            + " "
            + df["description"].fillna("").astype(str)
            + " "
            + df["authors"].fillna("").astype(str)
            + " "
            + df["categories"].fillna("").astype(str)
        )

    def train(self):
        """Vectorize book content with TF-IDF and sync it to Qdrant."""
        df = get_books_data()
        if df.empty:
            print("Content Analyzer: no active books to train.")
            return

        df = df.copy()
        df["content"] = self._content_text(df)

        tfidf_matrix = self.tfidf.fit_transform(df["content"])
        self.vector_size = tfidf_matrix.shape[1]

        with open(self.model_path, "wb") as f:
            pickle.dump(self.tfidf, f)

        if self.client.collection_exists(self.book_col):
            self.client.delete_collection(self.book_col)
        self.client.create_collection(
            collection_name=self.book_col,
            vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE),
        )

        if self.client.collection_exists(self.user_col):
            self.client.delete_collection(self.user_col)
        self.client.create_collection(
            collection_name=self.user_col,
            vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE),
        )

        points = []
        for idx, row in df.iterrows():
            points.append(
                PointStruct(
                    id=int(row["book_id"]),
                    vector=tfidf_matrix[idx].toarray().flatten().tolist(),
                    payload={
                        "title": row.get("title"),
                        "authors": row.get("authors"),
                        "categories": row.get("categories"),
                    },
                )
            )

            if len(points) >= 500:
                self.client.upsert(collection_name=self.book_col, points=points)
                points = []

        if points:
            self.client.upsert(collection_name=self.book_col, points=points)

        print(f"Content Analyzer: synced {len(df)} book vectors to Qdrant.")

    def _get_previous_profile(self, user_id):
        try:
            result = self.client.retrieve(
                self.user_col,
                ids=[int(user_id)],
                with_vectors=True,
            )
            if result:
                return np.array(result[0].vector, dtype=float), True
        except Exception:
            pass
        return np.zeros(self.vector_size, dtype=float), False

    @staticmethod
    def _review_value(value):
        if pd.isna(value):
            return None
        try:
            return float(value)
        except (TypeError, ValueError):
            return None

    def build_user_profile_rocchio(self, user_id):
        """Build a Rocchio user profile from positive and negative feedback."""
        u0, has_previous_profile = self._get_previous_profile(user_id)

        interactions = get_detailed_interactions(user_id)
        if interactions.empty:
            return u0 if has_previous_profile else None

        book_ids = interactions["book_id"].dropna().astype(int).unique().tolist()
        if not book_ids:
            return u0 if has_previous_profile else None

        res_items = self.client.retrieve(
            self.book_col,
            ids=book_ids,
            with_vectors=True,
        )
        item_vectors = {int(hit.id): np.array(hit.vector, dtype=float) for hit in res_items}

        d_plus_sum = np.zeros(self.vector_size, dtype=float)
        d_minus_sum = np.zeros(self.vector_size, dtype=float)
        count_plus = 0
        count_minus = 0

        for _, row in interactions.iterrows():
            book_id = int(row["book_id"])
            vector = item_vectors.get(book_id)
            if vector is None:
                continue

            event_type = str(row.get("event_type") or "").upper()
            review_value = self._review_value(row.get("value"))

            if event_type == "REVIEW":
                if review_value is None:
                    continue
                if review_value <= 2:
                    d_minus_sum += vector * max(1.0, 3.0 - review_value)
                    count_minus += 1
                else:
                    d_plus_sum += vector * review_value
                    count_plus += 1
                continue

            weight = self.INTERACT_WEIGHTS.get(event_type, 1.0)
            d_plus_sum += vector * weight
            count_plus += 1

        alpha, beta, gamma = 0.8, 1.0, 0.3
        u_plus = d_plus_sum / count_plus if count_plus > 0 else np.zeros(self.vector_size)
        u_minus = d_minus_sum / count_minus if count_minus > 0 else np.zeros(self.vector_size)

        user_profile = (alpha * u0) + (beta * u_plus) - (gamma * u_minus)
        user_profile = np.maximum(user_profile, 0.0)

        norm = np.linalg.norm(user_profile)
        if norm <= 1e-9:
            return None

        user_profile /= norm
        self.client.upsert(
            self.user_col,
            points=[PointStruct(id=int(user_id), vector=user_profile.tolist())],
        )
        return user_profile

    def _popular_fallback(self, top_n):
        popular_df = get_popular_books_from_db(top_n)
        return [
            {
                "book_id": int(row["book_id"]),
                "title": row.get("title"),
                "score": 0.5,
                "predicted_rating": 2.5,
                "type": "popular_fallback",
            }
            for _, row in popular_df.iterrows()
        ]

    def recommend(self, user_id, top_n=10):
        """Recommend books by matching the Rocchio user profile to book TF-IDF vectors."""
        user_vector = self.build_user_profile_rocchio(user_id)
        if user_vector is None:
            return self._popular_fallback(top_n)

        excluded_ids = set(get_user_interacted_book_ids(user_id))
        limit = max(top_n * 3, top_n + min(len(excluded_ids), 100) + 10)
        search_results = self.client.query_points(
            collection_name=self.book_col,
            query=user_vector.tolist(),
            limit=limit,
            with_payload=True,
        ).points

        recommendations = []
        for hit in search_results:
            book_id = int(hit.id)
            if book_id in excluded_ids:
                continue

            recommendations.append(
                {
                    "book_id": book_id,
                    "title": hit.payload.get("title") if hit.payload else None,
                    "score": max(0.0, min(1.0, float(hit.score))),
                    "predicted_rating": round(max(0.0, min(1.0, float(hit.score))) * 5.0, 2),
                    "type": "content-based",
                }
            )
            if len(recommendations) >= top_n:
                break

        return recommendations if recommendations else self._popular_fallback(top_n)

    def recommend_similar_books(self, book_id, top_n=10):
        """Recommend books with similar content to a target book."""
        book_id = int(book_id)
        result = self.client.retrieve(self.book_col, ids=[book_id], with_vectors=True)
        if not result:
            return []

        search_results = self.client.query_points(
            collection_name=self.book_col,
            query=result[0].vector,
            limit=top_n + 1,
            with_payload=True,
        ).points

        recommendations = []
        for hit in search_results:
            if int(hit.id) == book_id:
                continue
            score = max(0.0, min(1.0, float(hit.score)))
            recommendations.append(
                {
                    "book_id": int(hit.id),
                    "title": hit.payload.get("title") if hit.payload else None,
                    "score": score,
                    "predicted_rating": round(score * 5.0, 2),
                    "type": "similar-content",
                }
            )
            if len(recommendations) >= top_n:
                break

        return recommendations


if __name__ == "__main__":
    engine = ContentEngine()
    engine.train()

    print("Recommendations for User 1:", engine.recommend(1))
    print("Similar to Book 1:", engine.recommend_similar_books(1))
