from __future__ import annotations

import argparse
import json
import math
import tempfile
from contextlib import contextmanager
from dataclasses import asdict, dataclass
from pathlib import Path
from types import SimpleNamespace
from typing import Dict, Iterable, List, Optional, Sequence

import numpy as np
import pandas as pd

from app.data_access import database as db
from app.services import collaborative_engine as collaborative_module
from app.services import content_engine as content_module
from app.services import hybrid_engine as hybrid_module
from app.services.hybrid_engine import HybridRecommendationEngine


@dataclass
class FakeQueryResponse:
    points: List[SimpleNamespace]


class InMemoryQdrantClient:
    """Small in-memory stand-in for Qdrant during offline benchmarking."""

    def __init__(self, host: str = "localhost", port: int = 6333) -> None:
        self.host = host
        self.port = port
        self._collections: Dict[str, Dict[int, Dict[str, object]]] = {}

    def collection_exists(self, collection_name: str) -> bool:
        return collection_name in self._collections

    def delete_collection(self, collection_name: str) -> None:
        self._collections.pop(collection_name, None)

    def recreate_collection(self, collection_name: str, vectors_config=None) -> None:
        self._collections[collection_name] = {}

    def create_collection(self, collection_name: str, vectors_config=None) -> None:
        self._collections.setdefault(collection_name, {})

    def upsert(self, collection_name: str, points) -> None:
        collection = self._collections.setdefault(collection_name, {})
        for point in points:
            collection[int(point.id)] = {
                "vector": np.asarray(point.vector, dtype=float),
                "payload": dict(point.payload or {}),
            }

    def retrieve(self, collection_name: str, ids, with_vectors: bool = False):
        collection = self._collections.get(collection_name, {})
        results = []
        for item_id in ids:
            stored = collection.get(int(item_id))
            if stored is None:
                continue
            results.append(
                SimpleNamespace(
                    id=int(item_id),
                    vector=stored["vector"].tolist() if with_vectors else None,
                    payload=stored["payload"],
                )
            )
        return results

    def query_points(self, collection_name: str, query, limit: int = 10, with_payload: bool = True):
        collection = self._collections.get(collection_name, {})
        query_vector = np.asarray(query, dtype=float)
        query_norm = float(np.linalg.norm(query_vector))

        scored_points = []
        for item_id, stored in collection.items():
            candidate_vector = stored["vector"]
            candidate_norm = float(np.linalg.norm(candidate_vector))
            if query_norm == 0.0 or candidate_norm == 0.0:
                score = 0.0
            else:
                score = float(np.dot(query_vector, candidate_vector) / (query_norm * candidate_norm))
            scored_points.append(
                SimpleNamespace(
                    id=int(item_id),
                    score=score,
                    payload=stored["payload"] if with_payload else {},
                    vector=candidate_vector.tolist(),
                )
            )

        scored_points.sort(key=lambda point: point.score, reverse=True)
        return FakeQueryResponse(points=scored_points[:limit])


