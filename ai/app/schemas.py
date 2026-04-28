from pydantic import BaseModel
from typing import List, Optional


class RecommendationItem(BaseModel):
    bookId: int
    score: float
    reason: str


class RecommendationResponse(BaseModel):
    userId: Optional[int] = None
    bookId: Optional[int] = None
    recommendations: List[RecommendationItem]