from app.content_based import recommend_for_user_cosine_with_fallback
from app.collaborative import recommend_for_user_item_cf
from app.recommender import get_popular_books


def add_scores(score_map, recommendations, weight):
    for index, item in enumerate(recommendations):
        book_id = item["bookId"]

        rank_bonus = max(0, 10 - index)

        weighted_score = item["score"] * weight + rank_bonus

        if book_id not in score_map:
            score_map[book_id] = {
                "bookId": book_id,
                "score": 0,
                "reasons": set()
            }

        score_map[book_id]["score"] += weighted_score
        score_map[book_id]["reasons"].add(item["reason"])


def recommend_for_user_hybrid(user_id: int, limit: int = 10):
    score_map = {}

    content_recs = recommend_for_user_cosine_with_fallback(user_id, limit=30)
    cf_recs = recommend_for_user_item_cf(user_id, limit=30)
    popular_recs = get_popular_books(limit=30)

    add_scores(score_map, content_recs, weight=0.5)
    add_scores(score_map, cf_recs, weight=0.4)
    add_scores(score_map, popular_recs, weight=0.1)

    recommendations = []

    for item in score_map.values():
        recommendations.append({
            "bookId": item["bookId"],
            "score": round(float(item["score"]), 2),
            "reason": ", ".join(sorted(item["reasons"]))
        })

    recommendations.sort(key=lambda item: item["score"], reverse=True)

    return recommendations[:limit]