@contextmanager
def _patched_hybrid_environment(
    *,
    train_df: pd.DataFrame,
    books_df: pd.DataFrame,
):
    """Route engine data access to the benchmark split without changing engine code."""

    def get_all_ratings_train() -> pd.DataFrame:
        return train_df.loc[:, ["user_id", "book_id", "rating"]].copy()

    def get_user_ratings_dict_train(user_id: int) -> Dict[int, float]:
        user_frame = train_df.loc[train_df["user_id"].astype(int) == int(user_id)]
        return dict(zip(user_frame["book_id"].astype(int), user_frame["rating"].astype(float)))

    def get_unread_books_train(user_id: int) -> List[int]:
        user_rated = set(get_user_ratings_dict_train(user_id).keys())
        all_books = books_df["book_id"].astype(int).tolist()
        return [book_id for book_id in all_books if book_id not in user_rated]

    def get_book_mean_ratings_train() -> Dict[int, float]:
        if train_df.empty:
            return {}
        means = train_df.groupby("book_id", sort=False)["rating"].mean()
        return {int(book_id): float(value) for book_id, value in means.items()}

    def get_popular_books_train(top_n: int = 10) -> pd.DataFrame:
        if train_df.empty:
            return books_df.head(top_n).loc[:, ["book_id", "title"]].copy()
        popularity = (
            train_df.groupby("book_id", sort=False)["rating"]
            .agg(["count", "mean"])
            .sort_values(["count", "mean"], ascending=False)
            .head(top_n)
            .reset_index()
        )
        result = popularity.merge(books_df.loc[:, ["book_id", "title"]], on="book_id", how="left")
        return result

    def get_detailed_interactions_train(user_id: int) -> pd.DataFrame:
        user_frame = train_df.loc[train_df["user_id"].astype(int) == int(user_id)]
        if user_frame.empty:
            return pd.DataFrame(columns=["book_id", "event_type", "value"])
        return pd.DataFrame(
            {
                "book_id": user_frame["book_id"].astype(int).tolist(),
                "event_type": ["REVIEW"] * len(user_frame),
                "value": user_frame["rating"].astype(float).tolist(),
            }
        )

    def get_user_interacted_book_ids_train(user_id: int) -> List[int]:
        user_frame = train_df.loc[train_df["user_id"].astype(int) == int(user_id)]
        return user_frame["book_id"].astype(int).tolist()

    original_values = {
        "collab_qdrant": collaborative_module.QdrantClient,
        "content_qdrant": content_module.QdrantClient,
        "hybrid_content_engine": hybrid_module.ContentEngine,
        "hybrid_get_books_data": hybrid_module.get_books_data,
        "collab_get_all_ratings": collaborative_module.get_all_ratings,
        "collab_get_book_mean_ratings": collaborative_module.get_book_mean_ratings,
        "collab_get_user_ratings_dict": collaborative_module.get_user_ratings_dict,
        "collab_get_unread_books": collaborative_module.get_unread_books,
        "collab_get_popular_books_from_db": collaborative_module.get_popular_books_from_db,
        "content_get_books_data": content_module.get_books_data,
        "content_get_detailed_interactions": content_module.get_detailed_interactions,
        "content_get_user_interacted_book_ids": content_module.get_user_interacted_book_ids,
        "content_get_popular_books_from_db": content_module.get_popular_books_from_db,
    }

    model_path = Path(tempfile.gettempdir()) / "recommendation_benchmark_tfidf_model.pkl"

    def build_content_engine(*args, **kwargs):
        kwargs["model_path"] = str(model_path)
        return content_module.ContentEngine(*args, **kwargs)

    collaborative_module.QdrantClient = InMemoryQdrantClient
    content_module.QdrantClient = InMemoryQdrantClient
    hybrid_module.ContentEngine = build_content_engine
    hybrid_module.get_books_data = lambda: books_df.copy()
    collaborative_module.get_all_ratings = get_all_ratings_train
    collaborative_module.get_book_mean_ratings = get_book_mean_ratings_train
    collaborative_module.get_user_ratings_dict = get_user_ratings_dict_train
    collaborative_module.get_unread_books = get_unread_books_train
    collaborative_module.get_popular_books_from_db = get_popular_books_train
    content_module.get_books_data = lambda: books_df.copy()
    content_module.get_detailed_interactions = get_detailed_interactions_train
    content_module.get_user_interacted_book_ids = get_user_interacted_book_ids_train
    content_module.get_popular_books_from_db = get_popular_books_train

    try:
        yield
    finally:
        collaborative_module.QdrantClient = original_values["collab_qdrant"]
        content_module.QdrantClient = original_values["content_qdrant"]
        hybrid_module.ContentEngine = original_values["hybrid_content_engine"]
        hybrid_module.get_books_data = original_values["hybrid_get_books_data"]
        collaborative_module.get_all_ratings = original_values["collab_get_all_ratings"]
        collaborative_module.get_book_mean_ratings = original_values["collab_get_book_mean_ratings"]
        collaborative_module.get_user_ratings_dict = original_values["collab_get_user_ratings_dict"]
        collaborative_module.get_unread_books = original_values["collab_get_unread_books"]
        collaborative_module.get_popular_books_from_db = original_values["collab_get_popular_books_from_db"]
        content_module.get_books_data = original_values["content_get_books_data"]
        content_module.get_detailed_interactions = original_values["content_get_detailed_interactions"]
        content_module.get_user_interacted_book_ids = original_values["content_get_user_interacted_book_ids"]
        content_module.get_popular_books_from_db = original_values["content_get_popular_books_from_db"]
        try:
            model_path.unlink(missing_ok=True)
        except OSError:
            pass


