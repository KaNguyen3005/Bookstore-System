# 🎯 KaTiLa AI Recommender Service

Hệ thống gợi ý sách **Hybrid** kết hợp **Collaborative Filtering** và **Content-based Filtering** cho dự án KaTiLa eBook Platform.

## 📋 Nội dung

- [Tính năng](#-tính-năng)
- [Kiến trúc](#-kiến-trúc-hybrid)
- [Cài đặt](#-cài-đặt)
- [Chạy dịch vụ](#-chạy-dịch-vụ)
- [API Endpoints](#-api-endpoints)
- [Cấu hình](#-cấu-hình)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Tính năng

✅ **Hybrid Recommendations** - Kết hợp 2 mô hình AI  
✅ **Related Books** - Tìm sách liên quan  
✅ **Cold Start Handling** - Xử lý người dùng/sách mới  
✅ **Popular Fallback** - Fallback sang sách phổ biến  
✅ **Vector Search** - Tìm kiếm dựa trên vectors  
✅ **Vietnamese NLP** - Hỗ trợ tiếng Việt  
✅ **Scalable** - Sử dụng Qdrant vector database

---

## 🏗️ Kiến trúc Hybrid

```
┌─────────────────────────────────────────────────────────────┐
│         Hybrid Recommendation Engine (0.6 | 0.4)            │
│                                                             │
│  ┌──────────────────────┐    ┌──────────────────────────┐  │
│  │  Collaborative       │    │  Content-Based           │  │
│  │  Filtering (60%)     │    │  Filtering (40%)         │  │
│  │                      │    │                          │  │
│  │ • User ratings       │    │ • TF-IDF vectorization   │  │
│  │ • User-Item Matrix   │    │ • Rocchio algorithm      │  │
│  │ • Item Similarity    │    │ • User profile building  │  │
│  │ • Via Qdrant         │    │ • Content similarity     │  │
│  │   (Vector DB)        │    │ • Via Qdrant             │  │
│  └──────────────────────┘    └──────────────────────────┘  │
│           ↓                              ↓                  │
│  Normalize Scores (0-1) for each source                     │
│           ↓                              ↓                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │        Merge & Weight Average                         │  │
│  │  final_score = 0.6*collab + 0.4*content              │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Sort by Final Score → Top N Results                 │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Fallback: If no results → Popular Books              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### **Thành phần chính:**

1. **`collaborative_engine.py`** - Item-based collaborative filtering
   - Sử dụng User-Item rating matrix
   - Tính item similarity dựa trên ratings
   - Dự đoán rating cho unread books

2. **`content_engine.py`** - Content-based filtering
   - TF-IDF vectorization cho tiêu đề/mô tả
   - Rocchio algorithm để build user profile
   - Query vector similarity trên Qdrant

3. **`hybrid_engine.py`** - Hybrid recommender
   - Kết hợp kết quả từ cả 2 engines
   - Normalize scores
   - Merge và rank by weighted score

4. **`data_access/database.py`** - Data layer
   - Lấy ratings, interactions từ MySQL
   - Get books data, popular books, etc.

---

## 🔧 Cài đặt

### **1. Prerequisites**

- Python 3.8+
- MySQL 5.7+
- Docker (để chạy Qdrant)
- Git

### **2. Clone Repository**

```bash
cd e:\2026\ProjectWebBanSach\recommendation-service
```

### **3. Tạo Virtual Environment**

```bash
python -m venv venv
source venv/Scripts/activate  # Windows
# hoặc
source venv/bin/activate      # Linux/Mac
```

### **4. Cài đặt Dependencies**

```bash
pip install -r requirements.txt
```

### **5. Tạo `.env` file**

```bash
# .env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/katila_db
QDRANT_HOST=localhost
QDRANT_PORT=6333
```

### **6. Chuẩn bị Qdrant (Vector Database)**

```bash
# Pull Qdrant image
docker pull qdrant/qdrant

# Run Qdrant container
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -v qdrant_storage:/qdrant/storage \
  qdrant/qdrant
```

Kiểm tra Qdrant:

```bash
curl http://localhost:6333/health
```

---

## 🚀 Chạy dịch vụ

### **Phát triển (Development)**

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Service sẽ chạy tại: http://localhost:8000

### **Production**

```bash
gunicorn -w 4 -b 0.0.0.0:8000 "app.main:app"
```

---

## 📚 API Endpoints

### **1. Health Check**

```bash
GET /health
```

### **2. Gợi ý sách cho User**

```bash
GET /api/recommendations/user/{user_id}?top_n=10
```

### **3. Tìm sách liên quan**

```bash
GET /api/books/{book_id}/related?top_n=10
```

### **4. Tìm kiếm sách theo tiêu đề**

```bash
GET /api/books/search/by-title?title=Python&limit=10
```

### **5. Lấy thông tin sách**

```bash
GET /api/books/{book_id}/info
```

### **6. Train/Retrain models**

```bash
POST /api/recommendations/train
```

### **7. Lấy API stats**

```bash
GET /api/recommendations/stats
```

---

## 🔍 Ví dụ sử dụng

### **Python**

```python
import requests

# Gợi ý sách
response = requests.get(
    "http://localhost:8000/api/recommendations/user/25",
    params={"top_n": 10}
)
recommendations = response.json()

print(f"Số sách gợi ý: {len(recommendations['recommendations'])}")
for rec in recommendations['recommendations']:
    print(f"  {rec['book_id']}: {rec['title']} ({rec['score']:.2%})")
```

### **cURL**

```bash
# Gợi ý sách
curl "http://localhost:8000/api/recommendations/user/25?top_n=10"

# Sách liên quan
curl "http://localhost:8000/api/books/123/related?top_n=10"

# Tìm kiếm
curl "http://localhost:8000/api/books/search/by-title?title=Python"

# Train models
curl -X POST "http://localhost:8000/api/recommendations/train"
```

### **JavaScript/Fetch**

```javascript
// Gợi ý sách
fetch("http://localhost:8000/api/recommendations/user/25?top_n=10")
  .then((res) => res.json())
  .then((data) => {
    console.log(`Recommendations: ${data.total_count} books`);
    data.recommendations.forEach((rec) => {
      console.log(`  ${rec.book_id}: ${rec.title}`);
    });
  });
```

---

## ⚙️ Cấu hình

### **Adjust Weights**

Trong `app/services/hybrid_engine.py`:

```python
hybrid_engine = HybridRecommendationEngine(
    collab_weight=0.6,    # Tăng để rely more on collaborative
    content_weight=0.4    # Tăng để rely more on content
)
```

### **Database Configuration**

File `.env`:

```
DATABASE_URL=mysql+pymysql://user:pass@host:3306/db_name
QDRANT_HOST=localhost
QDRANT_PORT=6333
```

### **Qdrant Connection**

Trong `hybrid_engine.py`:

```python
def __init__(self,
             collab_weight: float = 0.5,
             content_weight: float = 0.5,
             qdrant_host: str = "localhost",
             qdrant_port: int = 6333):
```

---

## 📊 Database Schema

### **Tables cần thiết:**

1. **books** - Thông tin sách

   ```sql
   - book_id (PK)
   - title
   - description
   - is_active
   ```

2. **book_order** - Ratings

   ```sql
   - order_id (FK)
   - book_id (FK)
   - rate (1-5)
   - deleted_at
   ```

3. **orders** - Đơn hàng

   ```sql
   - order_id (PK)
   - customer_id (FK)
   - status
   - deleted_at
   ```

4. **interact_events** - User interactions

   ```sql
   - interact_event_id (PK)
   - user_id (FK)
   - book_id (FK)
   - event_type (VIEW_BOOK, ADD_TO_CART, PURCHASE, REVIEW)
   - value
   ```

5. **authors, categories** - Metadata
   ```sql
   - author_id / category_id (PK)
   - author_name / category_name
   ```

---

## 🧪 Testing

### **Test health check**

```bash
curl http://localhost:8000/health
```

### **Test database connection**

```bash
curl http://localhost:8000/test-db
```

### **Test recommendation**

```bash
curl "http://localhost:8000/api/recommendations/user/25?top_n=5"
```

### **Interactive API docs**

```
http://localhost:8000/docs
```

---

## 🐛 Troubleshooting

### **Lỗi: Qdrant connection refused**

```bash
# Kiểm tra Qdrant đang chạy
docker ps | grep qdrant

# Restart Qdrant
docker restart qdrant

# Hoặc run mới
docker run -d -p 6333:6333 qdrant/qdrant
```

### **Lỗi: Database connection failed**

- Kiểm tra MySQL đang chạy
- Kiểm tra DATABASE_URL trong .env
- Kiểm tra credentials

### **Lỗi: No recommendations**

1. Kiểm tra user_id có data trong database
2. Train models: `POST /api/recommendations/train`
3. Kiểm tra logs

### **Performance issues**

- Tăng top_n khi query để cache hiệu quả hơn
- Add database indexes
- Kiểm tra Qdrant memory usage
- Consider model caching

---

## 📈 Monitoring & Logging

### **Check logs**

```bash
# Docker logs
docker logs -f qdrant

# Application logs
# Kiểm tra console output
```

### **Monitor Qdrant**

```bash
# Health check
curl http://localhost:6333/health

# Collections info
curl http://localhost:6333/collections
```

---

## 🔄 Model Training Schedule

Khuyến cáo huấn luyện lại models hàng ngày:

```bash
# Cron job ở 2:00 AM
0 2 * * * curl -X POST "http://localhost:8000/api/recommendations/train"
```

---

## 📝 Project Structure

```
recommendation-service/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app
│   ├── api/
│   │   ├── __init__.py
│   │   ├── recommendations.py  # Recommendation endpoints
│   │   └── books.py            # Books endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py           # Config & settings
│   ├── data_access/
│   │   ├── __init__.py
│   │   └── database.py         # Database queries
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py          # Pydantic schemas
│   ├── services/
│   │   ├── __init__.py
│   │   ├── collaborative_engine.py  # Collaborative filtering
│   │   ├── content_engine.py        # Content-based filtering
│   │   └── hybrid_engine.py         # Hybrid recommender
│   └── utils/
│       ├── __init__.py
│       ├── stop_words.py
│       ├── stop_words.txt
│       └── text_processing.py
├── requirements.txt
├── .env.example
├── API_DOCUMENTATION.md
└── README.md
```

---

## 🎓 Công nghệ sử dụng

| Công nghệ        | Mục đích                | Phiên bản |
| ---------------- | ----------------------- | --------- |
| **FastAPI**      | Web framework           | 0.104+    |
| **SQLAlchemy**   | ORM                     | 2.0+      |
| **Qdrant**       | Vector DB               | 2.7+      |
| **Scikit-learn** | ML algorithms           | 1.3+      |
| **NumPy/Pandas** | Data processing         | Latest    |
| **PyVi**         | Vietnamese tokenization | 0.1+      |

---

## 📄 License

MIT License

---

## 👥 Contributor

- Development Team
- KaTiLa Project

---

## 📞 Support

- **API Docs**: http://localhost:8000/docs
- **OpenAPI Schema**: http://localhost:8000/openapi.json
- **Health Check**: http://localhost:8000/health

Xem chi tiết: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
