# Recommendation System - Complete Documentation Index

## 📚 Documentation Files

```
📁 recommendation-service/
├── 📄 HYBRID_ENGINE_FLOW.md              ← Tổng hợp hai engine
├── 📄 CONTENT_ENGINE_FLOW.md             ← Gợi ý dựa nội dung
├── 📄 COLLABORATIVE_ENGINE_FLOW.md       ← Gợi ý dựa hành vi
└── 📄 DOCUMENTATION_INDEX.md (this file) ← Bản đồ
```

---

## 🏗️ System Architecture Overview

```
                    ┌─────────────────────────────────────────┐
                    │     HybridRecommendationEngine          │
                    │   (Combines both approaches)            │
                    └──────────────┬──────────────────────────┘
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
        ┌───────▼────────┐  ┌──────▼──────┐  ┌──────▼──────┐
        │                │  │             │  │             │
        │ ContentEngine  │  │   Merge &   │  │ Collaborative
        │ (TF-IDF)       │  │  Weighted   │  │ Engine
        │ (Rocchio)      │  │  Average    │  │ (Item-Item CF)
        │ (Similarity)   │  │             │  │ (User patterns)
        └────┬───────────┘  └──────┬──────┘  └──────┬───────┘
             │                     │               │
        ┌────▼─────────────────┬───▼───┬──────────▼────┐
        │                      │       │               │
    ┌───▼────────────────┐ ┌───▼───┐ ┌▼────────────┐  │
    │  Qdrant Vector DB  │ │Fallback  │Database    │  │
    │ (books_collection) │ │(Popular) │(Ratings,   │  │
    │ (users_collection) │ │          │Interactions)  │
    └────────────────────┘ └─────────┘ └────────────┘  │
                                                        │
                                      ┌─────────────────▼─┐
                                      │  Recommendation   │
                                      │  Result           │
                                      └───────────────────┘
```

---

## 🎯 Which Engine to Use When?

### ContentEngine (Content-Based Filtering)

**When to use:**

- User is **new** (no history)
- Want **explainable** recommendations
- Have **good book metadata** (title, description, authors)
- Focus on **specific genres** or topics
- **Detail page**: "Similar books"

**Returns:**

```python
{
    "book_id": 101,
    "score": 0.92,  # Content similarity [0, 1]
    "type": "content-based"
}
```

**Advantages:**
✅ No cold start for items
✅ Interpretable (which keywords matter)
✅ Deterministic results

**Disadvantages:**
❌ New user problem
❌ Limited diversity
❌ Dependent on text quality

---

### CollaborativeEngine (Item-Item Filtering)

**When to use:**

- User has **rating history**
- Want to **discover serendipities**
- Book metadata is **incomplete**
- Focus on **user preferences**
- Need **collaborative signal**

**Returns:**

```python
{
    "book_id": 102,
    "predicted_rating": 4.3,  # Rating [1, 5]
    "type": "collaborative"
}
```

**Advantages:**
✅ Discover unexpected items
✅ Reflect user taste
✅ Fast inference
✅ No need for content

**Disadvantages:**
❌ Cold start for users/items
❌ Data sparsity
❌ Popularity bias

---

### HybridEngine (Both Methods)

**When to use:**

- Want **best of both worlds**
- Have **sufficient data**
- Want **robust recommendations**
- Tuning weights for **specific use case**

**Returns:**

```python
{
    "book_id": 103,
    "score": 0.825,
    "predicted_rating": 4.12,
    "type": "hybrid",
    "collab_score": 0.84,
    "content_score": 0.80
}
```

**Balancing Weights:**

```python
# More trust user behavior
HybridRecommendationEngine(collab_weight=0.7, content_weight=0.3)

# More trust content similarity
HybridRecommendationEngine(collab_weight=0.3, content_weight=0.7)

# Balanced (default)
HybridRecommendationEngine(collab_weight=0.5, content_weight=0.5)
```

---

## 📊 Data Flow Comparison

### ContentEngine Data Flow

```
Books in Database
    ↓
Extract Text (title + desc + author + category)
    ↓
TF-IDF Vectorization (2048 dimensions)
    ↓
Store in Qdrant (books_collection)
    ↓
User Interactions
    ↓
Rocchio Algorithm (Build user profile from liked/disliked)
    ↓
Store user vector in Qdrant (users_collection)
    ↓
Query: Find similar books to user profile
    ↓
Cosine Similarity scoring [0, 1]
```

