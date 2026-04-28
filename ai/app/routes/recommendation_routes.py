from fastapi import APIRouter, Query
from app.schemas import RecommendationResponse
from app.recommender import (
    get_popular_books,
    recommend_for_user,
    get_similar_books,
    get_frequently_bought_together,
)
from app.content_based import (
    get_similar_books_cosine,
    recommend_for_user_cosine_with_fallback
)

from app.collaborative import (
    recommend_for_user_item_cf,
    get_similar_books_item_cf
)

from app.hybrid import recommend_for_user_hybrid

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)


@router.get("/popular", response_model=RecommendationResponse)
def popular_books(limit: int = Query(default=10, ge=1, le=50)):
    return {
        "userId": None,
        "bookId": None,
        "recommendations": get_popular_books(limit)
    }


@router.get("/users/{user_id}", response_model=RecommendationResponse)
def user_recommendations(
    user_id: int,
    limit: int = Query(default=10, ge=1, le=50)
):
    return {
        "userId": user_id,
        "bookId": None,
        "recommendations": recommend_for_user(user_id, limit)
    }


@router.get("/books/{book_id}/similar", response_model=RecommendationResponse)
def similar_books(
    book_id: int,
    limit: int = Query(default=10, ge=1, le=50)
):
    return {
        "userId": None,
        "bookId": book_id,
        "recommendations": get_similar_books(book_id, limit)
    }


@router.get("/books/{book_id}/frequently-bought-together", response_model=RecommendationResponse)
def frequently_bought_together(
    book_id: int,
    limit: int = Query(default=10, ge=1, le=50)
):
    return {
        "userId": None,
        "bookId": book_id,
        "recommendations": get_frequently_bought_together(book_id, limit)
    }

@router.get("/v2/users/{user_id}/content-based", response_model=RecommendationResponse)
def user_content_based_recommendations(
    user_id: int,
    limit: int = Query(default=10, ge=1, le=50)
):
    return {
        "userId": user_id,
        "bookId": None,
        "recommendations": recommend_for_user_cosine_with_fallback(user_id, limit)
    }


@router.get("/v2/books/{book_id}/similar", response_model=RecommendationResponse)
def similar_books_content_based(
    book_id: int,
    limit: int = Query(default=10, ge=1, le=50)
):
    return {
        "userId": None,
        "bookId": book_id,
        "recommendations": get_similar_books_cosine(book_id, limit)
    }

@router.get("/v3/users/{user_id}/collaborative", response_model=RecommendationResponse)
def user_collaborative_recommendations(
    user_id: int,
    limit: int = Query(default=10, ge=1, le=50)
):
    return {
        "userId": user_id,
        "bookId": None,
        "recommendations": recommend_for_user_item_cf(user_id, limit)
    }


@router.get("/v3/books/{book_id}/similar", response_model=RecommendationResponse)
def similar_books_collaborative(
    book_id: int,
    limit: int = Query(default=10, ge=1, le=50)
):
    return {
        "userId": None,
        "bookId": book_id,
        "recommendations": get_similar_books_item_cf(book_id, limit)
    }

@router.get("/v4/users/{user_id}/hybrid", response_model=RecommendationResponse)
def user_hybrid_recommendations(
    user_id: int,
    limit: int = Query(default=10, ge=1, le=50)
):
    return {
        "userId": user_id,
        "bookId": None,
        "recommendations": recommend_for_user_hybrid(user_id, limit)
    }