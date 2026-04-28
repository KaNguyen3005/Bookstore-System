import pandas as pd
from sqlalchemy import text
from app.database import engine


def load_books():
    query = """
        SELECT 
            book_id,
            title,
            description,
            language,
            cover_type,
            publisher_id,
            avg_rating,
            stock_quantity,
            price,
            created_at
        FROM books
        WHERE deleted_at IS NULL
          AND is_active = 1
          AND stock_quantity > 0
    """

    return pd.read_sql(query, engine)

def load_book_categories():
    query = """
        SELECT book_id, category_id
        FROM book_category
    """

    return pd.read_sql(query, engine)

def load_book_category_names():
    query = """
        SELECT 
            bc.book_id,
            c.category_name
        FROM book_category bc
        JOIN categories c ON bc.category_id = c.category_id
        WHERE c.deleted_at IS NULL
    """

    return pd.read_sql(query, engine)

def load_book_author_names():
    query = """
        SELECT 
            ba.book_id,
            a.author_name
        FROM book_author ba
        JOIN authors a ON ba.author_id = a.author_id
        WHERE a.deleted_at IS NULL
    """

    return pd.read_sql(query, engine)

def load_book_authors():
    query = """
        SELECT book_id, author_id
        FROM book_author
    """

    return pd.read_sql(query, engine)


def load_user_events(user_id: int):
    query = text("""
        SELECT 
            user_id,
            book_id,
            event_type,
            value,
            event_time
        FROM interact_events
        WHERE user_id = :user_id
          AND book_id IS NOT NULL
          AND deleted_at IS NULL
    """)

    return pd.read_sql(query, engine, params={"user_id": user_id})


def load_user_purchases(user_id: int):
    query = text("""
        SELECT 
            o.customer_id AS user_id,
            bo.book_id,
            bo.quantity,
            o.created_at
        FROM orders o
        JOIN book_order bo ON o.order_id = bo.order_id
        WHERE o.customer_id = :user_id
          AND o.deleted_at IS NULL
          AND bo.deleted_at IS NULL
          AND o.status IN ('CONFIRMED', 'SHIPPING', 'DELIVERED', 'COMPLETED')
    """)

    return pd.read_sql(query, engine, params={"user_id": user_id})


def load_all_purchases():
    query = """
        SELECT 
            bo.book_id,
            bo.quantity,
            o.status,
            o.created_at
        FROM book_order bo
        JOIN orders o ON bo.order_id = o.order_id
        WHERE o.deleted_at IS NULL
          AND bo.deleted_at IS NULL
          AND o.status IN ('CONFIRMED', 'SHIPPING', 'DELIVERED', 'COMPLETED')
    """

    return pd.read_sql(query, engine)


def load_order_items():
    query = """
        SELECT 
            o.order_id,
            o.customer_id AS user_id,
            bo.book_id,
            bo.quantity
        FROM orders o
        JOIN book_order bo ON o.order_id = bo.order_id
        WHERE o.deleted_at IS NULL
          AND bo.deleted_at IS NULL
          AND o.status IN ('CONFIRMED', 'SHIPPING', 'DELIVERED', 'COMPLETED')
    """


def load_all_user_interactions():
    event_query = """
        SELECT 
            user_id,
            book_id,
            value AS score
        FROM interact_events
        WHERE deleted_at IS NULL
          AND user_id IS NOT NULL
          AND book_id IS NOT NULL
    """

    purchase_query = """
        SELECT 
            o.customer_id AS user_id,
            bo.book_id,
            bo.quantity * 8 AS score
        FROM orders o
        JOIN book_order bo ON o.order_id = bo.order_id
        WHERE o.deleted_at IS NULL
          AND bo.deleted_at IS NULL
          AND o.customer_id IS NOT NULL
          AND bo.book_id IS NOT NULL
          AND o.status IN ('CONFIRMED', 'SHIPPING', 'DELIVERED', 'COMPLETED')
    """

    events = pd.read_sql(event_query, engine)
    purchases = pd.read_sql(purchase_query, engine)

    interactions = pd.concat([events, purchases], ignore_index=True)

    if interactions.empty:
        return interactions

    interactions = (
        interactions
        .groupby(["user_id", "book_id"], as_index=False)["score"]
        .sum()
    )

    return interactions