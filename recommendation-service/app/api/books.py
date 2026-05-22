from fastapi import APIRouter, HTTPException, Query

from app.core.config import settings
from app.models.schemas import BookRecommendation, RelatedBooksResponse
from app.services.hybrid_engine import HybridRecommendationEngine

router = APIRouter(prefix="/api/books", tags=["Books"])

hybrid_engine = HybridRecommendationEngine(
    collab_weight=settings.COLLAB_WEIGHT,
    content_weight=settings.CONTENT_WEIGHT,
    qdrant_host=settings.QDRANT_HOST,
    qdrant_port=settings.QDRANT_PORT,
)


@router.get(
    "/{book_id}/related",
    response_model=RelatedBooksResponse,
    summary="Find related books",
)
async def get_related_books(
    book_id: int,
    top_n: int = Query(10, ge=1, le=50, description="Number of related books"),
) -> RelatedBooksResponse:
    if book_id <= 0:
        raise HTTPException(status_code=400, detail="book_id must be greater than 0")

    try:
        result = hybrid_engine.get_related_books(book_id, top_n=top_n)
        related_books = [
            BookRecommendation(
                book_id=rec["book_id"],
                title=rec.get("title"),
                score=rec.get("score", rec.get("predicted_rating", 0) / 5),
                predicted_rating=rec.get("predicted_rating"),
                type=rec.get("type", "similar-content"),
            )
            for rec in result["related_books"]
        ]

        return RelatedBooksResponse(
            book_id=book_id,
            book_title=result.get("book_title"),
            related_books=related_books,
            total_count=result["total_count"],
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Related-books failed: {exc}")


@router.get(
    "/{book_id}/related/simple",
    response_model=list[dict],
    summary="Find related books in simple format",
)
async def get_related_books_simple(
    book_id: int,
    top_n: int = Query(10, ge=1, le=50),
) -> list[dict]:
    if book_id <= 0:
        raise HTTPException(status_code=400, detail="book_id must be greater than 0")

    try:
        result = hybrid_engine.get_related_books(book_id, top_n=top_n)
        return [
            {
                "book_id": rec["book_id"],
                "title": rec.get("title"),
                "score": rec["score"],
                "predicted_rating": rec.get("predicted_rating"),
            }
            for rec in result["related_books"]
        ]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Related-books failed: {exc}")


@router.get(
    "/{book_id}/info",
    summary="Get cached book info",
)
async def get_book_info(book_id: int) -> dict:
    if book_id <= 0:
        raise HTTPException(status_code=400, detail="book_id must be greater than 0")

    try:
        if hybrid_engine._books_cache is None or hybrid_engine._books_cache.empty:
            hybrid_engine._load_books_cache()

        if hybrid_engine._books_cache is None or hybrid_engine._books_cache.empty:
            raise HTTPException(status_code=404, detail="No book data is loaded")

        book_info = hybrid_engine._books_cache[
            hybrid_engine._books_cache["book_id"].astype(int) == int(book_id)
        ]

        if book_info.empty:
            raise HTTPException(status_code=404, detail=f"Book {book_id} was not found")

        row = book_info.iloc[0]
        return {
            "book_id": int(row["book_id"]),
            "title": row.get("title"),
            "description": row.get("description"),
            "authors": row.get("authors"),
            "categories": row.get("categories"),
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Book info failed: {exc}")


@router.get(
    "/search/by-title",
    summary="Search books by title",
)
async def search_books_by_title(
    title: str = Query(..., min_length=1, description="Book title query"),
    limit: int = Query(10, ge=1, le=50),
) -> list[dict]:
    try:
        if hybrid_engine._books_cache is None or hybrid_engine._books_cache.empty:
            hybrid_engine._load_books_cache()

        if hybrid_engine._books_cache is None or hybrid_engine._books_cache.empty:
            raise HTTPException(status_code=404, detail="No book data is loaded")

        matches = hybrid_engine._books_cache[
            hybrid_engine._books_cache["title"].str.contains(title, case=False, na=False)
        ]

        return [
            {
                "book_id": int(row["book_id"]),
                "title": row["title"],
                "authors": row.get("authors"),
                "categories": row.get("categories"),
            }
            for _, row in matches.head(limit).iterrows()
        ]
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Search failed: {exc}")
