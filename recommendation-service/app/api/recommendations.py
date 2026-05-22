from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import (
    RecommendationResponse,
    BookRecommendation,
    TrainingResponse,
    TrainRequest
)
from app.core.config import settings
from app.services.hybrid_engine import HybridRecommendationEngine

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

# Khởi tạo engine
hybrid_engine = HybridRecommendationEngine(
    collab_weight=settings.COLLAB_WEIGHT,
    content_weight=settings.CONTENT_WEIGHT,
    qdrant_host=settings.QDRANT_HOST,
    qdrant_port=settings.QDRANT_PORT
)


@router.get(
    "/user/{user_id}",
    response_model=RecommendationResponse,
    summary="Gợi ý sách cho người dùng",
    description="Lấy danh sách sách được gợi ý cho một người dùng cụ thể sử dụng hybrid recommendation"
)
async def get_recommendations(
    user_id: int,
    top_n: int = Query(10, ge=1, le=100, description="Số sách gợi ý (1-100)")
) -> RecommendationResponse:
    """
    Gợi ý sách kết hợp từ Collaborative & Content-based Filtering
    
    **Các type gợi ý:**
    - `hybrid`: Kết hợp từ 2 engines
    - `collaborative`: Chỉ từ collaborative filtering
    - `content-based`: Chỉ từ content-based filtering
    - `popular`: Danh sách sách phổ biến (fallback)
    
    **Example:**
    ```
    GET /api/recommendations/user/25?top_n=10
    ```
    """
    if user_id <= 0:
        raise HTTPException(status_code=400, detail="user_id phải > 0")
    
    try:
        result = hybrid_engine.recommend(user_id, top_n=top_n)
        
        recommendations = [
            BookRecommendation(
                book_id=rec['book_id'],
                title=rec.get('title'),
                score=rec.get('score', rec.get('predicted_rating', 0) / 5),
                predicted_rating=rec.get('predicted_rating'),
                type=rec.get('type', 'hybrid')
            )
            for rec in result['recommendations']
        ]
        
        return RecommendationResponse(
            user_id=user_id,
            recommendations=recommendations,
            total_count=result['total_count'],
            method=result['method']
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi tính toán gợi ý: {str(e)}"
        )


@router.get(
    "/user/{user_id}/simple",
    response_model=list[dict],
    summary="Gợi ý sách (format đơn giản)",
    description="Lấy danh sách sách được gợi ý với format JSON đơn giản"
)
async def get_recommendations_simple(
    user_id: int,
    top_n: int = Query(10, ge=1, le=100)
) -> list[dict]:
    """
    Trả về danh sách sách gợi ý dạng đơn giản
    
    **Example response:**
    ```json
    [
        {
            "book_id": 123,
            "title": "Tiêu đề sách",
            "score": 0.95,
            "predicted_rating": 4.75
        }
    ]
    ```
    """
    if user_id <= 0:
        raise HTTPException(status_code=400, detail="user_id phải > 0")
    
    try:
        result = hybrid_engine.recommend(user_id, top_n=top_n)
        return [
            {
                'book_id': rec['book_id'],
                'title': rec.get('title'),
                'score': rec['score'],
                'predicted_rating': rec.get('predicted_rating')
            }
            for rec in result['recommendations']
        ]
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi: {str(e)}"
        )


@router.post(
    "/train",
    response_model=TrainingResponse,
    summary="Train các recommendation engines",
    description="Huấn luyện Collaborative & Content-based engines"
)
async def train_engines(request: TrainRequest = None) -> TrainingResponse:
    """
    Huấn luyện các recommendation engines từ dữ liệu mới
    
    **Cảnh báo:** Thao tác này có thể mất vài phút
    
    **Example:**
    ```json
    {
        "retrain_collaborative": true,
        "retrain_content": true
    }
    ```
    """
    if request is None:
        request = TrainRequest()
    
    try:
        result = hybrid_engine.train_engines(
            retrain_collaborative=request.retrain_collaborative,
            retrain_content=request.retrain_content
        )
        
        return TrainingResponse(
            status=result['status'],
            message=result['message'],
            collaborative_trained=result['collaborative_trained'],
            content_trained=result['content_trained']
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi training: {str(e)}"
        )


@router.get(
    "/stats",
    summary="Thống kê về recommendation engines",
    description="Lấy thông tin thống kê về các engines"
)
async def get_engine_stats() -> dict:
    """
    Lấy thống kê về:
    - Số sách đã được vectorize
    - Trạng thái của các engines
    - Thông tin cấu hình
    """
    try:
        stats = {
            "status": "healthy",
            "hybrid_engine": {
                "collaborative_weight": hybrid_engine.collab_weight,
                "content_weight": hybrid_engine.content_weight
            },
            "collaborative_engine": {
                "collection_name": hybrid_engine.collaborative_engine.collection_name
            },
            "content_engine": {
                "vector_size": hybrid_engine.content_engine.vector_size,
                "book_collection": hybrid_engine.content_engine.book_col,
                "user_collection": hybrid_engine.content_engine.user_col
            }
        }
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi: {str(e)}"
        )
