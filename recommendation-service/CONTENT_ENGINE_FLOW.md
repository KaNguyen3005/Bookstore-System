# Content Engine - Flow Documentation

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Architecture](#architecture)
3. [Training Flow](#training-flow)
4. [User Profile Building (Rocchio)](#user-profile-building-rocchio)
5. [Recommendation Flow](#recommendation-flow)
6. [Chi Tiết Các Method](#chi-tiết-các-method)
7. [Data Structure](#data-structure)
8. [Ví Dụ Thực Tế](#ví-dụ-thực-tế)

---

## 🎯 Tổng Quan

**ContentEngine** là hệ thống gợi ý dựa trên **nội dung sách** (content-based filtering).

### Cách Hoạt Động

```
Sách A: "Python Programming"
├─ Title: Python Programming
├─ Description: "Learn Python from basics..."
├─ Authors: "John Smith"
└─ Categories: "Programming, Python, Technology"
                    ↓
            [TF-IDF Vectorizer]
                    ↓
            Vector [0.45, 0.82, 0.12, ...]
                    ↓
            [Store in Qdrant Vector DB]
                    ↓
        User tương tự sẽ được gợi ý sách này
```

### Hai Collections trong Qdrant

```
┌─────────────────────────────┐
│   Qdrant Vector Database    │
├─────────────────────────────┤
│                             │
│ 📚 books_collection         │
│  ├─ Book vectors (TF-IDF)   │
│  ├─ size: 2048              │
│  └─ distance: COSINE        │
│                             │
│ 👥 users_collection         │
│  ├─ User profiles (Rocchio) │
│  ├─ size: 2048              │
│  └─ distance: COSINE        │
│                             │
└─────────────────────────────┘
```

---

## 🏗️ Architecture

### High-Level Flow

```
                     ┌────────────────────────┐
                     │   ContentEngine        │
                     └────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼──────┐ ┌────▼─────┐ ┌────▼──────┐
        │ TRAIN PHASE  │ │PROFILE    │ │RECOMMEND  │
        │              │ │BUILDING   │ │           │
        └──────────────┘ └──────────┘ └───────────┘
             │               │              │
             │               │              │
        1️⃣ Extract text   2️⃣ Rocchio    3️⃣ Query
           TF-IDF           Algorithm      similar
                                           items
```

### Component Dependencies

```
ContentEngine
├── TfidfVectorizer (sklearn)
│   └── Tỉnh tần suất từ khóa
├── QdrantClient
│   ├── books_collection (TF-IDF vectors)
│   └── users_collection (Rocchio profiles)
├── Database Functions
│   ├── get_books_data()
│   ├── get_detailed_interactions()
│   ├── get_popular_books_from_db()
│   └── get_stop_words()
└── Text Processing
    └── my_vietnamese_tokenizer()
```

---

## 🔄 Training Flow

### Bước 1: Text Extraction & TF-IDF Vectorization

```
┌─────────────────────────────────────────────────┐
│ Book Data từ Database                           │
│                                                 │
│ book_id: 101                                    │
│ title: "Python Advanced"                        │
│ description: "Master advanced..."               │
│ authors: "John Doe"                             │
│ categories: "Programming, Python"               │
└─────────────────────────────────────────────────┘
                        │
        ┌───────────────▼────────────────┐
        │ Combine All Text Fields        │
        │                                │
        │ content =                      │
        │  "Python Advanced " +          │
        │  "Master advanced... " +       │
        │  "John Doe " +                 │
        │  "Programming, Python"         │
        └───────────────┬────────────────┘
                        │
        ┌───────────────▼────────────────┐
        │ Vietnamese Tokenization        │
        │                                │
        │ Tokens: ["Python", "Advanced",│
        │          "Master", ...]        │
        └───────────────┬────────────────┘
                        │
        ┌───────────────▼────────────────┐
        │ Remove Stop Words              │
        │ (a, an, the, và, hay, ...)    │
        │                                │
        │ Tokens: ["Python", "Advanced",│
        │          "Master", ...]        │
        └───────────────┬────────────────┘
                        │
        ┌───────────────▼────────────────────────┐
        │ TF-IDF Vectorization                   │
        │                                        │
        │ TF = Term Frequency                    │
        │   = (count of term) / (total terms)    │
        │                                        │
        │ IDF = Inverse Document Frequency       │
        │   = log(total docs / docs with term)   │
        │                                        │
        │ TF-IDF = TF × IDF                      │
        │                                        │
        │ Result: [0.45, 0.82, 0.12, ...]       │
        │         (2048 dimensions)              │
        └───────────────┬────────────────────────┘
                        │
                    ✅ DONE
```

**Tại sao TF-IDF?**

- TF: Từ nào xuất hiện nhiều lần là quan trọng
- IDF: Từ xuất hiện ở nhiều sách là ít quan trọng
- TF-IDF: Cân bằng cả hai → các từ đặc trưng được ưu tiên

**Ví dụ:**

```
Sách A: "Python Programming" (100 từ)
- "Python" xuất hiện 15 lần → TF = 0.15
- "Python" xuất hiện trong 1000/10000 sách → IDF = log(10000/1000) = 1.0
- TF-IDF = 0.15 * 1.0 = 0.15 ✅ (cao)

Sách B: "Machine Learning in Python"
- "in" xuất hiện 20 lần → TF = 0.20
- "in" xuất hiện trong 9000/10000 sách → IDF = log(10000/9000) = 0.045
- TF-IDF = 0.20 * 0.045 = 0.009 ❌ (thấp, không quan trọng)
```

---

### Bước 2: Lưu Model & Setup Qdrant

```python
def train(self):
    # BƯỚC 1: Lấy dữ liệu sách
    df = get_books_data()  # pandas DataFrame
    # Columns: book_id, title, description, authors, categories

    # BƯỚC 2: Kết hợp tất cả text fields
    df['content'] = (df['title'].fillna('') + " " +
                     df['description'].fillna('') + " " +
                     df['authors'].fillna('') + " " +
                     df['categories'].fillna(''))

    # BƯỚC 3: TF-IDF fit_transform
    tfidf_matrix = self.tfidf.fit_transform(df['content'])
    # Output: sparse matrix (num_books, 2048)

    # BƯỚC 4: Lưu model để tái sử dụng
    with open(self.model_path, 'wb') as f:
        pickle.dump(self.tfidf, f)

    # BƯỚC 5: Setup Qdrant Collections
    # ❌ Xóa cũ
    if self.client.collection_exists(self.book_col):
        self.client.delete_collection(self.book_col)

    # ✅ Tạo mới
    self.client.create_collection(
        collection_name=self.book_col,
        vectors_config=VectorParams(
            size=2048,  # TF-IDF vector size
            distance=Distance.COSINE  # Cosine similarity
        )
    )

    # Tương tự cho users_collection
    if self.client.collection_exists(self.user_col):
        self.client.delete_collection(self.user_col)

    self.client.create_collection(
        collection_name=self.user_col,
        vectors_config=VectorParams(size=2048, distance=Distance.COSINE)
    )

    # BƯỚC 6: Upload Book Vectors
    points = [
        PointStruct(
            id=int(row['book_id']),
            vector=tfidf_matrix[idx].toarray().flatten().tolist(),
            payload={"title": row['title']}
        )
        for idx, row in df.iterrows()
    ]

    self.client.upsert(collection_name=self.book_col, points=points)
    print(f"✅ Uploaded {len(df)} book vectors to Qdrant")
```

---

## 👥 User Profile Building (Rocchio)

### Rocchio Algorithm

```
Định nghĩa: Xây dựng vector đại diện cho sở thích của user

Công thức:
┌─────────────────────────────────────────┐
│ u = α·u₀ + β·ū₊ - γ·ū₋                   │
│                                         │
│ u   = User profile vector               │
│ u₀  = Baseline vector (previous)        │
│ ū₊  = Avg vector of liked items         │
│ ū₋  = Avg vector of disliked items      │
│ α   = baseline weight (0.8)             │
│ β   = positive feedback weight (1.0)    │
│ γ   = negative feedback weight (0.3)    │
└─────────────────────────────────────────┘
```

### Interaction Weighting

```python
INTERACT_WEIGHTS = {
    'VIEW_BOOK': 1,       # Xem sách 1 lần
    'ADD_TO_CART': 3,     # Thêm vào giỏ = 3 lần xem
    'PURCHASE': 8,        # Mua = 8 lần xem
    'REVIEW': 'varies'    # Dùng rating (1-5 sao)
}

Ý tưởng: Hành động mạnh hơn có trọng số cao hơn
- Xem: User có thể bấm nhầm
- Thêm giỏ: User có ý định mua
- Mua: User rất thích (highest confidence)
- Review: User định giá trực tiếp (1-5 sao)
```

### Build Profile Flow

```
┌───────────────────────────────────────────┐
│ STEP 1: Get Baseline Profile u₀           │
│                                           │
│ Try to retrieve from Qdrant               │
│ users_collection[user_id]                 │
│                                           │
│ ✅ Found → use it                         │
│ ❌ Not found → initialize zeros           │
└─────────────────┬─────────────────────────┘
                  │
┌─────────────────▼──────────────────────────┐
│ STEP 2: Get User Interactions              │
│                                            │
│ FROM get_detailed_interactions(user_id):   │
│ [                                          │
│   {book_id: 101, event: 'PURCHASE', ...}, │
│   {book_id: 102, event: 'REVIEW', ...},   │
│   {book_id: 103, event: 'VIEW', ...}      │
│ ]                                          │
│                                            │
│ ❌ No interactions → return None           │
└─────────────────┬──────────────────────────┘
                  │
┌─────────────────▼──────────────────────────┐
│ STEP 3: Retrieve Book Vectors              │
│                                            │
│ For each book_id, get vector from:         │
│ books_collection[book_id]                  │
│                                            │
│ item_vectors = {                           │
│   101: [0.45, 0.82, ...],                  │
│   102: [0.12, 0.56, ...],                  │
│   103: [0.78, 0.34, ...]                   │
│ }                                          │
└─────────────────┬──────────────────────────┘
                  │
┌─────────────────▼──────────────────────────────┐
│ STEP 4: Separate Positive & Negative Items     │
│                                                │
│ POSITIVE (liked):                              │
│ - VIEW, ADD_TO_CART, PURCHASE                 │
│ - REVIEW with rating > 2                      │
│ Apply: weight × vector                        │
│                                                │
│ NEGATIVE (disliked):                           │
│ - REVIEW with rating ≤ 2 (bad review)        │
│ Apply: -(3 - rating) × vector                 │
│                                                │
│ d_plus_sum  = Σ(weight × v_i) for positive   │
│ d_minus_sum = Σ(weight × v_i) for negative   │
└─────────────────┬──────────────────────────────┘
                  │
┌─────────────────▼─────────────────────────────┐
│ STEP 5: Calculate Average Vectors             │
│                                               │
│ ū₊ = d_plus_sum / count_plus                  │
│ ū₋ = d_minus_sum / count_minus                │
│                                               │
│ (Handle division by zero)                     │
└─────────────────┬─────────────────────────────┘
                  │
┌─────────────────▼──────────────────────────┐
│ STEP 6: Apply Rocchio Formula              │
│                                            │
│ u = 0.8 × u₀ + 1.0 × ū₊ - 0.3 × ū₋       │
│                                            │
│ Result: Raw user profile vector            │
└─────────────────┬──────────────────────────┘
                  │
┌─────────────────▼──────────────────────────┐
│ STEP 7: Normalize                          │
│                                            │
│ 1. Remove negative values:                 │
│    u = max(u, 0)  # ReLU activation        │
│                                            │
│ 2. L2 Normalization:                       │
│    u = u / ||u||₂                          │
│    (Makes all vectors have length 1)       │
│                                            │
│ Result: Normalized user profile            │
└─────────────────┬──────────────────────────┘
                  │
┌─────────────────▼──────────────────────────┐
│ STEP 8: Store & Return                     │
│                                            │
│ Upsert to Qdrant:                          │
│ users_collection[user_id] = u              │
│                                            │
│ Return: u (for recommendation)              │
└────────────────────────────────────────────┘
```

### Ví Dụ Build Profile

```
User 5 interactions:
┌─────────┬────────┬────────┬────────┐
│ book_id │ event  │ rating │ weight │
├─────────┼────────┼────────┼────────┤
│ 101     │ REVIEW │   5    │   5    │
│ 102     │ REVIEW │   2    │   1    │
│ 103     │ PURCHASE│  -    │   8    │
│ 104     │ VIEW   │   -    │   1    │
└─────────┴────────┴────────┴────────┘

Book vectors (simplified 4D):
- v_101 = [0.9, 0.1, 0.2, 0.1]  (Python book)
- v_102 = [0.1, 0.9, 0.1, 0.1]  (Cooking book)
- v_103 = [0.8, 0.2, 0.3, 0.2]  (Programming book)
- v_104 = [0.7, 0.3, 0.2, 0.3]  (Tech book)

Separate items:
POSITIVE (101, 103, 104):
  d_plus = (5×v_101) + (8×v_103) + (1×v_104)
         = (5×[0.9, 0.1, 0.2, 0.1]) +
           (8×[0.8, 0.2, 0.3, 0.2]) +
           (1×[0.7, 0.3, 0.2, 0.3])
         = [4.5, 0.5, 1.0, 0.5] +
           [6.4, 1.6, 2.4, 1.6] +
           [0.7, 0.3, 0.2, 0.3]
         = [11.6, 2.4, 3.6, 2.4]

  ū₊ = [11.6, 2.4, 3.6, 2.4] / 3
     = [3.87, 0.80, 1.20, 0.80]

NEGATIVE (102):
  d_minus = (1×v_102)  # weight = 3 - 2 = 1
           = [0.1, 0.9, 0.1, 0.1]

  ū₋ = [0.1, 0.9, 0.1, 0.1] / 1
     = [0.1, 0.9, 0.1, 0.1]

Rocchio (assume u₀ = [1.0, 1.0, 1.0, 1.0]):
  u = 0.8×[1.0, 1.0, 1.0, 1.0] +
      1.0×[3.87, 0.80, 1.20, 0.80] -
      0.3×[0.1, 0.9, 0.1, 0.1]
    = [0.8, 0.8, 0.8, 0.8] +
      [3.87, 0.80, 1.20, 0.80] -
      [0.03, 0.27, 0.03, 0.03]
    = [4.64, 1.33, 1.97, 1.57]

Normalize (L2):
  ||u||₂ = sqrt(4.64² + 1.33² + 1.97² + 1.57²)
         = sqrt(21.53 + 1.77 + 3.88 + 2.46)
         = sqrt(29.64) ≈ 5.44

  u_normalized = [4.64/5.44, 1.33/5.44, 1.97/5.44, 1.57/5.44]
               ≈ [0.85, 0.24, 0.36, 0.29]

✅ Final User Profile: [0.85, 0.24, 0.36, 0.29]
   → Thích sách Programming (dimension 0,2,3)
   → Không thích sách Cooking (dimension 1)
```

---

## 🎯 Recommendation Flow

### Basic Flow

```
┌─────────────────────────────────────┐
│ recommend(user_id=5, top_n=10)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ STEP 1: Build User Profile          │
│ user_vector =                        │
│ build_user_profile_rocchio(user_id) │
│                                     │
│ ❌ None → use fallback              │
│ ✅ Found → continue                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼────────────────────────┐
│ STEP 2: Query Similar Books           │
│                                       │
│ client.query_points(                  │
│   collection_name=books_collection,   │
│   query=user_vector,                  │
│   limit=top_n                         │
│ )                                     │
│                                       │
│ Returns: Top 10 most similar books    │
└──────────────┬────────────────────────┘
               │
┌──────────────▼────────────────────────┐
│ STEP 3: Format & Return               │
│                                       │
│ For each hit:                         │
│ {                                     │
│   book_id: hit.id,                    │
│   score: hit.score (0-1)              │
│ }                                     │
└────────────────────────────────────────┘
```

### Similarity Matching Explained

```
User Profile u = [0.85, 0.24, 0.36, 0.29]
                 (ưa Programming, không ưa Cooking)

Book Vectors:
- Book 101 (Python): [0.90, 0.05, 0.40, 0.35]
- Book 102 (Cooking): [0.10, 0.90, 0.05, 0.15]
- Book 103 (C++): [0.88, 0.08, 0.38, 0.32]

Cosine Similarity = (u · v) / (||u|| × ||v||)

With Book 101:
  u · v = 0.85×0.90 + 0.24×0.05 + 0.36×0.40 + 0.29×0.35
        = 0.765 + 0.012 + 0.144 + 0.1015
        = 1.0225 ≈ HIGH ✅ (User thích sách này)

With Book 102:
  u · v = 0.85×0.10 + 0.24×0.90 + 0.36×0.05 + 0.29×0.15
        = 0.085 + 0.216 + 0.018 + 0.0435
        = 0.3625 ≈ LOW ❌ (User không thích sách này)

With Book 103:
  u · v = 0.85×0.88 + 0.24×0.08 + 0.36×0.38 + 0.29×0.32
        = 0.748 + 0.0192 + 0.1368 + 0.0928
        = 0.9968 ≈ VERY HIGH ✅✅ (User rất thích)

Ranking:
1. Book 103: 0.997 ⭐⭐⭐⭐⭐
2. Book 101: 0.923 ⭐⭐⭐⭐
3. Book 102: 0.363 ⭐
```

---

## 📊 Chi Tiết Các Method

### 1. `__init__()` - Initialization

```python
def __init__(self, qdrant_host="localhost", qdrant_port=6333):
    self.client = QdrantClient(host=qdrant_host, port=qdrant_port)
    self.book_col = "books_collection"      # Vector DB collection
    self.user_col = "users_collection"      # User profile collection
    self.model_path = "tfidf_model.pkl"    # TF-IDF model file

    self.tfidf = None                       # Will be loaded
    self.vector_size = 2048                 # TF-IDF output dimensions
    self._load_model()                      # Load or initialize
```

---

### 2. `_load_model()` - Load or Initialize TF-IDF

```python
def _load_model(self):
    # Kiểm tra xem model đã trained chưa
    if os.path.exists(self.model_path):
        # ✅ Model đã tồn tại, load từ file
        with open(self.model_path, 'rb') as f:
            self.tfidf = pickle.load(f)
            self.vector_size = len(self.tfidf.get_feature_names_out())
    else:
        # ❌ Model chưa có, khởi tạo mới
        self.tfidf = TfidfVectorizer(
            tokenizer=my_vietnamese_tokenizer,  # Custom tokenizer for Vietnamese
            stop_words=get_stop_words(),        # Remove: a, an, the, và, hay...
            max_features=self.vector_size       # Keep top 2048 features
        )
        # Lưu ý: Chưa fit tại đây, sẽ fit trong train()
```

---

### 3. `train()` - Train TF-IDF & Upload to Qdrant

**Purpose**: Extract content features and store vectors

**Flow**:

1. Load books data
2. Combine text fields
3. Fit & transform TF-IDF
4. Save model
5. Create/recreate Qdrant collections
6. Upload vectors

---

### 4. `build_user_profile_rocchio()` - Build User Profile

**Purpose**: Create vector representation of user preferences using Rocchio algorithm

**Return**:

- `np.array`: User profile vector (2048 dimensions)
- `None`: If user has no interactions

---

### 5. `recommend()` - Get Recommendations

```python
def recommend(self, user_id, top_n=10):
    # 1. Build profile
    user_vector = self.build_user_profile_rocchio(user_id)

    # 2. Handle cold start
    if user_vector is None:
        # Fallback to popular books
        popular_df = get_popular_books_from_db(top_n)
        recommendations = []
        for _, row in popular_df.iterrows():
            recommendations.append({
                "book_id": int(row["book_id"]),
                "title": row.get("title"),
                "score": 0.5,
                "predicted_rating": 2.5,
                "type": "popular-fallback"
            })
        return recommendations

    # 3. Query Qdrant for similar books
    search_results = self.client.query_points(
        collection_name=self.book_col,
        query=user_vector.tolist(),
        limit=top_n
    ).points

    # 4. Format results
    return [{
        "book_id": hit.id,
        "score": hit.score
    } for hit in search_results]
```

---

### 6. `recommend_similar_books()` - Find Similar Books

```python
def recommend_similar_books(self, book_id, top_n=10):
    """
    Dùng cho: Trang chi tiết sách (show "Sách tương tự")
    """
    # 1. Get vector của sách hiện tại
    res = self.client.retrieve(
        self.book_col,
        ids=[int(book_id)],
        with_vectors=True
    )

    if not res:
        return []  # Book not found

    # 2. Query similar books
    search_results = self.client.query_points(
        collection_name=self.book_col,
        query=res[0].vector,
        limit=top_n + 1  # +1 để bao gồm chính nó
    ).points

    # 3. Exclude the book itself
    return [{
        "book_id": hit.id,
        "score": hit.score
    } for hit in search_results if hit.id != book_id]
```

---

## 📦 Data Structure

### TF-IDF Matrix

```
┌──────────────────────────────────────────┐
│   TF-IDF Matrix (Sparse)                 │
├──────────────────────────────────────────┤
│                                          │
│          [Feature 1] [Feature 2] ... [Feature 2048]
│ Book 1:    0.45        0.82       ...    0.12
│ Book 2:    0.12        0.56       ...    0.78
│ Book 3:    0.78        0.34       ...    0.45
│ ...
│ Book N:    0.23        0.67       ...    0.34
│                                          │
│ Shape: (num_books, 2048)                │
│ Sparsity: ~95% (mostly zeros)           │
│                                          │
└──────────────────────────────────────────┘
```

### Qdrant Point Structure

```python
PointStruct(
    id=101,  # book_id
    vector=[0.45, 0.82, 0.12, ..., 0.23],  # TF-IDF vector (2048D)
    payload={
        "title": "Python Programming",  # Metadata
        "author": "John Doe"            # (optional)
    }
)
```

---

## 💡 Ví Dụ Thực Tế

### Scenario 1: New User (Cold Start)

```python
engine = ContentEngine()
engine.train()

# User 1000 mới tạo, chưa interact gì
result = engine.recommend(user_id=1000, top_n=5)

# Output: Popular books fallback
# [
#   {"book_id": 10, "title": "Best Seller 1", "score": 0.5, "type": "popular-fallback"},
#   {"book_id": 20, "title": "Best Seller 2", "score": 0.5, "type": "popular-fallback"},
#   ...
# ]
```

### Scenario 2: Established User

```python
# User 5 có interaction history
result = engine.recommend(user_id=5, top_n=5)

# Output: Personalized recommendations
# [
#   {"book_id": 101, "score": 0.92},  # Python book (user thích)
#   {"book_id": 105, "score": 0.88},  # Programming book
#   {"book_id": 112, "score": 0.85},  # Tech book
#   ...
# ]
```

### Scenario 3: Similar Books (Detail Page)

```python
# User đang xem sách 101 (Python Advanced)
similar = engine.recommend_similar_books(book_id=101, top_n=5)

# Output:
# [
#   {"book_id": 103, "score": 0.95},  # C++ Programming
#   {"book_id": 107, "score": 0.91},  # Java Programming
#   {"book_id": 112, "score": 0.88},  # Programming Design Patterns
#   {"book_id": 120, "score": 0.82},  # Data Structures
#   {"book_id": 125, "score": 0.79}   # Algorithms
# ]
```

---

## 🎓 Key Insights

### Ưu Điểm

✅ **No Cold Start for Items**: Mọi sách mới đều có vector (từ text)
✅ **Interpretable**: Biết được từ nào quan trọng (TF-IDF)
✅ **Fast**: Cosine similarity rất nhanh
✅ **Scalable**: Qdrant hỗ trợ millions of vectors

### Nhược Điểm

❌ **New User Problem**: Cần user interact trước mới build profile
❌ **Limited Diversity**: Chỉ gợi ý dựa trên nội dung
❌ **Vocabulary Dependent**: Phụ thuộc vào text quality
❌ **No Serendipity**: Không khám phá sách khác chủ đề

---

## 🔧 Troubleshooting

### Vấn Đề 1: Quá ít interactions

```
Triệu chứng: User có vài interactions nhưng profile vector quá mạy
Nguyên nhân: Normalize vector lúc ||u||₂ quá nhỏ
Giải pháp: Add smoothing hoặc min vector length
```

### Vấn Đề 2: Popular books luôn xuất hiện

```
Triệu chứng: Fallback quá thường xuyên
Nguyên nhân: User interactions bị mất hoặc empty
Giải pháp: Kiểm tra get_detailed_interactions()
```

---

## 📈 Performance Metrics

- **TF-IDF Training**: O(D × V) where D=docs, V=vocab
- **Profile Building**: O(I × 2048) where I=interactions
- **Query**: O(log N) with Qdrant indexing
- **Memory**: ~2GB cho 100k books

---

## 🎯 Summary

**ContentEngine** dùng **content-based filtering** để:

1. Vectorize sách từ text (TF-IDF)
2. Build user profiles từ interactions (Rocchio)
3. Gợi ý sách tương tự (Cosine similarity)
4. Fallback to popular books (Cold start handling)

Phương pháp mạnh cho books có content tốt, kết hợp tốt với Collaborative! 🚀
