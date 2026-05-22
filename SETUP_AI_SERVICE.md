# Setup Guide - KaTiLa Project with AI Recommendation Service

Hướng dẫn cài đặt và chạy toàn bộ hệ thống KaTiLa với AI Recommendation Service.

## 📋 Giới thiệu kiến trúc

Hệ thống gồm 4 thành phần chính:

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (React/Vue)                                       │
│  - Gọi API từ Backend                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend (Spring Boot)                                      │
│  - Port: 8080                                               │
│  - Expose recommendation endpoints                          │
│  - Call Recommendation Service APIs                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
┌─────────────────────┐     ┌─────────────────────────┐
│  MySQL Database     │     │  AI Service (Python)    │
│  - Port: 3307       │     │  - Port: 8000           │
│  - db_bookstore     │     │  - FastAPI              │
└─────────────────────┘     │  - Hybrid Recommender   │
                            └──────────┬──────────────┘
                                       │
                                       ▼
                            ┌─────────────────────┐
                            │  Qdrant Vector DB   │
                            │  - Port: 6333       │
                            │  - For AI models    │
                            └─────────────────────┘
```

## 🚀 Yêu cầu hệ thống

- **Docker** (20.10+) và **Docker Compose** (2.0+)
- **RAM**: Tối thiểu 4GB (8GB+ khuyến khích)
- **CPU**: 2+ cores
- **Storage**: 10GB+ trống

## 📦 Cài đặt

### Bước 1: Clone/Navigate đến project

```bash
cd e:\2026\ProjectWebBanSach
```

### Bước 2: Tạo file environment cho Recommendation Service (tuỳ chọn)

```bash
cd recommendation-service
cp .env.example .env  # Nếu có sẵn
```

Nếu chưa có `.env.example`, tạo `.env`:

```ini
# recommendation-service/.env
DATABASE_URL=mysql+pymysql://app:app@mysql:3306/db_bookstore
QDRANT_HOST=qdrant
QDRANT_PORT=6333
COLLAB_WEIGHT=0.6
CONTENT_WEIGHT=0.4
PYTHONUNBUFFERED=1
```

### Bước 3: Build và chạy toàn bộ hệ thống với Docker Compose

```bash
# Quay lại root project
cd ..

# Build và khởi động tất cả services
docker compose up --build
```

Lệnh này sẽ:

1. Build MySQL service
2. Build Qdrant vector database
3. Build Recommendation Service (Python/FastAPI)
4. Build Backend Service (Spring Boot)
5. Khởi động tất cả services theo thứ tự dependencies

### Bước 4: Kiểm tra các services

```bash
# Kiểm tra MySQL
curl -X GET http://localhost:3307 2>/dev/null || echo "MySQL: OK (port 3307)"

# Kiểm tra Qdrant
curl -X GET http://localhost:6333/health
# Response: {"status": "ok"}

# Kiểm tra Recommendation Service
curl -X GET http://localhost:8000/health
# Response: {"status": "healthy", "database": "connected", "total_books": ...}

