# API Documentation - KaTiLa AI Recommender Service

## 📚 Hybrid Recommendation System

Hệ thống gợi ý kết hợp (Hybrid) sử dụng 2 mô hình AI:

### 1. **Collaborative Filtering (60%)**

- **Nguyên tắc**: Gợi ý sách dựa trên rating của những người dùng tương tự
- **Ưu điểm**: Tìm được những sách "bất ngờ" mà bạn chưa từng thấy
- **Nhược điểm**: Khó xử lý khi có người dùng/sách mới (cold start)
- **Dữ liệu**: Sử dụng ma trận rating từ `book_order`

### 2. **Content-Based Filtering (40%)**

- **Nguyên tắc**: Gợi ý sách dựa trên nội dung giống với những cuốn sách bạn đã xem
- **Ưu điểm**: Tốt cho người dùng mới, xử lý tốt cold start
- **Nhược điểm**: Có thể lặp lại (không đa dạng)
- **Dữ liệu**: Sử dụng tiêu đề, mô tả, tác giả, thể loại

### 3. **Fallback Strategy**

- Khi không có đủ dữ liệu: Trả về danh sách sách **phổ biến nhất**
- Xử lý user cold start (người dùng mới)
- Xử lý item cold start (sách mới chưa ai rate)

---

## 🔌 API Endpoints

### **1. GET `/api/recommendations/user/{user_id}`**

**Gợi ý sách cho một người dùng**

```
GET /api/recommendations/user/25?top_n=10
```

**Parameters:**
| Tham số | Kiểu | Mô tả | Mặc định |
|---------|------|-------|---------|
| `user_id` | int | ID người dùng | Bắt buộc |
| `top_n` | int | Số sách gợi ý (1-100) | 10 |

**Response:**

```json
{
  "user_id": 25,
  "recommendations": [
    {
      "book_id": 123,
      "title": "Python cho người mới",
      "score": 0.95,
      "predicted_rating": 4.75,
      "type": "hybrid"
    },
    {
      "book_id": 456,
      "title": "Machine Learning Basics",
      "score": 0.87,
      "predicted_rating": 4.35,
      "type": "content-based"
    }
  ],
  "total_count": 10,
  "method": "hybrid"
}
```

**Giải thích:**

- `score`: Độ tin cậy của gợi ý (0-1)
- `predicted_rating`: Dự đoán rating (1-5 sao)
- `type`: Loại gợi ý (hybrid, collaborative, content-based, popular)
- `method`: Phương pháp sử dụng (hybrid, collaborative, fallback, error)

---

### **2. GET `/api/recommendations/user/{user_id}/simple`**

**Gợi ý sách (format đơn giản)**

```
GET /api/recommendations/user/25/simple?top_n=10
```

**Response:**

```json
[
  {
    "book_id": 123,
    "title": "Python cho người mới",
    "score": 0.95,
    "predicted_rating": 4.75
  }
]
```

---

### **3. GET `/api/books/{book_id}/related`**

**Tìm sách liên quan với một sách cho trước**

```
GET /api/books/123/related?top_n=10
```

**Parameters:**
| Tham số | Kiểu | Mô tả | Mặc định |
|---------|------|-------|---------|
| `book_id` | int | ID sách | Bắt buộc |
| `top_n` | int | Số sách liên quan (1-50) | 10 |

**Response:**

```json
{
  "book_id": 123,
  "book_title": "Python cho người mới",
  "related_books": [
    {
      "book_id": 456,
      "title": "Advanced Python",
      "score": 0.92,
      "predicted_rating": 4.6,
      "type": "similar-content"
    }
  ],
  "total_count": 5
}
```

---

### **4. GET `/api/books/{book_id}/related/simple`**

**Tìm sách liên quan (format đơn giản)**

```
GET /api/books/123/related/simple?top_n=10
```

---

### **5. GET `/api/books/{book_id}/info`**

**Lấy thông tin chi tiết về một sách**

```
GET /api/books/123/info
```

**Response:**

```json
{
  "book_id": 123,
  "title": "Python cho người mới",
  "description": "Hướng dẫn...",
  "authors": "Tác giả 1, Tác giả 2",
  "categories": "Lập trình, Python"
}
```

---

### **6. GET `/api/books/search/by-title`**

**Tìm kiếm sách theo tiêu đề**

```
GET /api/books/search/by-title?title=Python&limit=10
```

**Parameters:**
| Tham số | Kiểu | Mô tả | Mặc định |
|---------|------|-------|---------|
| `title` | string | Tiêu đề cần tìm | Bắt buộc |
| `limit` | int | Số kết quả tối đa (1-50) | 10 |

---

### **7. POST `/api/recommendations/train`**

**Huấn luyện các recommendation engines**

```
POST /api/recommendations/train
Content-Type: application/json

{
  "retrain_collaborative": true,
  "retrain_content": true
}
```

**Response:**

```json
{
  "status": "success",
  "message": "✅ Collaborative engine trained\n✅ Content engine trained",
  "collaborative_trained": true,
  "content_trained": true
}
```

**⚠️ Lưu ý**: Thao tác này có thể mất vài phút tuỳ vào lượng dữ liệu

---

### **8. GET `/api/recommendations/stats`**

**Lấy thống kê về recommendation engines**

```
GET /api/recommendations/stats
```

**Response:**

```json
{
  "status": "healthy",
  "hybrid_engine": {
    "collaborative_weight": 0.6,
    "content_weight": 0.4
  },
  "collaborative_engine": {
    "collection_name": "item_item_cf"
  },
  "content_engine": {
    "vector_size": 2048,
    "book_collection": "books_collection",
    "user_collection": "users_collection"
  }
}
```

