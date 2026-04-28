from app.data_loader import (
    load_books,
    load_book_categories,
    load_book_authors,
    load_user_events,
    load_user_purchases,
    load_all_purchases
)
from app.data_loader import load_order_items


def get_popular_books(limit: int = 10):
    books = load_books()
    purchases = load_all_purchases()

    if books.empty:
        return []

    if purchases.empty:
        books["score"] = books["avg_rating"].fillna(0) * 2
    else:
        sold = purchases.groupby("book_id")["quantity"].sum().reset_index()
        sold.rename(columns={"quantity": "total_sold"}, inplace=True)

        books = books.merge(sold, on="book_id", how="left")
        books["total_sold"] = books["total_sold"].fillna(0)

        books["score"] = (
            books["total_sold"] * 5
            + books["avg_rating"].fillna(0) * 2
        )

    books = books.sort_values("score", ascending=False)

    return [
        {
            "bookId": int(row["book_id"]),
            "score": round(float(row["score"]), 2),
            "reason": "Popular book"
        }
        for _, row in books.head(limit).iterrows()
    ]

def build_user_profile(user_id: int):
    books = load_books()
    book_categories = load_book_categories()
    book_authors = load_book_authors()
    events = load_user_events(user_id)
    purchases = load_user_purchases(user_id)

    if events.empty and purchases.empty:
        return None

    user_book_scores = []

    if not events.empty:
        event_books = events[["book_id", "value"]].copy()
        event_books["score"] = event_books["value"].fillna(1)
        user_book_scores.append(event_books[["book_id", "score"]])

    if not purchases.empty:
        purchase_books = purchases[["book_id", "quantity"]].copy()
        purchase_books["score"] = purchase_books["quantity"].fillna(1) * 8
        user_book_scores.append(purchase_books[["book_id", "score"]])

    user_books = (
        __import__("pandas").concat(user_book_scores, ignore_index=True)
        .groupby("book_id", as_index=False)["score"]
        .sum()
    )

    user_categories = user_books.merge(book_categories, on="book_id")
    category_scores = (
        user_categories
        .groupby("category_id")["score"]
        .sum()
        .to_dict()
    )

    user_authors = user_books.merge(book_authors, on="book_id")
    author_scores = (
        user_authors
        .groupby("author_id")["score"]
        .sum()
        .to_dict()
    )

    user_publishers = user_books.merge(
        books[["book_id", "publisher_id"]],
        on="book_id",
        how="left"
    )

    publisher_scores = (
        user_publishers
        .dropna(subset=["publisher_id"])
        .groupby("publisher_id")["score"]
        .sum()
        .to_dict()
    )

    return {
        "interacted_books": set(user_books["book_id"].tolist()),
        "category_scores": category_scores,
        "author_scores": author_scores,
        "publisher_scores": publisher_scores
    }

def recommend_for_user(user_id: int, limit: int = 10):
    books = load_books()
    book_categories = load_book_categories()
    book_authors = load_book_authors()

    profile = build_user_profile(user_id)

    if profile is None:
        return get_popular_books(limit)

    interacted_books = profile["interacted_books"]
    category_scores = profile["category_scores"]
    author_scores = profile["author_scores"]
    publisher_scores = profile["publisher_scores"]

    recommendations = []

    for _, book in books.iterrows():
        book_id = book["book_id"]

        if book_id in interacted_books:
            continue

        score = 0.0
        reasons = []

        current_categories = book_categories[
            book_categories["book_id"] == book_id
        ]["category_id"].tolist()

        for category_id in current_categories:
            if category_id in category_scores:
                score += category_scores[category_id] * 0.6
                reasons.append("same category")

        current_authors = book_authors[
            book_authors["book_id"] == book_id
        ]["author_id"].tolist()

        for author_id in current_authors:
            if author_id in author_scores:
                score += author_scores[author_id] * 0.8
                reasons.append("same author")

        publisher_id = book["publisher_id"]

        if publisher_id in publisher_scores:
            score += publisher_scores[publisher_id] * 0.3
            reasons.append("same publisher")

        score += float(book["avg_rating"] or 0) * 2

        if score > 0:
            recommendations.append({
                "bookId": int(book_id),
                "score": round(score, 2),
                "reason": ", ".join(sorted(set(reasons))) or "Recommended for you"
            })

    recommendations.sort(key=lambda item: item["score"], reverse=True)

    if len(recommendations) == 0:
        return get_popular_books(limit)

    return recommendations[:limit]

def get_similar_books(book_id: int, limit: int = 10):
    books = load_books()
    book_categories = load_book_categories()
    book_authors = load_book_authors()

    target_book = books[books["book_id"] == book_id]

    if target_book.empty:
        return []

    target_book = target_book.iloc[0]

    target_categories = set(
        book_categories[
            book_categories["book_id"] == book_id
        ]["category_id"].tolist()
    )

    target_authors = set(
        book_authors[
            book_authors["book_id"] == book_id
        ]["author_id"].tolist()
    )

    target_publisher = target_book["publisher_id"]

    recommendations = []

    for _, book in books.iterrows():
        current_book_id = book["book_id"]

        if current_book_id == book_id:
            continue

        score = 0.0
        reasons = []

        current_categories = set(
            book_categories[
                book_categories["book_id"] == current_book_id
            ]["category_id"].tolist()
        )

        same_categories = target_categories.intersection(current_categories)

        if same_categories:
            score += len(same_categories) * 5
            reasons.append("same category")

        current_authors = set(
            book_authors[
                book_authors["book_id"] == current_book_id
            ]["author_id"].tolist()
        )

        same_authors = target_authors.intersection(current_authors)

        if same_authors:
            score += len(same_authors) * 4
            reasons.append("same author")

        if book["publisher_id"] == target_publisher:
            score += 2
            reasons.append("same publisher")

        score += float(book["avg_rating"] or 0) * 2

        if score > 0:
            recommendations.append({
                "bookId": int(current_book_id),
                "score": round(score, 2),
                "reason": ", ".join(reasons)
            })

    recommendations.sort(key=lambda item: item["score"], reverse=True)

    return recommendations[:limit]

def get_frequently_bought_together(book_id: int, limit: int = 10):
    books = load_books()
    order_items = load_order_items()

    if order_items.empty:
        return []

    orders_with_target_book = order_items[
        order_items["book_id"] == book_id
    ]["order_id"].unique()

    other_books = order_items[
        (order_items["order_id"].isin(orders_with_target_book))
        & (order_items["book_id"] != book_id)
    ]

    if other_books.empty:
        return []

    bought_together = (
        other_books
        .groupby("book_id")["quantity"]
        .sum()
        .reset_index()
    )

    bought_together.rename(
        columns={"quantity": "co_purchase_score"},
        inplace=True
    )

    result = bought_together.merge(books, on="book_id", how="inner")

    result["score"] = (
        result["co_purchase_score"] * 10
        + result["avg_rating"].fillna(0) * 2
    )

    result = result.sort_values("score", ascending=False)

    return [
        {
            "bookId": int(row["book_id"]),
            "score": round(float(row["score"]), 2),
            "reason": "Frequently bought together"
        }
        for _, row in result.head(limit).iterrows()
    ]