### CollaborativeEngine Data Flow

```
User Ratings (1-5 stars)
    ↓
Create User-Item Matrix
    ↓
Calculate Book Means
    ↓
Center Matrix (remove popularity bias)
    ↓
Store in Qdrant (item_item_cf) → Each book = 1 vector
    ↓
For Prediction:
  - Find k similar books (cosine similarity)
  - That user HAS read
  - Calculate weighted average
  - Predict new rating [1, 5]
```

---

## 🔄 Training Workflow

### ContentEngine Training

```python
engine = ContentEngine()
engine.train()  # ~5-10 seconds
```

**What happens:**

1. Load all books from database
2. Extract text from title, description, authors, categories
3. Fit TF-IDF vectorizer on combined text
4. Transform each book to 2048-D vector
5. Save model to disk (tfidf_model.pkl)
6. Create/recreate Qdrant collections
7. Upload 10,000+ book vectors

**Storage**:

- Model file: ~50MB
- Qdrant: ~200MB (10k books × 2048 × 4 bytes)

---

### CollaborativeEngine Training

```python
engine = CollaborativeItemEngine()
engine.train_and_sync()  # ~10-20 seconds
```

**What happens:**

1. Load all user ratings from database
2. Create user-item matrix (pivot)
3. Calculate mean rating for each book
4. Center matrix (subtract means)
5. Create/recreate Qdrant collection
6. Upload each book as a vector (rating pattern)

**Storage**:

- Qdrant: ~150MB (10k books × 1000 users × 4 bytes)

---

## 🚀 Recommendation Process Comparison

### ContentEngine Recommendation

```
User 5 wants recommendations
    │
    ├─ Get/Build user profile from interactions
    │  (liked books, disliked books)
    │
    ├─ Apply Rocchio algorithm
    │  Combine: baseline + positive - negative
    │  Normalize
    │
    └─ Query Qdrant
       Find similar book vectors
       Return top 10 by cosine similarity

Time: ~100-200ms
```

### CollaborativeEngine Recommendation

```
User 5 wants recommendations
    │
    ├─ Get user's read books & ratings
    │  (from database)
    │
    ├─ Get unread books list
    │
    ├─ For EACH unread book:
    │  - Get target book vector from Qdrant
    │  - Query k similar books (in rating pattern)
    │  - Among those, find ones user HAS read
    │  - Calculate weighted average of ratings
    │  - Predict new rating [1, 5]
    │
    └─ Sort predictions by rating
       Return top 10

Time: ~200-500ms (loop over many books)
```

### HybridEngine Recommendation

```
User 5 wants recommendations
    │
    ├─ Call ContentEngine.recommend()
    │  Returns: [{book_id, score}, ...]
    │  where score ∈ [0, 1]
    │
    ├─ Call CollaborativeEngine.recommend()
    │  Returns: [{book_id, predicted_rating}, ...]
    │  where score ∈ [1, 5]
    │
    ├─ Normalize both scores to [0, 1]
    │
    ├─ Merge by book_id
    │  - Only content: type="content-based"
    │  - Only collab: type="collaborative"
    │  - Both: type="hybrid" ⭐⭐⭐
    │
    ├─ Apply weights
    │  final_score = 0.5 × content + 0.5 × collab
    │
    └─ Sort & return top 10

Time: ~300-700ms
```

---

## 🎓 Understanding Vectors

### ContentEngine Vectors (2048D TF-IDF)

```
One book = 2048 numbers

Example (conceptual 4D):
Book A "Python Programming": [0.45, 0.82, 0.12, 0.05]
Book B "Java Programming":   [0.43, 0.79, 0.15, 0.08]
Book C "Cooking Recipes":    [0.02, 0.05, 0.85, 0.92]

Similarity:
A vs B: cosine_sim = 0.97 (very similar - both programming)
A vs C: cosine_sim = 0.01 (very different - different topic)

Interpretation:
- Each dimension = importance of a keyword
- Dimension 0,1: Programming keywords
- Dimension 2,3: Cooking keywords
```

### CollaborativeEngine Vectors (User-Count D)