---

### **9. GET `/health`**

**Kiểm tra trạng thái dịch vụ**

```
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "database": "connected",
  "total_books": 5000,
  "message": "Service is operational"
}
```

---

## 🚀 Cách sử dụng

### **1. Gợi ý sách cho người dùng**

```bash
curl -X GET "http://localhost:8000/api/recommendations/user/25?top_n=10"
```

### **2. Tìm sách liên quan**

```bash
curl -X GET "http://localhost:8000/api/books/123/related?top_n=10"
```

### **3. Tìm kiếm sách**

```bash
curl -X GET "http://localhost:8000/api/books/search/by-title?title=Python&limit=10"
```

### **4. Huấn luyện models (sau khi có dữ liệu mới)**

```bash
curl -X POST "http://localhost:8000/api/recommendations/train" \
  -H "Content-Type: application/json" \
  -d '{"retrain_collaborative": true, "retrain_content": true}'
```

---

## 🔄 Luồng hoạt động

```
User Request
    ↓
┌───────────────────────────────────┐
│   Hybrid Recommendation Engine    │
│                                   │
│  ┌─────────────────────────────┐  │
│  │ Collaborative Filtering     │  │
│  │ (60% weight)                │  │
│  │ - User-Item Matrix          │  │
│  │ - Vector Similarity         │  │
│  └─────────────────────────────┘  │
│              ↓                     │
│  ┌─────────────────────────────┐  │
│  │ Content-Based Filtering     │  │
│  │ (40% weight)                │  │
│  │ - TF-IDF Vectorization      │  │
│  │ - Rocchio Algorithm         │  │
│  └─────────────────────────────┘  │
│              ↓                     │
│  ┌─────────────────────────────┐  │
│  │ Score Merging & Ranking     │  │
│  │ - Normalize scores          │  │
│  │ - Weighted average          │  │
│  │ - Sort by final score       │  │
│  └─────────────────────────────┘  │
│              ↓                     │
│  ┌─────────────────────────────┐  │
│  │ Fallback Strategy           │  │
│  │ - If no results             │  │
│  │ - Return popular books      │  │
│  └─────────────────────────────┘  │
└───────────────────────────────────┘
    ↓
Ranked Recommendations
```

---

## 📊 Type gợi ý (Recommendation Types)

| Type               | Nguồn         | Mô tả                              |
| ------------------ | ------------- | ---------------------------------- |
| `hybrid`           | CF + CBF      | Kết hợp từ 2 engines               |
| `collaborative`    | CF only       | Chỉ từ collaborative filtering     |
| `content-based`    | CBF only      | Chỉ từ content-based filtering     |
| `similar-content`  | CBF           | Sách liên quan dựa nội dung        |
| `popular`          | Popular books | Danh sách sách phổ biến (fallback) |
| `popular_fallback` | Popular books | Fallback cho user cold start       |

---

## 🔧 Cấu hình

### **Weights (trong `hybrid_engine.py`)**

```python
HybridRecommendationEngine(
    collab_weight=0.6,  # 60% Collaborative
    content_weight=0.4  # 40% Content-based
)
```

Điều chỉnh weights để thay đổi ảnh hưởng của từng model:

- **Tăng `collab_weight`**: Gợi ý dựa nhiều hơn trên hành vi người dùng
- **Tăng `content_weight`**: Gợi ý dựa nhiều hơn trên nội dung sách

### **Qdrant Vector Database**

```python
host="localhost"  # Qdrant server address
port=6333         # Qdrant server port
```

---

## 🐛 Troubleshooting

### **Lỗi: "Qdrant connection refused"**

```bash
# Kiểm tra Qdrant đang chạy
docker ps | grep qdrant

# Nếu chưa có, start Docker container
docker run -p 6333:6333 qdrant/qdrant
```

### **Lỗi: "No recommendations found"**

1. Kiểm tra user_id có tồn tại trong database
2. Đảm bảo models đã được train: `POST /api/recommendations/train`
3. Xem logs để chi tiết hơn

### **Gợi ý quá tương nhau**

- Tăng `content_weight` để đa dạng hơn
- Hoặc kiểm tra dữ liệu sách (categories, authors, description)

---

## 📈 Performance Tips

1. **Cache**: Books data được cache trong memory
2. **Batch training**: Train models hết giờ cao điểm (tối hôm)
3. **Qdrant indexes**: Đảm bảo Qdrant được index hợp lý
4. **Database**: Thêm indexes trên `book_order.book_id`, `book_order.rate`

---

## 📝 Database Tables

### **books_order** (Rating data)

```sql
SELECT o.customer_id as user_id, bo.book_id, bo.rate as rating
FROM book_order bo
JOIN orders o ON bo.order_id = o.order_id
WHERE bo.rate IS NOT NULL;
```

### **interact_events** (User interactions)

```sql
SELECT user_id, book_id, event_type, value
FROM interact_events;
```

**Event types:**

- `VIEW_BOOK` (weight: 1)
- `ADD_TO_CART` (weight: 3)
- `PURCHASE` (weight: 8)
- `REVIEW` (weight: 0, use rating value)

---

## 🎯 Next Steps

1. ✅ Deploy to production
2. ✅ Set up monitoring & logging
3. ✅ A/B testing different weights
4. ✅ Collect user feedback
5. ✅ Regular model retraining

---

## 📞 Support

Tham khảo OpenAPI documentation: http://localhost:8000/docs
