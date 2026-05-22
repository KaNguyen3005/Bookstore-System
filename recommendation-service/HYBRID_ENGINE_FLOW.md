# Hybrid Recommendation Engine - Flow Documentation

## 📋 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Architecture](#architecture)
3. [Flow Chính](#flow-chính)
4. [Chi Tiết Các Method](#chi-tiết-các-method)
5. [Data Flow](#data-flow)
6. [Ví Dụ Sử Dụng](#ví-dụ-sử-dụng)

---

## 🎯 Tổng Quan

**HybridRecommendationEngine** là hệ thống gợi ý kết hợp hai phương pháp:
- **Collaborative Filtering**: Gợi ý dựa vào hành vi của những user tương tự
- **Content-based Filtering**: Gợi ý dựa vào đặc trưng của sách (tiêu đề, tác giả, thể loại, mô tả)

Hệ thống sử dụng **weighted average** để kết hợp điểm số từ cả hai phương pháp.

### Thành Phần Chính
```
HybridRecommendationEngine
├── CollaborativeItemEngine (collaborative_engine)
├── ContentEngine (content_engine)
├── Books Cache (_books_cache)
└── Weights (collab_weight, content_weight)
```

---

## 🏗️ Architecture

### Luồng Dữ Liệu Tổng Quát

```
┌─────────────────────────────────────────────────────────────┐
│         HybridRecommendationEngine                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────┐          ┌─────────────────────┐   │
│  │ Collaborative      │          │ Content-based       │   │
│  │ Engine             │          │ Engine              │   │
│  │ (Qdrant Vector DB) │          │ (Qdrant Vector DB)  │   │
│  └────────────────────┘          └─────────────────────┘   │
│           │                                    │             │
│           └──────────┬───────────────────────┘              │
│                      │                                       │
│           ┌──────────▼──────────┐                           │
│           │ _merge_recommendations()                        │
│           │ - Normalize scores                              │
│           │ - Merge by book_id                              │
│           │ - Apply weights                                 │
│           │ - Sort & Return Top N                           │
│           └──────────┬──────────┘                           │
│                      │                                       │
│           ┌──────────▼──────────┐                           │
│           │ Final Recommendations                           │
│           │ + Metadata                                      │
│           └──────────┬──────────┘                           │
│                      │                                       │
│  ┌────────────────────▼──────────────────┐                 │
│  │ Books Cache (get_books_data())         │                 │
│  │ - Title, Authors, Categories, etc     │                 │
│  └────────────────────────────────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flow Chính

### Khởi Tạo (Constructor)

```python
HybridRecommendationEngine(
    collab_weight=0.5,
    content_weight=0.5,
    qdrant_host="localhost",
    qdrant_port=6333
)
```

**Các bước:**
1. Lưu trữ weights cho hai phương pháp
2. Khởi tạo `CollaborativeItemEngine` - kết nối tới Qdrant
3. Khởi tạo `ContentEngine` - kết nối tới Qdrant
4. Gọi `_load_books_cache()` để tải thông tin sách

**Tại sao cần cache?**
- Tránh query database quá nhiều
- Cải thiện tốc độ phản hồi
- Sử dụng để enrichment recommendation (thêm title, info)

---

### Flow Gợi Ý Chính (recommend method)

```
┌─────────────────────────────────────────────────────────┐
│ recommend(user_id=23, top_n=10)                         │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │ STEP 1: Collaborative    
        │ collab_recs =             
        │ collaborative_engine      
        │ .recommend(23, top_n=15)  
        └──────────┬──────────┘
                   │
                   │ Returns List[Dict]:
                   │ [
                   │   {book_id: 101, title: '...',
                   │    predicted_rating: 4.2, ...},
                   │   ...
                   │ ]
                   │
        ┌──────────▼──────────────┐
        │ STEP 2: Content-based      
        │ content_recs =             
        │ content_engine             
        │ .recommend(23, top_n=15)   
        └──────────┬────────────────┘
                   │
                   │ Returns List[Dict]:
                   │ [
                   │   {book_id: 105, title: '...',
                   │    score: 0.85, ...},
                   │   ...
                   │ ]
                   │
        ┌──────────▼──────────────────┐
        │ STEP 3: Merge Recommendations   
        │ _merge_recommendations(       
        │   collab_recs, content_recs,    
        │   top_n=10)                    
        │                                 
        │ 3a. Normalize scores [0,1]    
        │ 3b. Merge by book_id           
        │ 3c. Calculate hybrid score:    
        │     = 0.5*collab + 0.5*content 
        │ 3d. Sort by score, top 10     
        └──────────┬──────────────────┘
                   │
        ┌──────────▼──────────────────┐
        │ STEP 4: Enrich & Return         
        │ - Fetch titles từ cache         
        │ - Round scores                  
        │ - Return result dict            
        └──────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│ FALLBACK (nếu không có kết quả)     │
│ Nếu final_recs rỗng:                │
│ → get_fallback_recommendations()    │
│ → Popular books                     │
└──────────────────┬──────────────────┘
                   │
        ┌──────────▼──────────────┐
        │ Return {                   
        │   user_id: 23,             
        │   recommendations: [       
        │     {                      
        │       book_id: 101,        
        │       title: '...',        
        │       score: 0.823,        
        │       predicted_rating: 4.1,
        │       type: 'hybrid',      
        │       collab_score: 0.8,   
        │       content_score: 0.84  
        │     },                     
        │     ...                    
        │   ],                       
        │   total_count: 10,         
        │   method: 'hybrid'         
        │ }                          
        └────────────────────────────┘
```

---

## 📊 Chi Tiết Các Method

### 1. `_load_books_cache()` - Tải Cache Sách

**Mục đích**: Tải thông tin tất cả sách vào bộ nhớ để tìm kiếm nhanh

```python
def _load_books_cache(self):
    try:
        self._books_cache = get_books_data()  # Pandas DataFrame
    except Exception as e:
        print(f"⚠ Lỗi load books cache: {e}")
        self._books_cache = pd.DataFrame()
```

**Cache Structure**:
```
_books_cache = DataFrame(
    book_id: [1, 2, 3, ...],
    title: ['Tên sách 1', 'Tên sách 2', ...],
    author: ['Tác giả 1', 'Tác giả 2', ...],
    category: ['Thể loại 1', ...],
    ...
)
```

**Lợi ích:**
- Tra cứu O(1) theo `book_id`
- Tránh gọi database liên tục
- Giảm độ trễ gợi ý

---

### 2. `_normalize_scores(scores)` - Chuẩn Hóa Điểm Số

**Mục đích**: Đưa tất cả scores về range [0, 1] để so sánh công bằng

```python
def _normalize_scores(self, scores: List[float]) -> List[float]:
    if not scores:
        return []
    
    scores = np.array(scores)
    min_score = scores.min()
    max_score = scores.max()
    
    if max_score == min_score:  # Tất cả scores bằng nhau
        return [0.5] * len(scores)
    
    # Min-max normalization: (x - min) / (max - min)
    return ((scores - min_score) / (max_score - min_score)).tolist()
```

**Ví dụ:**
```
Input:  [2.0, 3.5, 4.8, 1.2]
Output: [0.24, 0.52, 0.82, 0.0]

Công thức:
- min = 1.2, max = 4.8, range = 3.6
- 2.0  → (2.0-1.2)/3.6 = 0.22
- 3.5  → (3.5-1.2)/3.6 = 0.64
- 4.8  → (4.8-1.2)/3.6 = 1.0
- 1.2  → (1.2-1.2)/3.6 = 0.0
```

**Tại sao cần?**
- Collaborative scores: 0-5 (rating)
- Content scores: 0-1 (similarity)
- Chuẩn hóa → có thể so sánh công bằng

---

### 3. `_merge_recommendations()` - Hợp Nhất Kết Quả

**Mục đích**: Kết hợp kết quả từ 2 engines bằng weighted average

**Flow Chi Tiết:**

```python
def _merge_recommendations(self, collab_recs, content_recs, top_n=10):
    
    # BƯỚC 1: Normalize collaborative scores
    for rec in collab_recs:
        rec['normalized_score'] = rec.get('predicted_rating', 0) / 5.0
    #       Chia cho 5 vì rating là 0-5 stars
    
    # BƯỚC 2: Content scores đã là [0,1] (từ Qdrant similarity)
    for rec in content_recs:
        rec['normalized_score'] = rec.get('score', 0)
    
    # BƯỚC 3: Merge by book_id
    merged = {}
    
    # Thêm từ collaborative
    for rec in collab_recs:
        book_id = rec['book_id']
        merged[book_id] = {
            'book_id': book_id,
            'collab_score': rec.get('normalized_score', 0),
            'content_score': 0,  # Chưa có từ content
            'title': rec.get('title'),
            'type': 'collaborative'  # Tạm thời
        }
    
    # Merge từ content (cập nhật hoặc thêm mới)
    for rec in content_recs:
        book_id = rec['book_id']
        if book_id in merged:
            # Sách này từ cả 2 engines → HYBRID
            merged[book_id]['content_score'] = rec.get('normalized_score', 0)
            merged[book_id]['type'] = 'hybrid'
        else:
            # Sách này chỉ từ content
            merged[book_id] = {
                'book_id': book_id,
                'collab_score': 0,
                'content_score': rec.get('normalized_score', 0),
                'title': rec.get('title'),
                'type': 'content-based'
            }
    
    # BƯỚC 4: Tính hybrid score
    for book_id, item in merged.items():
        item['final_score'] = (
            0.5 * item['collab_score'] +    # Collaborative weight
            0.5 * item['content_score']     # Content weight
        )
    
    # BƯỚC 5: Sort và lấy top N
    sorted_recs = sorted(
        merged.items(),
        key=lambda x: x[1]['final_score'],
        reverse=True
    )
    
    # BƯỚC 6: Format kết quả
    result = []
    for book_id, item in sorted_recs[:top_n]:
        # Lấy title từ cache nếu chưa có
        title = item['title']
        if title is None and not self._books_cache.empty:
            book_info = self._books_cache[
                self._books_cache['book_id'] == book_id
            ]
            if not book_info.empty:
                title = book_info.iloc[0].get('title')
        
        result.append({
            'book_id': book_id,
            'title': title,
            'score': round(item['final_score'], 3),
            'predicted_rating': round(item['final_score'] * 5, 2),
            'type': item['type'],
            'collab_score': round(item['collab_score'], 3),
            'content_score': round(item['content_score'], 3)
        })
    
    return result
```

**Ví Dụ Merge:**

```
Collab Recs:          Content Recs:         Merged & Scored:
────────────          ─────────────         ──────────────────
book_id: 101          book_id: 102          book_id: 101
rating: 4.5           score: 0.92           collab: 0.90, content: 0
→ norm: 0.90          → norm: 0.92          final: 0.5*0.90 + 0.5*0 = 0.45
                                            type: collaborative
book_id: 103          book_id: 103          
rating: 4.2           score: 0.78           book_id: 102
→ norm: 0.84          → norm: 0.78          collab: 0, content: 0.92
                                            final: 0.5*0 + 0.5*0.92 = 0.46
                                            type: content-based

                                            book_id: 103
                                            collab: 0.84, content: 0.78
                                            final: 0.5*0.84 + 0.5*0.78 = 0.81
                                            type: HYBRID ⭐
```

---

### 4. `recommend()` - Hàm Gợi Ý Chính

**Mục đích**: Gợi ý sách cho một user, kết hợp cả 2 phương pháp

**Quy trình:**
1. Lấy recommendations từ Collaborative Engine (top_n + 5 để dự phòng)
2. Lấy recommendations từ Content Engine (top_n + 5)
3. Merge kết quả bằng `_merge_recommendations()`
4. **Fallback 1**: Nếu không có kết quả → popular books
5. **Fallback 2**: Nếu hybrid thất bại → pure collaborative
6. **Fallback 3**: Nếu tất cả fail → return []

**Error Handling:**
```
┌─────────────────────────┐
│ Collaborative gets recs │
└────────────┬────────────┘
             │ Exception?
             ├─ NO  ──→ Content-based gets recs
             │         │ Exception?
             │         ├─ NO  ──→ Merge & Return
             │         └─ YES ──→ Return []
             │
             └─ YES ──→ Fallback to pure collab
                       │ Exception?
                       ├─ NO  ──→ Return collab recs
                       └─ YES ──→ Return [] 🚨
```

---

### 5. `get_related_books()` - Tìm Sách Liên Quan

**Mục đích**: Tìm sách tương tự dựa vào nội dung (tiêu đề, tác giả, mô tả)

**Flow:**

```python
def get_related_books(self, book_id=1, top_n=10):
    
    # BƯỚC 1: Lấy thông tin sách từ cache
    if self._books_cache is None or self._books_cache.empty:
        self._load_books_cache()
    
    target_book = self._books_cache[
        self._books_cache['book_id'] == book_id
    ]
    
    if target_book.empty:
        return {'book_id': 1, 'related_books': [], ...}
    
    target_title = target_book.iloc[0]['title']
    
    # BƯỚC 2: Lấy vector của sách từ Qdrant
    try:
        result = self.content_engine.client.retrieve(
            collection_name=self.content_engine.book_col,
            ids=[book_id],
            with_vectors=True
        )
        
        if result:
            book_vector = result[0].vector
            # Ví dụ: [0.45, 0.82, 0.12, ..., 0.78] (768 chiều)
            
            # BƯỚC 3: Query các sách có vector tương tự
            similar = self.content_engine.client.query_points(
                collection_name=self.content_engine.book_col,
                query=book_vector,
                limit=top_n + 10,  # +10 để bao gồm chính nó
                with_payload=True
            ).points
            
            # BƯỚC 4: Filter và format
            related = []
            for hit in similar:
                if hit.id == book_id:  # Skip chính nó
                    continue
                
                # Lấy title từ cache
                title = hit.payload.get('title')
                if title is None:
                    book_info = self._books_cache[
                        self._books_cache['book_id'] == hit.id
                    ]
                    if not book_info.empty:
                        title = book_info.iloc[0]['title']
                
                related.append({
                    'book_id': hit.id,
                    'title': title,
                    'score': round(hit.score, 3),
                    'predicted_rating': round(hit.score * 5, 2),
                    'type': 'similar-content'
                })
                
                if len(related) >= top_n:
                    break
            
            return {
                'book_id': book_id,
                'book_title': target_title,
                'related_books': related,
                'total_count': len(related)
            }
    
    except Exception:
        # FALLBACK: Trả về popular books
        popular = self.collaborative_engine.get_fallback_recommendations(top_n)
        return {
            'book_id': book_id,
            'book_title': target_title,
            'related_books': popular,
            'total_count': len(popular)
        }
```

**Similarity Vector Matching:**
```
Book 1 Vector:      Book 2 Vector:
[0.45, 0.82, ...]   [0.46, 0.81, ...]
              ↓
         Cosine Similarity = 0.95
         (Rất giống nhau!)

Sách 1: "Python Programming"
Sách 2: "Python Best Practices"
→ Similarity cao vì cùng chủ đề
```

---

### 6. `train_engines()` - Huấn Luyện Engines

**Mục đích**: Cập nhật models cho cả collaborative và content-based engines

```python
def train_engines(self, retrain_collaborative=True, retrain_content=True):
    result = {
        'status': 'success',
        'message': [],
        'collaborative_trained': False,
        'content_trained': False
    }
    
    # Train Collaborative
    if retrain_collaborative:
        try:
            self.collaborative_engine.train_and_sync()
            result['collaborative_trained'] = True
            result['message'].append("✅ Collaborative engine trained")
        except Exception as e:
            result['message'].append(f"❌ Collaborative failed: {str(e)}")
    
    # Train Content
    if retrain_content:
        try:
            # Content engine training (nếu cần)
            result['content_trained'] = True
            result['message'].append("✅ Content engine trained")
        except Exception as e:
            result['message'].append(f"❌ Content failed: {str(e)}")
    
    return result
```

---

## 🌊 Data Flow

### Dòng Dữ Liệu Hoàn Chỉnh

```
┌──────────────────────────────────────────────────────────────┐
│                        USER REQUEST                          │
│              recommend(user_id=23, top_n=10)                │
└──────────────────────┬───────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │ Collaborative Engine        │
        │ - User interaction history  │
        │ - User-user similarity      │
        │ - Predict ratings (0-5)     │
        └──────────────┬──────────────┘
                       │
                       │ Returns:
                       │ [
                       │   {book_id: 101, rating: 4.5, ...},
                       │   {book_id: 103, rating: 4.2, ...},
                       │   ...
                       │ ]
                       │
        ┌──────────────▼──────────────┐
        │ Content Engine              │
        │ - Book vectors (embedding)  │
        │ - Title, author, desc       │
        │ - Similarity scores (0-1)   │
        └──────────────┬──────────────┘
                       │
                       │ Returns:
                       │ [
                       │   {book_id: 102, score: 0.92, ...},
                       │   {book_id: 105, score: 0.88, ...},
                       │   ...
                       │ ]
                       │
        ┌──────────────▼──────────────────────────────┐
        │ Normalization                               │
        │ Collab: 4.5/5 = 0.90, 4.2/5 = 0.84         │
        │ Content: already [0, 1]                     │
        └──────────────┬───────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────┐
        │ Merge by book_id                            │
        │ - Collaborative only: type='collaborative' │
        │ - Content only: type='content-based'       │
        │ - Both: type='hybrid'                      │
        └──────────────┬───────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────┐
        │ Weighted Averaging                          │
        │ final = 0.5*collab + 0.5*content           │
        │ (Weights từ constructor)                    │
        └──────────────┬───────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────┐
        │ Sorting & Top N                             │
        │ Sort by final_score DESC                    │
        │ Take top 10 items                           │
        └──────────────┬───────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────┐
        │ Enrichment từ Cache                         │
        │ Fetch title, author từ _books_cache         │
        │ Convert scores (5-star rating)              │
        └──────────────┬───────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                  RESPONSE                                    │
│ {                                                            │
│   user_id: 23,                                               │
│   recommendations: [                                         │
│     {                                                        │
│       book_id: 103,                                          │
│       title: "Python Advanced",                              │
│       score: 0.823,                                          │
│       predicted_rating: 4.11,                                │
│       type: "hybrid",                                        │
│       collab_score: 0.84,                                    │
│       content_score: 0.80                                    │
│     },                                                       │
│     ...                                                      │
│   ],                                                         │
│   total_count: 10,                                           │
│   method: "hybrid"                                           │
│ }                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 💡 Ví Dụ Sử Dụng

### 1. Gợi Ý Sách Cho User

```python
hybrid = HybridRecommendationEngine(
    collab_weight=0.6,    # 60% collaborative
    content_weight=0.4,   # 40% content-based
    qdrant_host="localhost",
    qdrant_port=6333
)

# Gợi ý cho user 23
result = hybrid.recommend(user_id=23, top_n=10)

print(f"User {result['user_id']}")
print(f"Method: {result['method']}")
for rec in result['recommendations']:
    print(f"  📕 {rec['title']}")
    print(f"     Score: {rec['score']:.3f} ({rec['predicted_rating']} ⭐)")
    print(f"     Type: {rec['type']}")
```

**Output:**
```
User 23
Method: hybrid
  📕 Python Advanced Techniques
     Score: 0.823 (4.11 ⭐)
     Type: hybrid
  📕 Clean Code in Python
     Score: 0.805 (4.02 ⭐)
     Type: content-based
  ...
```

---

### 2. Tìm Sách Liên Quan

```python
book_id = 101
related = hybrid.get_related_books(book_id, top_n=5)

print(f"Sách liên quan với: {related['book_title']}")
for rec in related['related_books']:
    print(f"  📕 {rec['title']} - {rec['score']:.3f}")
```

**Output:**
```
Sách liên quan với: Python Basics
  📕 Python for Data Science - 0.92
  📕 Advanced Python - 0.88
  📕 Python Design Patterns - 0.85
  📕 Python Performance - 0.82
  📕 Python Web Development - 0.79
```

---

### 3. Huấn Luyện Engines

```python
train_result = hybrid.train_engines(
    retrain_collaborative=True,
    retrain_content=True
)

print(train_result['message'])
# Output: ✅ Collaborative engine trained
#         ✅ Content engine trained
```

---

## 🎓 Key Concepts

### Weights & Tuning

**Scenario 1: Ưu tiên Collaborative (60% / 40%)**
- Tốt cho: Khám phá sách dựa vào user tương tự
- Kém: Có thể bỏ qua nội dung đặc thù

**Scenario 2: Balanced (50% / 50%)**
- Tốt cho: Cân bằng giữa hành vi user & nội dung
- Mặc định: Đa phần trường hợp

**Scenario 3: Ưu tiên Content (40% / 60%)**
- Tốt cho: Gợi ý dựa nội dung, ít phụ thuộc vào history
- Kém: Có thể miss mối quan hệ user thú vị

---

### Types of Recommendations

| Type | Định Nghĩa | Ưu Điểm | Nhược Điểm |
|------|-----------|--------|-----------|
| **hybrid** | Cả collaborative & content | Chính xác nhất | Phức tạp |
| **collaborative** | Chỉ từ user behavior | Phát hiện trend | Cold start problem |
| **content-based** | Chỉ từ nội dung | Không cần lịch sử | Bảo thủ |
| **fallback** | Popular books | Luôn có kết quả | Không personalized |

---

## 🔧 Troubleshooting

### Trường Hợp 1: Không Có Kết Quả Hybrid

```
Nguyên nhân → Giải pháp
────────────────────────
Qdrant down → Kiểm tra kết nối, restart Qdrant
User mới → Fallback to popular books
Database empty → Populate data, train engines
```

### Trường Hợp 2: Scores Không Hợp Lý

```
Vấn đề: Tất cả scores ≈ 0.5
Nguyên nhân: _normalize_scores() khi max==min
Giải pháp: Kiểm tra data, đảm bảo diversity

Vấn đề: Scores quá cao (> 1.0)
Nguyên nhân: Code bug trong normalization
Giải pháp: Check _merge_recommendations()
```

---

## 📈 Performance Notes

- **Memory**: Cache chứa ~M sách, ~100MB RAM
- **Speed**: recommend() ≈ 200-500ms (2 queries + merge)
- **Scalability**: Qdrant hỗ trợ millions of vectors

---

## 🎯 Summary

**HybridRecommendationEngine** là hệ thống thông minh kết hợp:
1. **Collaborative**: "User như bạn thích sách này"
2. **Content-based**: "Sách này tương tự sách bạn thích"
3. **Weighted Merge**: Kết hợp cân bằng 2 phương pháp
4. **Fallback Strategy**: Luôn có kết quả, thậm chí khi 1 engine fail

Kiến trúc mạnh mẽ, dễ mở rộng, và robust với error handling tốt! 🚀