```
One book = as many dimensions as users

Example (conceptual 4 users):
Book A "Python": [4, 5, 0, 3]  = [User1: 4⭐, User2: 5⭐, User3: unread, User4: 3⭐]
Book B "Java":   [5, 0, 4, 5]  = [User1: 5⭐, User2: unread, User3: 4⭐, User4: 5⭐]
Book C "Cook":   [0, 4, 3, 0]  = [User1: unread, User2: 4⭐, User3: 3⭐, User4: unread]

After centering (subtract book means):
Book A: [0.0, +0.8, -3.2, -0.2]
Book B: [+0.5, -4.5, +0.3, +0.8]
Book C: [-3.5, +0.2, -0.8, -3.5]

Similarity:
A vs B: Similar rating patterns → cosine_sim = 0.45
A vs C: Very different patterns → cosine_sim = -0.15

Interpretation:
- Each dimension = one user's rating
- Books with similar rating patterns = similar books
- Users who like A probably like B
```

---

## 📋 API Usage Examples

### 1. Quick Start - HybridEngine

```python
from app.services.hybrid_engine import HybridRecommendationEngine

# Initialize
hybrid = HybridRecommendationEngine(
    collab_weight=0.6,
    content_weight=0.4,
    qdrant_host="localhost",
    qdrant_port=6333
)

# Train both engines
print("Training engines...")
result = hybrid.train_engines(
    retrain_collaborative=True,
    retrain_content=True
)
print(result['message'])

# Get recommendations
rec_result = hybrid.recommend(user_id=5, top_n=10)
print(f"Recommendations for user {rec_result['user_id']}:")
for rec in rec_result['recommendations']:
    print(f"  📕 {rec['title']}: {rec['score']:.3f}")

# Find related books
related = hybrid.get_related_books(book_id=101, top_n=5)
print(f"Books related to {related['book_title']}:")
for book in related['related_books']:
    print(f"  📕 {book['title']}: {book['score']:.3f}")
```

### 2. ContentEngine Only

```python
from app.services.content_engine import ContentEngine

engine = ContentEngine()
engine.train()

# Recommendation (with Rocchio)
recs = engine.recommend(user_id=5, top_n=10)
for rec in recs:
    print(f"Book {rec['book_id']}: score={rec['score']:.3f}")

# Similar books (for detail page)
similar = engine.recommend_similar_books(book_id=101, top_n=5)
for book in similar:
    print(f"Book {book['book_id']}: similarity={book['score']:.3f}")
```

### 3. CollaborativeEngine Only

```python
from app.services.collaborative_engine import CollaborativeItemEngine

engine = CollaborativeItemEngine()
engine.train_and_sync()

# Recommendation
recs = engine.recommend(user_id=5, top_n=10)
for rec in recs:
    print(f"Book {rec['book_id']}: predicted_rating={rec['predicted_rating']:.1f}⭐")

# Fallback (for cold start)
popular = engine.get_fallback_recommendations(top_n=10)
print(f"Popular books: {[r['book_id'] for r in popular]}")
```

---

## 🔧 Configuration & Tuning

### Weight Balancing

```python
# Scenario 1: Trust user behavior more
hybrid = HybridRecommendationEngine(
    collab_weight=0.7,
    content_weight=0.3
)
# For: Established users with lots of ratings

# Scenario 2: Balanced (default)
hybrid = HybridRecommendationEngine(
    collab_weight=0.5,
    content_weight=0.5
)
# For: General purpose

# Scenario 3: Trust content more
hybrid = HybridRecommendationEngine(
    collab_weight=0.3,
    content_weight=0.7
)
# For: New users, need cold start handling
```

### Qdrant Connection

```python
# Local Qdrant
engine = ContentEngine(
    qdrant_host="localhost",
    qdrant_port=6333
)

# Remote Qdrant
engine = ContentEngine(
    qdrant_host="192.168.1.100",
    qdrant_port=6334
)

# Docker Qdrant
engine = ContentEngine(
    qdrant_host="qdrant",  # Docker service name
    qdrant_port=6333
)
```

---

## 📊 Choosing the Right Engine

### Decision Tree

```
                    Does user have rating history?
                            │
                ┌───────────┴──────────┐
                │                      │
              NO                      YES
                │                      │
                ▼                      ▼
        Is content good?      Use COLLABORATIVE
                │              (or HYBRID)
        ┌───────┴────────┐
        │                │
       YES              NO
        │                │
        ▼                ▼
    CONTENT         HYBRID*
    (with            (Collab
    Rocchio)         heavy)

*Try HYBRID first, adjust weights based on results
```

