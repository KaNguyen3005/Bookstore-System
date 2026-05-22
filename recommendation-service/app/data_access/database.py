from sqlalchemy import create_engine, text
import pandas as pd
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)

pd.set_option("display.max_columns", None)
pd.set_option("display.max_colwidth", None)
pd.set_option("display.max_rows", 100)


def get_books_data():
    """Get active book data with authors and categories."""
    query = """
        SELECT
            b.book_id,
            b.title,
            b.description,
            GROUP_CONCAT(DISTINCT a.author_name) AS authors,
            GROUP_CONCAT(DISTINCT c.category_name) AS categories
        FROM books b
        LEFT JOIN book_author ba ON b.book_id = ba.book_id
        LEFT JOIN authors a ON ba.author_id = a.author_id
        LEFT JOIN book_category bc ON b.book_id = bc.book_id
        LEFT JOIN categories c ON bc.category_id = c.category_id
        WHERE b.is_active = 1
            AND b.deleted_at IS NULL
        GROUP BY b.book_id, b.title, b.description
    """
    return pd.read_sql(query, engine)


def get_detailed_interactions(user_id):
    """Get detailed user interactions used by the Rocchio content profile."""
    query = text("""
        SELECT book_id, event_type, value
        FROM interact_events
        WHERE user_id = :user_id
            AND book_id IS NOT NULL
    """)
    return pd.read_sql(query, engine, params={"user_id": int(user_id)})


def get_popular_books_from_db(top_n):
    """Return popular active books for cold-start and fallback cases."""
    query = text("""
        SELECT
            b.book_id,
            b.title,
            COUNT(i.interact_event_id) AS interaction_count
        FROM books b
        LEFT JOIN interact_events i ON b.book_id = i.book_id
        WHERE b.is_active = 1
            AND b.deleted_at IS NULL
        GROUP BY b.book_id, b.title
        ORDER BY interaction_count DESC, b.book_id ASC
        LIMIT :top_n
    """)
    return pd.read_sql(query, engine, params={"top_n": int(top_n)})


def get_all_ratings():
    """Get all delivered ratings for the item-item collaborative matrix."""
    query = """
        SELECT
            o.customer_id AS user_id,
            bo.book_id,
            AVG(bo.rate) AS rating
        FROM book_order bo
        INNER JOIN orders o ON bo.order_id = o.order_id
        INNER JOIN users u ON o.customer_id = u.user_id
        INNER JOIN books b ON bo.book_id = b.book_id
        WHERE bo.rate IS NOT NULL
            AND bo.rate > 0
            AND o.status = 'DELIVERED'
            AND bo.deleted_at IS NULL
            AND o.deleted_at IS NULL
            AND u.deleted_at IS NULL
            AND b.deleted_at IS NULL
            AND b.is_active = 1
        GROUP BY o.customer_id, bo.book_id
    """
    return pd.read_sql(query, engine)


def get_unread_books(user_id):
    """Get active books the user has not rated yet."""
    query = text("""
        SELECT b.book_id
        FROM books b
        WHERE b.deleted_at IS NULL
            AND b.is_active = 1
            AND b.book_id NOT IN (
                SELECT DISTINCT bo.book_id
                FROM book_order bo
                INNER JOIN orders o ON bo.order_id = o.order_id
                WHERE o.customer_id = :user_id
                    AND bo.rate IS NOT NULL
                    AND bo.deleted_at IS NULL
                    AND o.deleted_at IS NULL
            )
    """)
    df = pd.read_sql(query, engine, params={"user_id": int(user_id)})
    return df["book_id"].astype(int).tolist()


def get_book_mean_ratings():
    """Get the mean rating of each active book."""
    query = """
        SELECT
            bo.book_id,
            AVG(bo.rate) AS mean_rating
        FROM book_order bo
        INNER JOIN orders o ON bo.order_id = o.order_id
        INNER JOIN books b ON bo.book_id = b.book_id
        WHERE bo.rate IS NOT NULL
            AND bo.rate > 0
            AND o.status = 'DELIVERED'
            AND bo.deleted_at IS NULL
            AND o.deleted_at IS NULL
            AND b.deleted_at IS NULL
            AND b.is_active = 1
        GROUP BY bo.book_id
    """
    df = pd.read_sql(query, engine)
    return {int(row["book_id"]): float(row["mean_rating"]) for _, row in df.iterrows()}


def get_user_ratings_dict(user_id):
    """Get {book_id: rating} for one user."""
    query = text("""
        SELECT
            bo.book_id,
            AVG(bo.rate) AS rating
        FROM book_order bo
        INNER JOIN orders o ON bo.order_id = o.order_id
        INNER JOIN books b ON bo.book_id = b.book_id
        WHERE o.customer_id = :user_id
            AND bo.rate IS NOT NULL
            AND bo.rate > 0
            AND o.status = 'DELIVERED'
            AND bo.deleted_at IS NULL
            AND o.deleted_at IS NULL
            AND b.deleted_at IS NULL
            AND b.is_active = 1
        GROUP BY bo.book_id
    """)
    df = pd.read_sql(query, engine, params={"user_id": int(user_id)})
    return {int(row["book_id"]): float(row["rating"]) for _, row in df.iterrows()}


def get_user_interacted_book_ids(user_id):
    """Get books the user has ordered/rated or interacted with."""
    query = text("""
        SELECT DISTINCT book_id
        FROM (
            SELECT bo.book_id
            FROM book_order bo
            INNER JOIN orders o ON bo.order_id = o.order_id
            WHERE o.customer_id = :user_id
                AND bo.deleted_at IS NULL
                AND o.deleted_at IS NULL

            UNION

            SELECT ie.book_id
            FROM interact_events ie
            WHERE ie.user_id = :user_id
                AND ie.book_id IS NOT NULL
        ) interacted_books
    """)
    df = pd.read_sql(query, engine, params={"user_id": int(user_id)})
    return df["book_id"].astype(int).tolist() if not df.empty else []


def get_user_books_interaction(user_id):
    """Backward-compatible alias for ordered books."""
    query = text("""
        SELECT DISTINCT bo.book_id
        FROM book_order bo
        INNER JOIN orders o ON bo.order_id = o.order_id
        WHERE o.customer_id = :user_id
            AND bo.deleted_at IS NULL
            AND o.deleted_at IS NULL
    """)
    df = pd.read_sql(query, engine, params={"user_id": int(user_id)})
    return df["book_id"].astype(int).tolist() if not df.empty else []


def get_top_rated_books(limit=20, min_ratings=5):
    """Get top-rated active books with a minimum number of ratings."""
    query = text("""
        SELECT
            bo.book_id,
            b.title,
            AVG(bo.rate) AS avg_rating,
            COUNT(bo.rate) AS rating_count
        FROM book_order bo
        INNER JOIN orders o ON bo.order_id = o.order_id
        INNER JOIN books b ON bo.book_id = b.book_id
        WHERE bo.rate IS NOT NULL
            AND bo.deleted_at IS NULL
            AND o.deleted_at IS NULL
            AND b.deleted_at IS NULL
            AND b.is_active = 1
        GROUP BY bo.book_id, b.title
        HAVING COUNT(bo.rate) >= :min_ratings
        ORDER BY avg_rating DESC
        LIMIT :limit
    """)
    return pd.read_sql(
        query,
        engine,
        params={"limit": int(limit), "min_ratings": int(min_ratings)},
    )


if __name__ == "__main__":
    print(get_books_data())
