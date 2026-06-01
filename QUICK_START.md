# 🚀 Quick Start - KaTiLa với AI Recommendation Service

## ⚡ Khởi động nhanh

### 1. Chạy toàn bộ hệ thống (lần đầu)

```bash
# Navigate đến project
cd e:\2026\ProjectWebBanSach

# Build và khởi động tất cả services
docker compose up --build
```

⏱️ Thời gian: ~3-5 phút (phụ thuộc vào tốc độ internet)

### 2. Kiểm tra services

Mở browser và truy cập:

- **Backend Swagger**: http://localhost:8080/bookstore/swagger-ui.html
- **Recommendation Service**: http://localhost:8000/docs
- **Recommendation API**: http://localhost:8000/health
- **MySQL**: localhost:3307 (username: app, password: app)

### 3. Test API cơ bản

```bash
# Sách phổ biến
curl http://localhost:8080/bookstore/api/v1/recommendations/popular?limit=5

# Sách liên quan
curl http://localhost:8080/bookstore/api/v1/recommendations/books/1/related?limit=5

# Tìm kiếm sách
curl "http://localhost:8080/bookstore/api/v1/recommendations/books/search?title=Python&limit=5"

# Health check AI Service
curl http://localhost:8000/health

# AI Service stats
curl http://localhost:8000/api/recommendations/stats
```

## 🛑 Dừng hệ thống

```bash
docker compose down
```

Để xóa tất cả volumes (database):

```bash
docker compose down -v
```

## 🔄 Khởi động lại

Nếu services đã được build, khởi động nhanh:

```bash
docker compose up
```

(không cần `--build`)

## 📋 Các thao tác thường xuyên

### Huấn luyện lại recommendation models

```bash
curl -X POST http://localhost:8080/bookstore/api/v1/recommendations/train \
  -H "Content-Type: application/json" \
  -d '{"retrainCollaborative": true, "retrainContent": true}'
```

### Xem logs của một service

```bash
# Backend
docker logs backend-dev -f

# Recommendation Service
docker logs recommendation-service-dev -f

# MySQL
docker logs mysql-dev -f

# Qdrant
docker logs qdrant-dev -f
```

### Xóa một service cụ thể

```bash
docker compose down
docker volume rm projectwebbansach_qdrant_data  # Nếu muốn
docker compose up --build -d recommendation-service
```

## 🐛 Debug

### Check kết nối giữa services

```bash
# Từ backend, ping recommendation service
docker exec backend-dev curl -X GET http://recommendation-service:8000/health

# MySQL connection test
docker exec mysql-dev mysql -u app -p'app' db_bookstore -e "SELECT COUNT(*) FROM books;"
```

### View logs chi tiết

```bash
# Backend with timestamps
docker logs backend-dev --timestamps -f

# Last 100 lines
docker logs recommendation-service-dev --tail=100 -f
```

## 📊 Monitoring

### Container stats

```bash
docker stats
```

### Database size

```bash
docker exec mysql-dev mysql -u app -p'app' db_bookstore -e "SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb FROM information_schema.tables WHERE table_schema = 'db_bookstore';"
```

## 🔑 Important Ports

| Service                | Port | URL                             |
| ---------------------- | ---- | ------------------------------- |
| MySQL                  | 3307 | -                               |
| Backend                | 8080 | http://localhost:8080/bookstore |
| Recommendation Service | 8000 | http://localhost:8000           |
| Qdrant                 | 6333 | http://localhost:6333           |

## ⚙️ Environment Variables

Nếu cần customize, edit `docker-compose.yml`:

```yaml
environment:
  RECOMMENDATION_SERVICE_URL: http://recommendation-service:8000
  COLLAB_WEIGHT: 0.6 # Collaborative filtering weight
  CONTENT_WEIGHT: 0.4 # Content-based filtering weight
```

## 📝 Một số scenarios

### Scenario 1: Database corrupted, need reset

```bash
docker compose down -v
docker compose up --build
```

### Scenario 2: Only restart backend (code change)

```bash
# Rebuild backend image
docker compose build backend

# Restart
docker compose up backend
```

### Scenario 3: Recommendation Service learning is slow

```bash
# Check if running
docker ps | grep recommendation-service

# If not, check errors
docker logs recommendation-service-dev

# Restart with more time
docker compose restart recommendation-service
```

### Scenario 4: Need to seed database with new data

```bash
# Connect to MySQL
docker exec -it mysql-dev mysql -u app -p'app' db_bookstore

# Or run SQL file
docker exec -i mysql-dev mysql -u app -p'app' db_bookstore < seed_db_bookstore_v2_extended.sql
```

## 🆘 Common Issues & Fixes

| Issue                                | Solution                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| `Connection refused: localhost:8000` | Recommendation Service not started, check logs: `docker logs recommendation-service-dev`   |
| `MySQL connection error`             | Wait 30s for MySQL to fully start, or restart: `docker compose restart mysql`              |
| `Qdrant collection not found`        | Need to run train endpoint: `curl -X POST http://localhost:8000/api/recommendations/train` |
| `Out of memory`                      | Increase Docker memory: Settings > Resources > Memory                                      |
| `Port already in use`                | Change port in docker-compose.yml or kill process using port                               |

## 📚 Full Documentation

- See [SETUP_AI_SERVICE.md](./SETUP_AI_SERVICE.md) for detailed setup
- See [recommendation-service/README.md](./recommendation-service/README.md) for AI service details
- See [recommendation-service/API_DOCUMENTATION.md](./recommendation-service/API_DOCUMENTATION.md) for API specs

---

Happy coding! 🎉
