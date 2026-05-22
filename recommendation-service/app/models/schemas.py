from typing import List, Optional

from pydantic import BaseModel


class TrainRequest(BaseModel):
    retrain_collaborative: bool = True
    retrain_content: bool = True


class BookRecommendation(BaseModel):
    book_id: int
    title: Optional[str] = None
    score: float
    predicted_rating: Optional[float] = None
    type: str


class RecommendationResponse(BaseModel):
    user_id: int
    recommendations: List[BookRecommendation]
    total_count: int
    method: str


class RelatedBooksResponse(BaseModel):
    book_id: int
    book_title: Optional[str] = None
    related_books: List[BookRecommendation]
    total_count: int


class TrainingResponse(BaseModel):
    status: str
    message: str
    collaborative_trained: bool
    content_trained: bool
