import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import books, recommendations
from app.data_access.database import get_books_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="KaTiLa AI Recommender Service",
    description="Hybrid recommendation engine combining collaborative and content-based filtering",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommendations.router)
app.include_router(books.router)


@app.get("/", response_model=dict, summary="Welcome endpoint", tags=["Info"])
def read_root():
    return {
        "message": "KaTiLa AI Recommender Service is running",
        "version": "1.0.0",
        "docs": "/docs",
        "api_base": "/api",
    }


@app.get("/health", response_model=dict, summary="Health check", tags=["Info"])
def health_check() -> dict:
    try:
        books_df = get_books_data()
        return {
            "status": "healthy",
            "database": "connected",
            "total_books": len(books_df),
            "message": "Service is operational",
        }
    except Exception as exc:
        logger.error("Health check failed: %s", exc)
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(exc),
            "message": "Service has issues",
        }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error("Unhandled exception: %s", exc)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc),
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