@dataclass
class BenchmarkMetrics:
    precision_at_k: float
    recall_at_k: float
    rmse: float
    mae: float
    evaluated_users: int
    evaluated_ratings: int
    top_k: int


class RecommendationBenchmark:
    """Offline benchmark for recommendation metrics.

    The benchmark uses a per-user train/test split, but it evaluates the
    production HybridRecommendationEngine path. The train split is injected into
    the collaborative and content engines via an in-memory Qdrant substitute,
    so ranking metrics come from ``HybridRecommendationEngine.recommend()`` and
    rating metrics come from the collaborative predictor used by that engine.
    """

    def __init__(
        self,
        ratings_df: Optional[pd.DataFrame] = None,
        test_ratio: float = 0.2,
        min_user_ratings: int = 2,
        random_state: int = 42,
    ) -> None:
        self.test_ratio = test_ratio
        self.min_user_ratings = min_user_ratings
        self.random_state = random_state

        if ratings_df is None:
            ratings_df = db.get_all_ratings()

        self.ratings_df = self._prepare_ratings(ratings_df)
        self.books_df = self._load_books_data()
        self.train_df, self.test_df = self._train_test_split_by_user(
            self.ratings_df,
            test_ratio=test_ratio,
            min_user_ratings=min_user_ratings,
            random_state=random_state,
        )

        self.hybrid_engine = self._build_hybrid_engine()

    @staticmethod
    def _load_books_data() -> pd.DataFrame:
        books_df = db.get_books_data()
        if books_df is None:
            return pd.DataFrame(columns=["book_id", "title"])

        if not isinstance(books_df, pd.DataFrame):
            books_df = pd.DataFrame(books_df)

        if "book_id" not in books_df.columns:
            raise ValueError("books data must include a book_id column")

        result = books_df.copy()
        if "title" not in result.columns:
            result["title"] = result["book_id"].apply(lambda book_id: f"Book {book_id}")
        return result

    @staticmethod
    def _prepare_ratings(ratings_df: pd.DataFrame) -> pd.DataFrame:
        required_columns = {"user_id", "book_id", "rating"}
        missing = required_columns.difference(ratings_df.columns)
        if missing:
            raise ValueError(f"ratings_df is missing required columns: {sorted(missing)}")

        prepared = ratings_df.loc[:, ["user_id", "book_id", "rating"]].copy()
        prepared["user_id"] = prepared["user_id"].astype(int)
        prepared["book_id"] = prepared["book_id"].astype(int)
        prepared["rating"] = prepared["rating"].astype(float)
        prepared = prepared.dropna(subset=["user_id", "book_id", "rating"])
        prepared = prepared.drop_duplicates(subset=["user_id", "book_id"], keep="last")
        return prepared.reset_index(drop=True)

    @staticmethod
    def _train_test_split_by_user(
        ratings_df: pd.DataFrame,
        *,
        test_ratio: float,
        min_user_ratings: int,
        random_state: int,
    ) -> tuple[pd.DataFrame, pd.DataFrame]:
        rng = np.random.default_rng(random_state)
        train_parts: List[pd.DataFrame] = []
        test_parts: List[pd.DataFrame] = []

        for _, user_frame in ratings_df.groupby("user_id", sort=False):
            user_frame = user_frame.sample(frac=1.0, random_state=int(rng.integers(0, 2**32 - 1)))
            if len(user_frame) < min_user_ratings:
                train_parts.append(user_frame)
                continue

            test_size = max(1, int(round(len(user_frame) * test_ratio)))
            test_size = min(test_size, len(user_frame) - 1)

            test_parts.append(user_frame.iloc[:test_size])
            train_parts.append(user_frame.iloc[test_size:])

        train_df = pd.concat(train_parts, ignore_index=True) if train_parts else ratings_df.iloc[0:0].copy()
        test_df = pd.concat(test_parts, ignore_index=True) if test_parts else ratings_df.iloc[0:0].copy()

        return train_df, test_df

    def _build_hybrid_engine(self) -> HybridRecommendationEngine:
        with _patched_hybrid_environment(train_df=self.train_df, books_df=self.books_df):
            hybrid_engine = HybridRecommendationEngine(collab_weight=0.6, content_weight=0.4)
            hybrid_engine.train_engines(retrain_collaborative=True, retrain_content=True)
            return hybrid_engine

    def _predict_rating(self, user_id: int, book_id: int, top_k_neighbors: int = 20) -> float:
        user_ratings_dict = dict(
            zip(
                self.train_df.loc[self.train_df["user_id"].astype(int) == int(user_id), "book_id"].astype(int),
                self.train_df.loc[self.train_df["user_id"].astype(int) == int(user_id), "rating"].astype(float),
            )
        )
        all_book_means = self.train_df.groupby("book_id", sort=False)["rating"].mean().to_dict()
        if not user_ratings_dict:
            return float(self.train_df["rating"].mean()) if not self.train_df.empty else 0.0

        with _patched_hybrid_environment(train_df=self.train_df, books_df=self.books_df):
            return float(
                self.hybrid_engine.collaborative_engine.predict_rating(
                    user_id,
                    book_id,
                    user_ratings_dict,
                    {int(key): float(value) for key, value in all_book_means.items()},
                    top_k=top_k_neighbors,
                )
            )

    def _rank_books_for_user(self, user_id: int, top_k: int) -> List[int]:
        with _patched_hybrid_environment(train_df=self.train_df, books_df=self.books_df):
            recommendations = self.hybrid_engine.recommend(user_id=user_id, top_n=top_k)

        if isinstance(recommendations, dict):
            recommendations = recommendations.get("recommendations", [])

        ranked_ids = [int(item["book_id"]) for item in recommendations if "book_id" in item]
        return ranked_ids[:top_k]

    def evaluate_ranking(self, top_k: int = 10, max_users: Optional[int] = None) -> BenchmarkMetrics:
        if self.test_df.empty:
            return BenchmarkMetrics(0.0, 0.0, 0.0, 0.0, 0, 0, top_k)

        precision_sum = 0.0
        recall_sum = 0.0
        evaluated_users = 0

        users = self.test_df["user_id"].drop_duplicates().astype(int).tolist()
        if max_users is not None:
            users = users[:max_users]

        for user_id in users:
            relevant_items = set(
                self.test_df.loc[self.test_df["user_id"] == user_id, "book_id"].astype(int).tolist()
            )
            if not relevant_items:
                continue

            ranked_items = self._rank_books_for_user(user_id, top_k)
            if not ranked_items:
                continue

            hits = len(relevant_items.intersection(ranked_items))
            precision_sum += hits / float(top_k)
            recall_sum += hits / float(len(relevant_items))
            evaluated_users += 1

        if evaluated_users == 0:
            return BenchmarkMetrics(0.0, 0.0, 0.0, 0.0, 0, 0, top_k)

        return BenchmarkMetrics(
            precision_at_k=precision_sum / evaluated_users,
            recall_at_k=recall_sum / evaluated_users,
            rmse=0.0,
            mae=0.0,
            evaluated_users=evaluated_users,
            evaluated_ratings=0,
            top_k=top_k,
        )

    def evaluate_rating(self, top_k_neighbors: int = 20, max_rows: Optional[int] = None) -> BenchmarkMetrics:
        if self.test_df.empty:
            return BenchmarkMetrics(0.0, 0.0, 0.0, 0.0, 0, 0, top_k_neighbors)

        test_rows = self.test_df
        if max_rows is not None:
            test_rows = test_rows.head(max_rows)

        y_true: List[float] = []
        y_pred: List[float] = []

        for _, row in test_rows.iterrows():
            user_id = int(row["user_id"])
            book_id = int(row["book_id"])
            rating = float(row["rating"])
            prediction = self._predict_rating(user_id, book_id, top_k_neighbors=top_k_neighbors)
            y_true.append(rating)
            y_pred.append(prediction)

        if not y_true:
            return BenchmarkMetrics(0.0, 0.0, 0.0, 0.0, 0, 0, top_k_neighbors)

        errors = np.array(y_pred) - np.array(y_true)
        rmse = float(np.sqrt(np.mean(np.square(errors))))
        mae = float(np.mean(np.abs(errors)))

        return BenchmarkMetrics(
            precision_at_k=0.0,
            recall_at_k=0.0,
            rmse=rmse,
            mae=mae,
            evaluated_users=int(test_rows["user_id"].nunique()),
            evaluated_ratings=len(y_true),
            top_k=top_k_neighbors,
        )

    def run(self, top_k: int = 10, top_k_neighbors: int = 20, max_users: Optional[int] = None) -> Dict[str, object]:
        ranking_metrics = self.evaluate_ranking(top_k=top_k, max_users=max_users)
        rating_metrics = self.evaluate_rating(top_k_neighbors=top_k_neighbors)

        return {
            "data": {
                "total_ratings": int(len(self.ratings_df)),
                "train_ratings": int(len(self.train_df)),
                "test_ratings": int(len(self.test_df)),
                "test_ratio": self.test_ratio,
                "min_user_ratings": self.min_user_ratings,
            },
            "ranking": asdict(ranking_metrics),
            "rating": asdict(rating_metrics),
        }