### Performance Comparison

| Aspect             | ContentEngine | Collaborative | Hybrid    |
| ------------------ | ------------- | ------------- | --------- |
| **New User**       | ✅ Good       | ❌ Bad        | ✅ Good   |
| **New Book**       | ✅ Good       | ❌ Bad        | ✅ Good   |
| **Speed**          | ✅ Fast       | ✅ Fast       | ⚠️ Medium |
| **Serendipity**    | ❌ Low        | ✅ High       | ✅ High   |
| **Explainability** | ✅ High       | ❌ Low        | ⚠️ Medium |
| **Data Sparsity**  | ✅ Robust     | ❌ Weak       | ✅ Good   |

---

## 🎯 Fallback Strategy

```
HybridEngine.recommend() failed
    │
    ├─ Try ContentEngine
    │  ├─ Success → Return
    │  └─ Failed → Next
    │
    ├─ Try CollaborativeEngine
    │  ├─ Success → Return
    │  └─ Failed → Next
    │
    └─ Fallback: Popular Books
       (Always returns something)
```

---

## 📈 Monitoring & Debugging

### What to check:

1. **Training Status**

   ```python
   # Check if models are trained
   engine.train_and_sync()
   # Look for console output confirming upload
   ```

2. **Vector Count**

   ```python
   # Verify vectors are in Qdrant
   collection_info = engine.client.get_collection(collection_name)
   print(f"Points in collection: {collection_info.points_count}")
   ```

3. **Sample Predictions**
   ```python
   # Test with known users
   recs = engine.recommend(user_id=1, top_n=5)
   assert len(recs) > 0, "No recommendations returned!"
   ```

---

## 🚀 Best Practices

### 1. Always Train Before Recommending

```python
engine = HybridRecommendationEngine()
engine.train_engines(retrain_collaborative=True, retrain_content=True)
result = engine.recommend(user_id=5, top_n=10)
```

### 2. Use Weights That Match Your Data

```python
# If you have lots of user data
hybrid = HybridRecommendationEngine(collab_weight=0.6, content_weight=0.4)

# If book descriptions are great
hybrid = HybridRecommendationEngine(collab_weight=0.4, content_weight=0.6)
```

### 3. Handle Cold Start Gracefully

```python
result = hybrid.recommend(user_id=999, top_n=10)
# If user is new, HybridEngine automatically falls back to popular books
print(f"Method used: {result['method']}")  # "hybrid" or "fallback"
```

### 4. Monitor Performance

```python
# Track which recommendation methods are used
methods = defaultdict(int)
for user_id in range(1, 1000):
    result = hybrid.recommend(user_id)
    methods[result['method']] += 1

print(f"Hybrid: {methods['hybrid']}")
print(f"Fallback: {methods['fallback']}")
```

---

## 🎓 Key Takeaways

| Aspect             | ContentEngine | Collaborative     | Hybrid      |
| ------------------ | ------------- | ----------------- | ----------- |
| **Best For**       | New users     | Established users | Everyone    |
| **Training Time**  | Fast          | Medium            | Slow (both) |
| **Inference Time** | Medium        | Medium            | Slow (both) |
| **Cold Start**     | ✅ Good       | ❌ Bad            | ✅ Good     |
| **Diversity**      | Low           | ✅ High           | ✅ High     |

---

## 📚 Related Documentation

- [HybridEngine Flow](HYBRID_ENGINE_FLOW.md) - Deep dive into hybrid system
- [ContentEngine Flow](CONTENT_ENGINE_FLOW.md) - TF-IDF & Rocchio details
- [CollaborativeEngine Flow](COLLABORATIVE_ENGINE_FLOW.md) - Item-item CF algorithm
- [API Documentation](API_DOCUMENTATION.md) - REST API endpoints
- [README](README.md) - Project overview

---

## 🤝 Contributing

When adding new engines or modifying existing ones:

1. Update relevant Flow documentation
2. Add usage examples
3. Update this index
4. Test thoroughly before deployment

---

**Last Updated**: May 12, 2026  
**Status**: ✅ Production Ready

🚀 Happy Recommending!
