import numpy as np
import pandas as pd
from typing import Dict, List

from app.core.config import settings
from app.data_access.database import get_books_data
from app.services.collaborative_engine import CollaborativeItemEngine
from app.services.content_engine import ContentEngine


class HybridRecommendationEngine:
    """Hybrid recommender combining item-item CF and content-based filtering."""

    def __init__(
        self,
        collab_weight: float = 0.5,
        content_weight: float = 0.5,
        qdrant_host: str = None,
        qdrant_port: int = None,
    ):
        total_weight = collab_weight + content_weight
        if total_weight <= 0:
            self.collab_weight = 0.5
            self.content_weight = 0.5
        else:
            self.collab_weight = collab_weight / total_weight
            self.content_weight = content_weight / total_weight

        qdrant_host = qdrant_host or settings.QDRANT_HOST
        qdrant_port = qdrant_port or settings.QDRANT_PORT

        self.collaborative_engine = CollaborativeItemEngine(
            qdrant_host=qdrant_host,
            qdrant_port=qdrant_port,
        )
        self.content_engine = ContentEngine(
            qdrant_host=qdrant_host,
            qdrant_port=qdrant_port,
        )

        self._books_cache = pd.DataFrame()
        self._load_books_cache()

    def _load_books_cache(self):
        """Load book metadata for response enrichment."""
        try:
            self._books_cache = get_books_data()
            if self._books_cache is None:
                self._books_cache = pd.DataFrame()
        except Exception as exc:
            print(f"Could not load books cache: {exc}")
            self._books_cache = pd.DataFrame()

    @staticmethod
    def _clamp_score(value):
        try:
            return max(0.0, min(1.0, float(value)))
        except (TypeError, ValueError):
            return 0.0

    def _book_title(self, book_id, fallback=None):
        if fallback is not None:
            return fallback
        if self._books_cache is None or self._books_cache.empty:
            self._load_books_cache()
        if self._books_cache is None or self._books_cache.empty:
            return None

        book_info = self._books_cache[self._books_cache["book_id"].astype(int) == int(book_id)]
        if book_info.empty:
            return None
        return book_info.iloc[0].get("title")

    def _normalize_scores(self, scores: List[float]) -> List[float]:
        """Normalize scores to [0, 1]. Kept for compatibility with older callers."""
        if not scores:
            return []
        scores = np.array(scores, dtype=float)
        min_score = scores.min()
        max_score = scores.max()
        if max_score == min_score:
            return [0.5] * len(scores)
        return ((scores - min_score) / (max_score - min_score)).tolist()

    def _collab_score(self, rec):
        if rec.get("predicted_rating") is not None:
            return self._clamp_score(float(rec.get("predicted_rating", 0.0)) / 5.0)
        return self._clamp_score(rec.get("score", 0.0))

    def _content_score(self, rec):
        return self._clamp_score(rec.get("score", 0.0))

    def _merge_recommendations(
        self,
        collab_recs: List[Dict],
        content_recs: List[Dict],
        top_n: int = 10,
    ) -> List[Dict]:
        """Merge recommendations from both engines using weighted average."""
        merged = {}

        for rec in collab_recs or []:
            book_id = int(rec["book_id"])
            merged[book_id] = {
                "book_id": book_id,
                "collab_score": self._collab_score(rec),
                "content_score": 0.0,
                "title": rec.get("title"),
                "type": rec.get("type", "collaborative"),
            }

        for rec in content_recs or []:
            book_id = int(rec["book_id"])
            content_score = self._content_score(rec)
            if book_id in merged:
                merged[book_id]["content_score"] = content_score
                if not merged[book_id].get("title"):
                    merged[book_id]["title"] = rec.get("title")
                if "fallback" not in str(merged[book_id].get("type", "")):
                    merged[book_id]["type"] = "hybrid"
            else:
                merged[book_id] = {
                    "book_id": book_id,
                    "collab_score": 0.0,
                    "content_score": content_score,
                    "title": rec.get("title"),
                    "type": rec.get("type", "content-based"),
                }

        for item in merged.values():
            item["final_score"] = (
                self.collab_weight * item["collab_score"]
                + self.content_weight * item["content_score"]
            )

        sorted_recs = sorted(
            merged.values(),
            key=lambda item: item["final_score"],
            reverse=True,
        )

        result = []
        for item in sorted_recs[:top_n]:
            score = self._clamp_score(item["final_score"])
            result.append(
                {
                    "book_id": int(item["book_id"]),
                    "title": self._book_title(item["book_id"], item.get("title")),
                    "score": round(score, 3),
                    "predicted_rating": round(score * 5.0, 2),
                    "type": item["type"],
                    "collab_score": round(item["collab_score"], 3),
                    "content_score": round(item["content_score"], 3),
                }
            )

        return result

    @staticmethod
    def _method_from_results(recommendations):
        if not recommendations:
            return "fallback"
        types = {str(rec.get("type", "")) for rec in recommendations}
        if any(rec_type == "hybrid" for rec_type in types):
            return "hybrid"
        if all("collaborative" in rec_type for rec_type in types):
            return "collaborative"
        if all("content" in rec_type for rec_type in types):
            return "content-based"
        if all("fallback" in rec_type for rec_type in types):
            return "fallback"
        return "hybrid"

    def recommend(self, user_id: int, top_n: int = 10) -> Dict:
        """Return top-N hybrid recommendations while preserving the API contract."""
        collab_recs = []
        content_recs = []

        try:
            collab_recs = self.collaborative_engine.recommend(user_id, top_n=top_n + 5)
        except Exception as exc:
            print(f"Collaborative recommendation failed: {exc}")

        try:
            content_recs = self.content_engine.recommend(user_id, top_n=top_n + 5)
        except Exception as exc:
            print(f"Content recommendation failed: {exc}")

        final_recs = self._merge_recommendations(collab_recs, content_recs, top_n)
        method = self._method_from_results(final_recs)

        if not final_recs:
            final_recs = self.collaborative_engine.get_fallback_recommendations(top_n)
            method = "fallback"

        return {
            "user_id": user_id,
            "recommendations": final_recs,
            "total_count": len(final_recs),
            "method": method,
        }

    def get_related_books(self, book_id: int, top_n: int = 10) -> Dict:
        """Find content-similar books for a target book."""
        if self._books_cache is None or self._books_cache.empty:
            self._load_books_cache()

        target_title = self._book_title(book_id)
        if target_title is None:
            return {
                "book_id": book_id,
                "book_title": None,
                "related_books": [],
                "total_count": 0,
            }

        try:
            related = self.content_engine.recommend_similar_books(book_id, top_n=top_n)
        except Exception as exc:
            print(f"Related-books content query failed: {exc}")
            related = []

        if not related:
            related = self.collaborative_engine.get_fallback_recommendations(top_n)

        enriched = []
        for rec in related[:top_n]:
            score = self._clamp_score(rec.get("score", rec.get("predicted_rating", 0.0) / 5.0))
            enriched.append(
                {
                    "book_id": int(rec["book_id"]),
                    "title": self._book_title(rec["book_id"], rec.get("title")),
                    "score": round(score, 3),
                    "predicted_rating": rec.get("predicted_rating", round(score * 5.0, 2)),
                    "type": rec.get("type", "similar-content"),
                }
            )

        return {
            "book_id": book_id,
            "book_title": target_title,
            "related_books": enriched,
            "total_count": len(enriched),
        }

    def train_engines(
        self,
        retrain_collaborative: bool = True,
        retrain_content: bool = True,
    ) -> Dict:
        """Train selected engines exactly once each."""
        result = {
            "status": "success",
            "message": [],
            "collaborative_trained": False,
            "content_trained": False,
        }

        if retrain_content:
            try:
                self.content_engine.train()
                result["content_trained"] = True
                result["message"].append("Content engine trained")
            except Exception as exc:
                result["status"] = "partial_failure"
                result["message"].append(f"Content training failed: {exc}")

        if retrain_collaborative:
            try:
                self.collaborative_engine.train_and_sync()
                result["collaborative_trained"] = True
                result["message"].append("Collaborative engine trained")
            except Exception as exc:
                result["status"] = "partial_failure"
                result["message"].append(f"Collaborative training failed: {exc}")

        if retrain_content or retrain_collaborative:
            self._load_books_cache()

        if result["status"] == "partial_failure" and not (
            result["content_trained"] or result["collaborative_trained"]
        ):
            result["status"] = "failed"

        result["message"] = "\n".join(result["message"]) or "No engine selected for training"
        return result


if __name__ == "__main__":
    hybrid = HybridRecommendationEngine(collab_weight=0.6, content_weight=0.4)
    hybrid.train_engines()

    user_id = 19
    result = hybrid.recommend(user_id, top_n=10)
    print(f"\nRecommendations for User {user_id}")
    print(f"Method: {result['method']}")
    for rec in result["recommendations"]:
        title = str(rec.get("title") or "Untitled")
        print(
            f"{rec['book_id']:5d} | {title[:40]:40s} | "
            f"Score: {rec.get('score', 0):.3f} | {rec.get('type')}"
        )