def _build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run offline recommendation benchmarks.")
    parser.add_argument("--top-k", type=int, default=10, help="Top-K cutoff for ranking metrics")
    parser.add_argument(
        "--neighbor-k",
        type=int,
        default=20,
        help="Number of nearest neighbors used for rating prediction",
    )
    parser.add_argument(
        "--test-ratio",
        type=float,
        default=0.2,
        help="Fraction of each user's ratings held out for test",
    )
    parser.add_argument(
        "--min-user-ratings",
        type=int,
        default=2,
        help="Minimum ratings per user required for a train/test split",
    )
    parser.add_argument(
        "--max-users",
        type=int,
        default=None,
        help="Optional limit on how many test users to evaluate for ranking",
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Print a human-readable report instead of JSON",
    )
    return parser


def main(argv: Optional[Sequence[str]] = None) -> None:
    parser = _build_arg_parser()
    args = parser.parse_args(argv)

    benchmark = RecommendationBenchmark(
        test_ratio=args.test_ratio,
        min_user_ratings=args.min_user_ratings,
    )
    report = benchmark.run(
        top_k=args.top_k,
        top_k_neighbors=args.neighbor_k,
        max_users=args.max_users,
    )

    if args.pretty:
        print("Benchmark report")
        print(f"  Total ratings: {report['data']['total_ratings']}")
        print(f"  Train ratings: {report['data']['train_ratings']}")
        print(f"  Test ratings: {report['data']['test_ratings']}")
        print(f"  Precision@{args.top_k}: {report['ranking']['precision_at_k']:.4f}")
        print(f"  Recall@{args.top_k}: {report['ranking']['recall_at_k']:.4f}")
        print(f"  RMSE: {report['rating']['rmse']:.4f}")
        print(f"  MAE: {report['rating']['mae']:.4f}")
    else:
        print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

# python -m app.services.benchmark --top-k 10 --neighbor-k 20 --pretty
