import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

from app.data_loader import (
    load_books,
    load_all_user_interactions
)

from app.recommender import get_popular_books

def build_user_item_matrix():
    interactions = load_all_user_interactions()

    if interactions.empty:
        return None, interactions

    user_item_matrix = interactions.pivot_table(
        index="user_id",
        columns="book_id",
        values="score",
        fill_value=0
    )

    return user_item_matrix, interactions

def build_item_similarity_matrix():
    user_item_matrix, interactions = build_user_item_matrix()

    if user_item_matrix is None or user_item_matrix.empty:
        return None, None

    item_user_matrix = user_item_matrix.T

    similarity_matrix = cosine_similarity(item_user_matrix)

    similarity_df = pd.DataFrame(
        similarity_matrix,
        index=item_user_matrix.index,
        columns=item_user_matrix.index
    )

    return similarity_df, user_item_matrix

def recommend_for_user_item_cf(user_id: int, limit: int = 10):
    similarity_df, user_item_matrix = build_item_similarity_matrix()

    if similarity_df is None or user_item_matrix is None:
        return get_popular_books(limit)

    if user_id not in user_item_matrix.index:
        return get_popular_books(limit)

    user_scores = user_item_matrix.loc[user_id]

    interacted_books = user_scores[user_scores > 0]

    if interacted_books.empty:
        return get_popular_books(limit)

    recommendation_scores = {}

    for interacted_book_id, user_score in interacted_books.items():
        if interacted_book_id not in similarity_df.index:
            continue

        similar_books = similarity_df[interacted_book_id]

        for candidate_book_id, similarity_score in similar_books.items():
            if candidate_book_id in interacted_books.index:
                continue

            if similarity_score <= 0:
                continue

            recommendation_scores[candidate_book_id] = (
                recommendation_scores.get(candidate_book_id, 0)
                + similarity_score * user_score
            )

    if not recommendation_scores:
        return get_popular_books(limit)

    books = load_books()
    active_book_ids = set(books["book_id"].astype(int).tolist())

    recommendations = []

    for book_id, score in recommendation_scores.items():
        if int(book_id) not in active_book_ids:
            continue

        recommendations.append({
            "bookId": int(book_id),
            "score": round(float(score), 2),
            "reason": "Users with similar behavior also interacted with this book"
        })

    recommendations.sort(key=lambda item: item["score"], reverse=True)

    return recommendations[:limit]

def get_similar_books_item_cf(book_id: int, limit: int = 10):
    similarity_df, user_item_matrix = build_item_similarity_matrix()

    if similarity_df is None:
        return []

    if book_id not in similarity_df.index:
        return []

    similar_scores = similarity_df[book_id].drop(index=book_id)

    similar_scores = similar_scores.sort_values(ascending=False)

    books = load_books()
    active_book_ids = set(books["book_id"].astype(int).tolist())

    recommendations = []

    for candidate_book_id, score in similar_scores.items():
        if int(candidate_book_id) not in active_book_ids:
            continue

        if score <= 0:
            continue

        recommendations.append({
            "bookId": int(candidate_book_id),
            "score": round(float(score), 4),
            "reason": "Collaborative item similarity"
        })

        if len(recommendations) >= limit:
            break

    return recommendations