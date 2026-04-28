import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.recommender import (get_popular_books)

from app.data_loader import (
    load_books,
    load_book_category_names,
    load_book_author_names,
    load_user_events,
    load_user_purchases
)

def build_book_content_dataframe():
    books = load_books()
    categories = load_book_category_names()
    authors = load_book_author_names()

    if books.empty:
        return books

    category_text = (
        categories
        .groupby("book_id")["category_name"]
        .apply(lambda values: " ".join(values.dropna().astype(str)))
        .reset_index()
    )

    author_text = (
        authors
        .groupby("book_id")["author_name"]
        .apply(lambda values: " ".join(values.dropna().astype(str)))
        .reset_index()
    )

    books = books.merge(category_text, on="book_id", how="left")
    books = books.merge(author_text, on="book_id", how="left")

    books["category_name"] = books["category_name"].fillna("")
    books["author_name"] = books["author_name"].fillna("")
    books["description"] = books["description"].fillna("")
    books["title"] = books["title"].fillna("")
    books["language"] = books["language"].fillna("")
    books["cover_type"] = books["cover_type"].fillna("")
    books["publisher_id"] = books["publisher_id"].fillna("").astype(str)

    books["content"] = (
        books["title"] + " "
        + books["description"] + " "
        + books["category_name"] + " "
        + books["author_name"] + " "
        + books["language"] + " "
        + books["cover_type"] + " "
        + books["publisher_id"]
    )

    return books

def build_tfidf_matrix():
    books = build_book_content_dataframe()

    if books.empty:
        return books, None, None

    vectorizer = TfidfVectorizer(
        stop_words="english",
        lowercase=True,
        max_features=5000
    )

    tfidf_matrix = vectorizer.fit_transform(books["content"])

    return books, vectorizer, tfidf_matrix

def get_similar_books_cosine(book_id: int, limit: int = 10):
    books, vectorizer, tfidf_matrix = build_tfidf_matrix()

    if books.empty or tfidf_matrix is None:
        return []

    book_indices = books.index[books["book_id"] == book_id].tolist()

    if not book_indices:
        return []

    target_index = book_indices[0]

    similarities = cosine_similarity(
        tfidf_matrix[target_index],
        tfidf_matrix
    ).flatten()

    books = books.copy()
    books["similarity_score"] = similarities

    result = books[books["book_id"] != book_id].copy()

    result = result.sort_values(
        by=["similarity_score", "avg_rating"],
        ascending=False
    )

    recommendations = []

    for _, row in result.head(limit).iterrows():
        recommendations.append({
            "bookId": int(row["book_id"]),
            "score": round(float(row["similarity_score"]), 4),
            "reason": "Content-based cosine similarity"
        })

    return recommendations

def get_user_interacted_book_ids(user_id: int):
    events = load_user_events(user_id)
    purchases = load_user_purchases(user_id)

    book_ids = set()

    if not events.empty:
        book_ids.update(events["book_id"].dropna().astype(int).tolist())

    if not purchases.empty:
        book_ids.update(purchases["book_id"].dropna().astype(int).tolist())

    return book_ids

def recommend_for_user_cosine(user_id: int, limit: int = 10):
    books, vectorizer, tfidf_matrix = build_tfidf_matrix()

    if books.empty or tfidf_matrix is None:
        return []

    interacted_book_ids = get_user_interacted_book_ids(user_id)

    if not interacted_book_ids:
        return []

    interacted_indices = books.index[
        books["book_id"].isin(interacted_book_ids)
    ].tolist()

    if not interacted_indices:
        return []

    user_profile_vector = tfidf_matrix[interacted_indices].mean(axis=0)

    similarities = cosine_similarity(
        user_profile_vector,
        tfidf_matrix
    ).flatten()

    books = books.copy()
    books["similarity_score"] = similarities

    result = books[~books["book_id"].isin(interacted_book_ids)].copy()

    result["final_score"] = (
        result["similarity_score"] * 100
        + result["avg_rating"].fillna(0) * 2
    )

    result = result.sort_values("final_score", ascending=False)

    recommendations = []

    for _, row in result.head(limit).iterrows():
        recommendations.append({
            "bookId": int(row["book_id"]),
            "score": round(float(row["final_score"]), 2),
            "reason": "Similar to books you interacted with"
        })

    return recommendations

def recommend_for_user_cosine_with_fallback(user_id: int, limit: int = 10):
    recommendations = recommend_for_user_cosine(user_id, limit)

    if not recommendations:
        return get_popular_books(limit)

    return recommendations