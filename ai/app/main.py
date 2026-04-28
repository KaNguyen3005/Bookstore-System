from fastapi import FastAPI
from app.routes.recommendation_routes import router as recommendation_router

app = FastAPI(
    title="Bookstore Recommendation Service",
    version="1.0.0"
)

app.include_router(recommendation_router)


@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "recommendation-service"
    }


# uvicorn app.main:app --reload --port 8000