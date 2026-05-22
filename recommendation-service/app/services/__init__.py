"""
Recommendation Engines Package

Contains all recommendation engines:
- collaborative_engine: Item-based collaborative filtering
- content_engine: Content-based filtering using TF-IDF
- hybrid_engine: Hybrid recommender combining both approaches
"""

from . import collaborative_engine
from . import content_engine
from . import hybrid_engine

__all__ = ["collaborative_engine", "content_engine", "hybrid_engine"]
