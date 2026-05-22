"""
API Routes Package

Contains all API endpoint definitions for the recommendation service.
"""

from . import recommendations
from . import books

__all__ = ["recommendations", "books"]
