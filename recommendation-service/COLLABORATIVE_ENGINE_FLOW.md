# Collaborative Item Engine - Flow Documentation

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Architecture](#architecture)
3. [Training Flow (Item-Item Filtering)](#training-flow-item-item-filtering)
4. [Prediction & Rating Estimation](#prediction--rating-estimation)
5. [Recommendation Flow](#recommendation-flow)
6. [Cold Start Handling](#cold-start-handling)
7. [Chi Tiết Các Method](#chi-tiết-các-method)
8. [Data Structures](#data-structures)
9. [Ví Dụ Thực Tế](#ví-dụ-thực-tế)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng Quan

**CollaborativeItemEngine** là hệ thống gợi ý dựa vào **hành vi của users** (collaborative filtering).

### Cách Hoạt Động - Item-Item Filtering

```
Cơ bản: Nếu User A & User B cùng rate cao sách X & Y
       → Khi User B rate cao sách Z
       → Gợi ý sách Z cho User A

Phương pháp: Item-Item Collaborative Filtering
- So sánh pattern rating của các sách
- Sách nào có pattern giống sẽ được coi là tương tự
- Dự đoán rating của user dựa vào rating của sách tương tự
```

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│  CollaborativeItemEngine                │
└─────────────────────────────────────────┘
         │
    ┌────┴──────────┬─────────────┐
    │               │             │
┌───▼─────┐ ┌──────▼──┐ ┌────────▼─────┐
│Training │ │User     │ │Rating         │
│(Build   │ │Cold     │ │Estimation     │
│Item-    │ │Start    │ │(Prediction)   │
│Item     │ │Fallback │ │               │
│Matrix)  │ └─────────┘ └───────────────┘
└─────────┘
```

---

## 🏗️ Architecture

### Three Key Matrices

```
┌──────────────────────────────────────────────┐
│  User-Item Rating Matrix (from database)     │
├──────────────────────────────────────────────┤
│                                              │
│          Book1  Book2  Book3  ... Book_N    │
│ User1:     4      3      ?     ...   2      │
│ User2:     5      ?      4     ...   3      │
│ User3:     ?      4      3     ...   5      │
│ ...                                         │
│ User_M:    3      2      ?     ...   4      │
│                                              │
│ Task: Predict ? (missing ratings)           │
└──────────────────────────────────────────────┘
         │
         │ Center the matrix
         │ (subtract book mean from each rating)
         │
         ▼
┌──────────────────────────────────────────────┐
│  Centered User-Item Matrix                   │
├──────────────────────────────────────────────┤
│                                              │
│          Book1  Book2  Book3  ... Book_N    │
│ User1:   +0.2   -0.3   -0.1   ...  -1.1    │
│ User2:   +0.8   -0.1   +0.2   ...  -0.2    │
│ User3:   -0.5   +0.1   -0.2   ...  +0.9    │
│ ...                                         │
│ User_M:  -0.1   -1.2   -0.3   ...  -0.5    │
│                                              │
│ Treat each ROW as a VECTOR                  │
│ (Each book's vector = rating pattern)       │
└──────────────────────────────────────────────┘
         │
         │ Upload to Qdrant
         │ (Item-Item similarity vectors)
         │
         ▼
┌──────────────────────────────────────────────┐
│  Qdrant Vector Database                      │
│  (item_item_cf collection)                   │
├──────────────────────────────────────────────┤
│                                              │
│  Point 1: id=Book1, vector=[+0.2, ...]     │
│  Point 2: id=Book2, vector=[-0.3, ...]     │
│  Point 3: id=Book3, vector=[-0.1, ...]     │
│  ...                                        │
│                                              │
│  Similarity = Cosine Similarity             │
│  If Book1 & Book2 similar → Users like both │
└──────────────────────────────────────────────┘
```

---

## 🔄 Training Flow (Item-Item Filtering)

### Bước 1: Load Ratings & Create User-Item Matrix

```python
def train_and_sync(self):
    print("--- Training Collaborative Filtering ---")

    # STEP 1: Get all ratings from database
    ratings_df = get_all_ratings()
    # Columns: user_id, book_id, rating (1-5)
    # Example:
    # user_id  book_id  rating
    #    1       101       4
    #    1       102       3
    #    2       101       5
    #    2       103       4

    if ratings_df.empty:
        print("❌ No ratings data")
        return

    # STEP 2: Pivot to User-Item Matrix
    item_user_matrix = ratings_df.pivot(
        index='book_id',      # Rows = books
        columns='user_id',    # Columns = users
        values='rating'
    ).fillna(0)

    # Result:
    #          user1  user2  user3 ...
    # book1      4      5      0   ...
    # book2      3      0      4   ...
    # book3      0      4      3   ...
```

### Bước 2: Calculate Book Mean Ratings

```python
    # Calculate mean rating for each book
    book_means = item_user_matrix.replace(0, np.nan).mean(axis=1).fillna(0)

    # Example:
    # book1: (4 + 5) / 2 = 4.5
    # book2: (3 + 4) / 2 = 3.5
    # book3: (4 + 3) / 2 = 3.5
```

### Bước 3: Center the Matrix

```python
    # Subtract book mean from each rating
    # This removes overall book popularity bias
    item_user_matrix_centered = item_user_matrix.apply(
        lambda row: row.map(
            lambda x: x - book_means[row.name] if x != 0 else 0
        ),
        axis=1
    )

    # Example (centered):
    #          user1   user2   user3
    # book1   -0.5    +0.5      0     (4-4.5=-0.5, 5-4.5=+0.5)
    # book2   -0.5    +0.5      0     (3-3.5=-0.5, 4-3.5=+0.5)
    # book3    +0.5   +0.5      0     (4-3.5=+0.5, 3-3.5=-0.5)
```

**Tại sao center?**

- Loại bỏ bias từ "sách nổi tiếng" vs "sách ít nổi"
- Tập trung vào pattern chứ không phải absolute rating
- Giúp tìm ra sách thực sự tương tự

### Bước 4: Upload to Qdrant

```python
    # Create Qdrant collection
    vector_size = item_user_matrix.shape[1]  # Number of users

    self.client.recreate_collection(
        collection_name=self.collection_name,
        vectors_config=VectorParams(
            size=vector_size,
            distance=Distance.COSINE
        )
    )

    # Upload book vectors
    points = []
    for book_id, row in item_user_matrix_centered.iterrows():
        points.append(PointStruct(
            id=int(book_id),
            vector=row.values.tolist(),
            payload={
                "mean_rating": float(book_means[book_id])
            }
        ))

        # Batch upload
        if len(points) >= 500:
            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
            points = []

    # Upload remaining
    if points:
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )

    print(f"✅ Trained {len(item_user_matrix)} books")
```

### Flow Diagram

```
get_all_ratings()
        │
        ▼
  ┌───────────┐
  │ Pivot     │ → User-Item Matrix
  │ (by user) │
  └─────┬─────┘
        │
        ▼
  ┌───────────────┐
  │ Calculate     │ → book_means
  │ Mean Ratings  │
  └─────┬─────────┘
        │
        ▼
  ┌─────────────────┐
  │ Center Matrix   │ → Subtract mean from each rating
  │ (remove bias)   │
  └─────┬───────────┘
        │
        ▼
  ┌─────────────────────────┐
  │ Upload to Qdrant        │
  │ (Each book = 1 vector)  │
  │ (Item-Item similarity)  │
  └─────────────────────────┘
```

---

## 🔮 Prediction & Rating Estimation

### predict_rating() - The Core Algorithm

```python
def predict_rating(self, user_id, target_book_id,
                   user_ratings_dict, all_book_means, top_k=20):
    """
    Predict user's rating for a book they haven't read
    Using weighted item-item similarity
    """
```

### Step 1: Get Target Book Vector

```python
    # Retrieve vector của sách mà user chưa đọc
    target_res = self.client.retrieve(
        self.collection_name,
        ids=[target_book_id],
        with_vectors=True
    )

    if not target_res:
        # Item Cold Start: Sách chưa ai rate
        return all_book_means.get(target_book_id, 0)

    target_vec = target_res[0].vector
    ri_bar = target_res[0].payload['mean_rating']
```

### Step 2: Find Neighbors (Similar Books)

```python
    # Find top-k similar books that user HAS read
    neighbors = self.client.query_points(
        collection_name=self.collection_name,
        query=target_vec,
        limit=top_k + 1,
        with_payload=True
    ).points

    # Returns books với similarity score cao nhất
    # Similarity được tính từ COSINE DISTANCE của vectors
```

### Step 3: Weighted Averaging

```python
    weighted_sum = 0
    sum_of_weights = 0

    for neighbor in neighbors:
        if neighbor.id == target_book_id:
            continue  # Skip chính nó

        j_id = neighbor.id  # Similar book ID
        wij = neighbor.score  # Cosine similarity [0, 1]

        # Check if user has read this similar book
        if j_id in user_ratings_dict:
            ruj = user_ratings_dict[j_id]  # User's rating for similar book
            rj_bar = all_book_means.get(j_id, 0)  # Book's mean rating

            # Weighted contribution = weight × centered_rating
            weighted_sum += wij * (ruj - rj_bar)
            sum_of_weights += abs(wij)

    # If no neighbors found
    if sum_of_weights == 0:
        return ri_bar  # Return target book's mean rating

    # Final prediction
    prediction = ri_bar + (weighted_sum / sum_of_weights)
    return max(1, min(5, prediction))  # Clamp to [1, 5]
```

### Formula Explanation

```
Final Prediction:
┌────────────────────────────────────────────────────┐
│ r̂ui = r̄i + (Σ wij(ruj - r̄j)) / Σ|wij|             │
│                                                    │
│ where:                                             │
│ r̂ui = predicted rating for user u on item i       │
│ r̄i = mean rating of item i                        │
│ wij = similarity between item i and j             │
│ ruj = user u's actual rating on item j            │
│ r̄j = mean rating of item j                        │
└────────────────────────────────────────────────────┘
```

### Ví Dụ Prediction

```
User 5 wants to rate Book 101 (hasn't read)

User 5's ratings:
- Book 102: 5 stars
- Book 103: 4 stars
- Book 104: 2 stars

Book means:
- Book 101: 3.5 (r̄i)
- Book 102: 4.0 (r̄j)
- Book 103: 3.5 (r̄j)
- Book 104: 3.0 (r̄j)

Similarity query returns:
┌────────┬──────┬────────┬─────┐
│ Book   │ Sim  │ Read?  │ Info│
├────────┼──────┼────────┼─────┤
│ 102    │ 0.92 │ Yes    │ ✅  │
│ 103    │ 0.85 │ Yes    │ ✅  │
│ 104    │ 0.78 │ Yes    │ ✅  │
│ 105    │ 0.70 │ No     │ ❌  │
└────────┴──────┴────────┴─────┘

Weighted sum calculation:
- Book 102: 0.92 × (5 - 4.0) = 0.92 × 1.0 = 0.92
- Book 103: 0.85 × (4 - 3.5) = 0.85 × 0.5 = 0.425
- Book 104: 0.78 × (2 - 3.0) = 0.78 × (-1.0) = -0.78

weighted_sum = 0.92 + 0.425 - 0.78 = 0.565
sum_of_weights = |0.92| + |0.85| + |0.78| = 2.55

prediction = 3.5 + (0.565 / 2.55)
           = 3.5 + 0.222
           = 3.722
           ≈ 3.7 stars ⭐⭐⭐

Interpretation:
- Book 101 average rating: 3.5
- User 5 likes similar books more than average
- → Predict slightly higher: 3.7 stars
```

---

## 🎯 Recommendation Flow

### Complete recommend() Flow

```
┌──────────────────────────────────┐
│ recommend(user_id=5, top_n=10)   │
└──────────────┬───────────────────┘
               │
┌──────────────▼──────────────────┐
│ STEP 1: Get User's Ratings      │
│                                 │
│ user_ratings_dict =             │
│ get_user_ratings_dict(user_id)  │
│ = {101: 5.0, 103: 4.0, ...}    │
│                                 │
│ ❌ Empty? → Fallback            │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│ STEP 2: Get Unread Books        │
│                                 │
│ unread_ids =                    │
│ get_unread_books(user_id)       │
│ = [102, 104, 105, ...]         │
│                                 │
│ ❌ Empty? → Fallback            │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│ STEP 3: Get Book Means          │
│                                 │
│ all_book_means =                │
│ get_book_mean_ratings()         │
│ = {101: 3.5, 102: 4.0, ...}    │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ STEP 4: Predict Ratings                 │
│                                         │
│ For each unread book:                   │
│   score = predict_rating(               │
│     user_id, book_id,                   │
│     user_ratings_dict,                  │
│     all_book_means                      │
│   )                                     │
│                                         │
│ predictions = [                         │
│   {book_id: 102, score: 4.2},          │
│   {book_id: 104, score: 3.8},          │
│   ...                                   │
│ ]                                       │
│                                         │
│ ❌ Empty? → Fallback                    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────┐
│ STEP 5: Sort & Take Top N       │
│                                 │
│ Sort by score DESC              │
│ Take first 10 items             │
│                                 │
│ result = [                      │
│   {book_id: 102, score: 4.2},  │
│   {book_id: 105, score: 4.1},  │
│   ...                           │
│ ]                               │
└──────────────┬──────────────────┘
               │
      ┌────────▼────────┐
      │    FALLBACK     │
      │  (If anything   │
      │   goes wrong)   │
      │                 │
      │ popular_books() │
      └────────┬────────┘
               │
    ┌──────────▼──────────┐
    │ Return Final Result  │
    └─────────────────────┘
```

---

## 🚨 Cold Start Handling

### Three Cold Start Scenarios

```
┌─────────────────────────────────────┐
│ COLD START SCENARIOS                │
├─────────────────────────────────────┤
│                                     │
│ 1️⃣ USER COLD START                  │
│    New user, no ratings yet         │
│    Solution: Popular books          │
│    get_fallback_recommendations()   │
│                                     │
│ 2️⃣ ITEM COLD START                  │
│    New book, no one rated it        │
│    Solution: Use mean rating        │
│    all_book_means.get(book_id, 0)   │
│                                     │
│ 3️⃣ DATA SPARSITY                    │
│    User rated few books             │
│    Solution: Popular books fallback │
│    get_fallback_recommendations()   │
│                                     │
└─────────────────────────────────────┘
```

### User Cold Start Handling

```python
def recommend(self, user_id, top_n=10):
    # Check if user has any ratings
    user_ratings_dict = get_user_ratings_dict(user_id)

    if not user_ratings_dict:
        # ❌ User Cold Start
        print("User has no ratings, using fallback")
        return self.get_fallback_recommendations(top_n)

    # Continue with normal flow...
```

### Item Cold Start Handling

```python
def predict_rating(self, user_id, target_book_id, ...):
    target_res = self.client.retrieve(
        self.collection_name,
        ids=[target_book_id],
        with_vectors=True
    )

    if not target_res:
        # ❌ Item Cold Start: Book not in Qdrant
        # Return average rating of this book
        return all_book_means.get(target_book_id, 0)

    # Continue with normal flow...
```

### Fallback Strategy

```python
def get_fallback_recommendations(self, top_n=10):
    """
    Trả về những sách phổ biến nhất hệ thống
    Dùng khi user mới hoặc data không đủ
    """
    popular_df = get_popular_books_from_db(top_n)
    return [
        {
            "book_id": row['book_id'],
            "type": "popular_fallback",
            "predicted_rating": 5  # Assume 5 stars for popular
        }
        for _, row in popular_df.iterrows()
    ]
```

---

## 📊 Chi Tiết Các Method

### 1. `__init__()` - Initialization

```python
def __init__(self, qdrant_host="localhost", qdrant_port=6333):
    self.client = QdrantClient(host=qdrant_host, port=qdrant_port)
    self.collection_name = "item_item_cf"  # Qdrant collection name
```

---

### 2. `train_and_sync()` - Training

**Purpose**: Build item-item similarity matrix and upload to Qdrant

**Steps**:

1. Get all ratings from database
2. Create user-item matrix (pivot)
3. Calculate book means
4. Center the matrix (remove bias)
5. Create/recreate Qdrant collection
6. Upload vectors in batches

**Time Complexity**: O(U × I) where U=users, I=items

---

### 3. `predict_rating()` - Core Prediction Algorithm

**Purpose**: Predict a user's rating for an unseen book

**Algorithm**: Weighted average of similar books' ratings

**Parameters**:

- `user_id`: User to predict for
- `target_book_id`: Book to predict rating
- `user_ratings_dict`: User's read books & ratings
- `all_book_means`: Mean rating for each book
- `top_k=20`: Number of similar items to consider

**Returns**: Predicted rating (1-5 or mean rating)

---

### 4. `recommend()` - Main Recommendation Function

**Purpose**: Get top-N book recommendations for a user

**Flow**:

1. Check if user has ratings (cold start check)
2. Get list of unread books
3. Load book means
4. Predict rating for each unread book
5. Sort by predicted rating
6. Return top N

**Fallback**:

- User cold start → Popular books
- No predictions → Popular books
- Query error → Popular books

---

### 5. `get_fallback_recommendations()` - Fallback Strategy

**Purpose**: Return popular books when collaborative fails

**Used When**:

- New user (no ratings)
- Very sparse data
- System error

---

## 📦 Data Structures

### User-Item Rating Matrix

```
         User1  User2  User3  User4  User5
Book1     4      5      0      3      4
Book2     3      0      4      5      3
Book3     0      4      3      0      5
Book4     5      3      5      4      0
Book5     2      4      0      4      3

Notes:
- 0 means user hasn't rated
- 1-5 are actual ratings
- ~95% sparse (mostly zeros)
```

### Centered Matrix (After Mean Subtraction)

```
Book means: {1: 4.0, 2: 3.75, 3: 4.0, 4: 4.25, 5: 3.25}

Centered:
         User1   User2   User3   User4   User5
Book1    0.0    +1.0    -4.0    -1.0    0.0
Book2   -0.75   -3.75   +0.25   +1.25  -0.75
Book3   -4.0    0.0    -1.0    -4.0   +1.0
Book4   +0.75   -1.25   +0.75   -0.25  -4.25
Book5   -1.25   +0.75   -3.25   +0.75  -0.25

Note: Each ROW is uploaded as a VECTOR to Qdrant
```

### Qdrant Point Structure

```python
PointStruct(
    id=101,  # book_id
    vector=[0.0, 1.0, -4.0, -1.0, 0.0],  # User ratings (centered)
    payload={
        "mean_rating": 4.0  # Book's average rating
    }
)
```

---

## 💡 Ví Dụ Thực Tế

### Scenario 1: User Has Ratings

```python
engine = CollaborativeItemEngine()
engine.train_and_sync()

# User 5 đã rate: {101: 5, 103: 4, 105: 3}
result = engine.recommend(user_id=5, top_n=5)

# Output:
# [
#   {'book_id': 102, 'predicted_rating': 4.5, 'type': 'collaborative'},
#   {'book_id': 104, 'predicted_rating': 4.2, 'type': 'collaborative'},
#   {'book_id': 106, 'predicted_rating': 3.9, 'type': 'collaborative'},
#   ...
# ]
```

### Scenario 2: User Cold Start

```python
# User 999 mới tạo, chưa rate gì
result = engine.recommend(user_id=999, top_n=5)

# Output: Popular books fallback
# [
#   {'book_id': 1, 'type': 'popular_fallback', 'predicted_rating': 5},
#   {'book_id': 2, 'type': 'popular_fallback', 'predicted_rating': 5},
#   ...
# ]
```

### Scenario 3: Predict Single Book

```python
# Predict rating for user 5 on book 102
user_ratings = {101: 5, 103: 4, 105: 3}
book_means = {101: 4.0, 102: 3.5, 103: 4.5, 105: 3.2}

score = engine.predict_rating(
    user_id=5,
    target_book_id=102,
    user_ratings_dict=user_ratings,
    all_book_means=book_means,
    top_k=20
)
# score ≈ 4.3 stars
```

---

## 🎓 Key Concepts

### Item Similarity = User Rating Pattern Similarity

```
Logic:
Book A vector: [ratings from all users] = [4, 5, 0, 3, 4, 2, ...]
Book B vector: [ratings from all users] = [5, 0, 4, 5, 3, 2, ...]

If cosine_similarity(A, B) = 0.92 (very high)
→ Books A & B have very similar rating patterns
→ Users who like A probably like B
```

### Why Center the Matrix?

```
Example:
- Book X: Always highly rated (mean=4.8)
- Book Y: Always lowly rated (mean=2.2)

Without centering:
- Both look very different
- We think they're different because of popularity

With centering:
- Book X: all ratings close to 4.8 (consistent quality)
- Book Y: all ratings close to 2.2 (consistent low quality)
- If pattern matches → they're similar despite different scales

Benefit: Focus on PATTERN, not SCALE
```

---

## 🔧 Troubleshooting

### Problem 1: All Predictions Same

**Symptom**: predict_rating() always returns ~3.5

**Causes**:

- sum_of_weights = 0 (no similar books)
- No neighbors found

**Solution**:

- Increase top_k parameter
- Check if books have been trained
- Check database connectivity

### Problem 2: Fallback Too Often

**Symptom**: get_fallback_recommendations() called 80% of time

**Causes**:

- Users too new
- Database missing ratings
- Qdrant not populated

**Solution**:

- Check get_user_ratings_dict()
- Verify train_and_sync() completed
- Check Qdrant collection size

### Problem 3: Rating Out of Bounds

**Symptom**: predict_rating() returns > 5 or < 1

**Cause**: Missing clamp() in return statement

**Solution**: Ensure `max(1, min(5, prediction))`

---

## 📈 Performance Metrics

- **Training**: O(U × I + I × U) = O(UI) operations
- **Prediction**: O(log N + k) where N=items, k=top_k
- **Memory**: ~M × N × 4 bytes (float32) for matrix
- **Query Speed**: ~50-100ms per recommendation

### Scalability

```
1,000 users × 10,000 books = 10M ratings (10GB sparse)
1,000 Qdrant queries = ~50 seconds (50ms each)
→ Acceptable for offline training, marginal for online
```

---

## 🎯 Summary

**CollaborativeItemEngine** dùng **item-item collaborative filtering**:

1. **Training**: Build item-item similarity matrix từ user ratings
2. **Centering**: Remove popularity bias, focus on pattern
3. **Storage**: Upload vectors to Qdrant (cosine similarity)
4. **Prediction**: Weighted average của similar items' ratings
5. **Fallback**: Popular books cho cold start

**Ưu điểm**:
✅ Không cần item content
✅ Discover serendipities
✅ Cực nhanh

**Nhược điểm**:
❌ User/Item cold start
❌ Data sparsity
❌ Popularity bias

Kết hợp tốt với ContentEngine để tạo HybridEngine! 🚀