# Kiểm tra Backend
curl -X GET http://localhost:8080/bookstore/api/v1/recommendations/popular?limit=5
```

## 📚 API Endpoints

### Backend Recommendation Endpoints

Tất cả endpoints đều có prefix: `/api/v1/recommendations`

#### 1. **Khuyến nghị cho người dùng cụ thể**

```
GET /api/v1/recommendations/users/{userId}?limit=10
```

- Trả về recommendations dành riêng cho user
- Query params:
  - `userId`: ID người dùng
  - `limit`: Số sách trả về (default: 10)

#### 2. **Sách phổ biến**

```
GET /api/v1/recommendations/popular?limit=10
```

- Danh sách sách được xem/mua nhiều nhất

#### 3. **Sách tương tự**

```
GET /api/v1/recommendations/books/{bookId}/similar?limit=10
```

- Những sách giống với sách được chỉ định

#### 4. **Sách liên quan**

```
GET /api/v1/recommendations/books/{bookId}/related?limit=10
```

- Những sách liên quan (khác với similar)

#### 5. **Sách thường mua cùng**

```
GET /api/v1/recommendations/books/{bookId}/frequently-bought-together?limit=10
```

- Những sách thường được mua cùng với sách này

#### 6. **Khuyến nghị Content-based cho user hiện tại**

```
GET /api/v1/recommendations/me/content-based?limit=10
```

- Yêu cầu xác thực (JWT token)

#### 7. **Khuyến nghị Collaborative cho user hiện tại**

```
GET /api/v1/recommendations/me/collaborative?limit=10
```

- Yêu cầu xác thực (JWT token)

#### 8. **Khuyến nghị Hybrid cho user hiện tại**

```
GET /api/v1/recommendations/me/hybrid?limit=10
```

- Kết hợp cả 2 phương pháp (khuyến nghị nhất)
- Yêu cầu xác thực (JWT token)

#### 9. **Tìm kiếm sách theo tiêu đề**

```
GET /api/v1/recommendations/books/search?title=Python&limit=10
```

#### 10. **Lấy thông tin sách**

```
GET /api/v1/recommendations/books/{bookId}/info
```

#### 11. **Huấn luyện models**

```
POST /api/v1/recommendations/train
Query params:
  - retrainCollaborative: true/false (default: true)
  - retrainContent: true/false (default: true)
```

⚠️ **Cảnh báo**: Thao tác này có thể mất vài phút

#### 12. **Lấy thống kê**

```
GET /api/v1/recommendations/stats
```

- Thông tin về các recommendation engines

#### 13. **Kiểm tra trạng thái AI Service**

```
GET /api/v1/recommendations/health
```

## 🔌 Recommendation Service APIs (Python)

Base URL: `http://localhost:8000`

### Documentation

```
GET http://localhost:8000/docs
```

Swagger UI hiển thị tất cả endpoints

### Endpoints chính

#### Khuyến nghị sách cho user

```
GET /api/recommendations/user/{user_id}?top_n=10
```

#### Sách liên quan

```
GET /api/books/{book_id}/related?top_n=10
```

#### Tìm kiếm sách

```
GET /api/books/search/by-title?title=Python&limit=10
```

#### Huấn luyện models

```
POST /api/recommendations/train
Content-Type: application/json

{
  "retrain_collaborative": true,
  "retrain_content": true
}
```

#### Thống kê

```
GET /api/recommendations/stats
```

#### Health check

```
GET /health
```

## 🔄 Workflow

### 1. **Khi người dùng truy cập Frontend**

```
User Browser
    ↓
Frontend React/Vue
    ↓
Backend Spring Boot (Port 8080)
    ├─ Xác thực user
    ├─ Lấy thông tin từ Database
    └─ Gọi Recommendation Service (Port 8000)
         ↓
    Recommendation Service (FastAPI)
         ├─ Tính toán recommendations
         ├─ Query Qdrant (Vector DB)
         └─ Trả về results
    ↓
Backend trả về kết quả cho Frontend
    ↓
Frontend hiển thị cho User
```

### 2. **Huấn luyện Models**

Khi có dữ liệu mới hoặc muốn cập nhật models:

```bash
curl -X POST "http://localhost:8080/bookstore/api/v1/recommendations/train" \
  -H "Content-Type: application/json" \
  -d '{
    "retrainCollaborative": true,
    "retrainContent": true
  }'
```

## 📊 Ví dụ sử dụng

### 1. Lấy danh sách sách phổ biến

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/popular?limit=10"
```

**Response:**

```json
{
  "result": [
    {
      "bookId": 1,
      "title": "Python cho người mới",
      "description": "...",
      "authors": "Tác giả 1",
      "categories": "Lập trình"
    },
    ...
  ]
}
```

### 2. Khuyến nghị sách cho user (yêu cầu đăng nhập)

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/me/hybrid?limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Tìm sách liên quan

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/books/123/related?limit=10"
```

### 4. Tìm kiếm sách

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/books/search?title=Python&limit=10"
```

## 🔧 Troubleshooting

### 1. **Recommendation Service không kết nối được MySQL**

```bash
# Kiểm tra logs
docker logs recommendation-service-dev

# Kiểm tra MySQL
docker logs mysql-dev
```

**Giải pháp:**

- Đảm bảo MySQL đã khởi động xong (có thể mất vài giây)
- Kiểm tra credentials trong docker-compose.yml
- MySQL port trong container là 3306, ngoài là 3307

### 2. **Qdrant không khởi động**

```bash
docker logs qdrant-dev
```

**Giải pháp:**

- Xóa Qdrant data và restart:

```bash
docker compose down
docker volume rm projectwebbansach_qdrant_data
docker compose up --build
```

### 3. **Backend không gọi được Recommendation Service**

```bash
# Kiểm tra connection từ backend
docker exec backend-dev curl -X GET http://recommendation-service:8000/health

# Hoặc kiểm tra logs backend
docker logs backend-dev
```

**Giải pháp:**

- Đảm bảo `RECOMMENDATION_SERVICE_URL` được set trong docker-compose
- Check network trong docker-compose (`bookstore-network`)

### 4. **Recommendation Service chậm**

- Nguyên nhân: Dữ liệu nhiều, cần time để train models
- Giải pháp: Tăng RAM cho Docker, chạy train vào giờ off-peak

## 📝 File cấu hình

### Backend Configuration

**File**: `backend/bookstore/src/main/resources/application-dev.yaml`

```yaml
recommendation:
  service:
    url: ${RECOMMENDATION_SERVICE_URL:http://localhost:8000}
```

**Environment variable**: `RECOMMENDATION_SERVICE_URL`

Được set trong `docker-compose.yml`:

```yaml
environment:
  RECOMMENDATION_SERVICE_URL: http://recommendation-service:8000
```

### Recommendation Service Configuration

**File**: `recommendation-service/.env` (hoặc env vars trong docker-compose)

```ini
DATABASE_URL=mysql+pymysql://app:app@mysql:3306/db_bookstore
QDRANT_HOST=qdrant
QDRANT_PORT=6333
COLLAB_WEIGHT=0.6      # Collaborative filtering weight
CONTENT_WEIGHT=0.4     # Content-based filtering weight
```

## 🚀 Deployment

### 1. **Production Deployment**

```bash
# Set environment variables
export RECOMMENDATION_SERVICE_URL=https://api.katila.com/recommendations

# Build images
docker compose build

# Push to registry
docker push your-registry/bookstore-backend:latest
docker push your-registry/recommendation-service:latest

# Deploy
docker compose -f docker-compose.prod.yml up -d
```

### 2. **Scaling**

```bash
# Scale backend instances
docker compose up -d --scale backend=3

# Load balancer (nginx/haproxy)
# Cần setup separate
```

## 📚 Tài liệu thêm

- [Recommendation Service Docs](./recommendation-service/README.md)
- [API Documentation](./recommendation-service/API_DOCUMENTATION.md)
- [Setup Guide](./recommendation-service/SETUP.md)
- [Backend Swagger Docs](http://localhost:8080/bookstore/swagger-ui.html)
- [Recommendation Service Swagger Docs](http://localhost:8000/docs)

## ✅ Checklist

Trước khi deploy:

- [ ] Tất cả services khởi động thành công
- [ ] Database đã seed dữ liệu
- [ ] Recommendation Service health check: OK
- [ ] Backend có thể gọi Recommendation Service
- [ ] Frontend kết nối được Backend
- [ ] JWT token hoạt động
- [ ] Database backups sẵn sàng
- [ ] Logs monitoring setup
- [ ] Error tracking (Sentry, etc.) setup

## 🤝 Cần giúp?

1. Check Docker logs: `docker logs <service-name>`
2. Review README files trong từng service
3. Check API documentation tại `/docs`

---

**Last updated**: May 2026
**Version**: 1.0
