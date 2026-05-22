# API Reference - Recommendation Endpoints

Tất cả các endpoint liên quan đến recommendation được expose qua backend tại base URL: `/bookstore/api/v1/recommendations`

## 📌 Endpoints

### 1️⃣ GET `/popular` - Sách phổ biến

**Mô tả**: Lấy danh sách sách phổ biến nhất trong hệ thống

**Request**:

```http
GET /bookstore/api/v1/recommendations/popular?limit=10
```

**Query Parameters**:
| Tham số | Kiểu | Mô tả | Mặc định | Bắt buộc |
|---------|------|-------|---------|----------|
| limit | int | Số lượng sách trả về | 10 | ❌ |

**Response** (200 OK):

```json
{
  "result": [
    {
      "bookId": 1,
      "title": "Python cho người mới",
      "description": "Hướng dẫn lập trình Python từ cơ bản",
      "authors": "Tác giả 1",
      "categories": "Lập trình",
      "price": 150000,
      "rating": 4.5,
      "imageUrl": "...",
      "isAvailable": true
    }
  ]
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/popular?limit=10"
```

---

### 2️⃣ GET `/users/{userId}` - Khuyến nghị cho user cụ thể

**Mô tả**: Lấy danh sách sách được khuyến nghị cho một người dùng cụ thể

**Request**:

```http
GET /bookstore/api/v1/recommendations/users/{userId}?limit=10
```

**Path Parameters**:
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| userId | long | ID của người dùng |

**Query Parameters**:
| Tham số | Kiểu | Mô tả | Mặc định |
|---------|------|-------|---------|
| limit | int | Số lượng sách khuyến nghị | 10 |

**Response** (200 OK):

```json
{
  "result": [
    {
      "bookId": 123,
      "title": "Advanced Python",
      "description": "...",
      "authors": "Tác giả",
      "categories": "Lập trình",
      "price": 200000,
      "rating": 4.8,
      "imageUrl": "...",
      "isAvailable": true
    }
  ]
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/users/25?limit=10"
```

---

### 3️⃣ GET `/books/{bookId}/similar` - Sách tương tự

**Mô tả**: Lấy danh sách sách tương tự với một sách cụ thể

**Request**:

```http
GET /bookstore/api/v1/recommendations/books/{bookId}/similar?limit=10
```

**Path Parameters**:
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| bookId | int | ID của sách |

**Query Parameters**:
| Tham số | Kiểu | Mô tả | Mặc định |
|---------|------|-------|---------|
| limit | int | Số lượng sách trả về | 10 |

**Response** (200 OK):

```json
{
  "result": [
    {
      "bookId": 456,
      "title": "Python Advanced Topics",
      "description": "...",
      "authors": "Tác giả",
      "categories": "Lập trình",
      "price": 180000,
      "rating": 4.6,
      "imageUrl": "...",
      "isAvailable": true
    }
  ]
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/books/1/similar?limit=10"
```

---

### 4️⃣ GET `/books/{bookId}/frequently-bought-together` - Sách thường mua cùng

**Mô tả**: Lấy danh sách sách thường được mua cùng với một sách cụ thể

**Request**:

```http
GET /bookstore/api/v1/recommendations/books/{bookId}/frequently-bought-together?limit=10
```

**Path Parameters**:
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| bookId | int | ID của sách |

**Query Parameters**:
| Tham số | Kiểu | Mô tả | Mặc định |
|---------|------|-------|---------|
| limit | int | Số lượng sách trả về | 10 |

**Response** (200 OK):

```json
{
  "result": [
    {
      "bookId": 789,
      "title": "Web Development",
      "description": "...",
      "authors": "Tác giả",
      "categories": "Lập trình",
      "price": 220000,
      "rating": 4.7,
      "imageUrl": "...",
      "isAvailable": true
    }
  ]
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/books/1/frequently-bought-together?limit=10"
```

---

### 5️⃣ GET `/books/{bookId}/related` - Sách liên quan

**Mô tả**: Lấy danh sách sách liên quan với một sách cụ thể (khác với similar)

**Request**:

```http
GET /bookstore/api/v1/recommendations/books/{bookId}/related?limit=10
```

**Path Parameters**:
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| bookId | int | ID của sách |

**Query Parameters**:
| Tham số | Kiểu | Mô tả | Mặc định |
|---------|------|-------|---------|
| limit | int | Số lượng sách trả về | 10 |

**Response** (200 OK):

```json
{
  "result": [
    {
      "bookId": 999,
      "title": "Data Science Basics",
      "description": "...",
      "authors": "Tác giả",
      "categories": "Khoa học dữ liệu",
      "price": 250000,
      "rating": 4.9,
      "imageUrl": "...",
      "isAvailable": true
    }
  ]
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/books/1/related?limit=10"
```

---

### 6️⃣ GET `/me/content-based` - Khuyến nghị Content-based

**Mô tả**: Khuyến nghị sách dựa trên nội dung sách mà user hiện tại đã tương tác

**⚠️ Yêu cầu xác thực**: JWT token bắt buộc

**Request**:

```http
GET /bookstore/api/v1/recommendations/me/content-based?limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters**:
| Tham số | Kiểu | Mô tả | Mặc định |
|---------|------|-------|---------|
| limit | int | Số lượng sách khuyến nghị | 10 |

**Response** (200 OK):

```json
{
  "result": [
    {
      "bookId": 111,
      "title": "Machine Learning Basics",
      "description": "...",
      "authors": "Tác giả",
      "categories": "Khoa học dữ liệu",
      "price": 300000,
      "rating": 4.8,
      "imageUrl": "...",
      "isAvailable": true
    }
  ]
}
```

**Errors**:

- 401 Unauthorized - Không có JWT token hoặc token không hợp lệ

**cURL Example**:

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/me/content-based?limit=10" \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### 7️⃣ GET `/me/collaborative` - Khuyến nghị Collaborative

**Mô tả**: Khuyến nghị sách dựa trên hành vi của những user có sở thích tương tự

**⚠️ Yêu cầu xác thực**: JWT token bắt buộc

**Request**:

```http
GET /bookstore/api/v1/recommendations/me/collaborative?limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters**:
| Tham số | Kiểu | Mô tả | Mặc định |
|---------|------|-------|---------|
| limit | int | Số lượng sách khuyến nghị | 10 |

**Response** (200 OK): Tương tự content-based

**cURL Example**:

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/me/collaborative?limit=10" \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### 8️⃣ GET `/me/hybrid` - Khuyến nghị Hybrid ⭐

**Mô tả**: Khuyến nghị sách bằng cách kết hợp cả Collaborative và Content-based (khuyến nghị nhất)

**⚠️ Yêu cầu xác thực**: JWT token bắt buộc

**Request**:

```http
GET /bookstore/api/v1/recommendations/me/hybrid?limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters**:
| Tham số | Kiểu | Mô tả | Mặc định |
|---------|------|-------|---------|
| limit | int | Số lượng sách khuyến nghị | 10 |

**Response** (200 OK): Tương tự content-based

**Hybrid Algorithm**:

```
final_score = 0.6 * collaborative_score + 0.4 * content_based_score
```

**cURL Example**:

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/me/hybrid?limit=10" \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### 9️⃣ GET `/books/search?title=...` - Tìm kiếm sách

**Mô tả**: Tìm kiếm sách theo tiêu đề từ AI Service

**Request**:

```http
GET /bookstore/api/v1/recommendations/books/search?title=Python&limit=10
```

**Query Parameters**:
| Tham số | Kiểu | Mô tả | Bắt buộc | Mặc định |
|---------|------|-------|----------|----------|
| title | string | Tiêu đề sách cần tìm | ✅ | - |
| limit | int | Số lượng kết quả tối đa | ❌ | 10 |

**Response** (200 OK):

```json
{
  "result": [
    {
      "book_id": 1,
      "title": "Python Programming",
      "authors": "Tác giả",
      "categories": "Lập trình"
    },
    {
      "book_id": 5,
      "title": "Python for Beginners",
      "authors": "Tác giả",
      "categories": "Lập trình"
    }
  ]
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/books/search?title=Python&limit=10"
```

---

### 🔟 GET `/books/{bookId}/info` - Thông tin sách

**Mô tả**: Lấy thông tin chi tiết về một sách từ AI Service

**Request**:

```http
GET /bookstore/api/v1/recommendations/books/{bookId}/info
```

**Path Parameters**:
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| bookId | int | ID của sách |

**Response** (200 OK):

```json
{
  "result": {
    "book_id": 1,
    "title": "Python Programming",
    "description": "Learn Python from basics to advanced",
    "authors": "John Doe",
    "categories": "Programming"
  }
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/books/1/info"
```

---

### 1️⃣1️⃣ POST `/train` - Huấn luyện Models

**Mô tả**: Huấn luyện lại các Collaborative và Content-based models từ dữ liệu mới

**⚠️ Cảnh báo**: Thao tác này có thể mất vài phút

**Request**:

```http
POST /bookstore/api/v1/recommendations/train
Content-Type: application/json

{
  "retrainCollaborative": true,
  "retrainContent": true
}
```

**Query Parameters**:
| Tham số | Kiểu | Mô tả | Mặc định |
|---------|------|-------|---------|
| retrainCollaborative | boolean | Có huấn luyện collaborative engine không? | true |
| retrainContent | boolean | Có huấn luyện content-based engine không? | true |

**Response** (200 OK):

```json
{
  "result": {
    "status": "success",
    "message": "✅ Collaborative engine trained\n✅ Content engine trained",
    "collaborative_trained": true,
    "content_trained": true
  }
}
```

**cURL Example**:

```bash
curl -X POST "http://localhost:8080/bookstore/api/v1/recommendations/train" \
  -H "Content-Type: application/json" \
  -d '{
    "retrainCollaborative": true,
    "retrainContent": true
  }'
```

---

### 1️⃣2️⃣ GET `/stats` - Thống kê AI Service

**Mô tả**: Lấy thống kê về các recommendation engines

**Request**:

```http
GET /bookstore/api/v1/recommendations/stats
```

**Response** (200 OK):

```json
{
  "result": {
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
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/stats"
```

---

### 1️⃣3️⃣ GET `/health` - Kiểm tra trạng thái AI Service

**Mô tả**: Kiểm tra xem recommendation service có hoạt động bình thường không

**Request**:

```http
GET /bookstore/api/v1/recommendations/health
```

**Response** (200 OK):

```json
{
  "result": {
    "status": "healthy",
    "database": "connected",
    "total_books": 5000,
    "message": "Service is operational"
  }
}
```

**Response** (503 Service Unavailable) - Khi service có vấn đề:

```json
{
  "result": {
    "status": "unhealthy",
    "database": "disconnected",
    "error": "Connection timeout",
    "message": "Service has issues"
  }
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/health"
```

---

## 🔐 Authentication

Các endpoint yêu cầu xác thực:

- `/me/content-based`
- `/me/collaborative`
- `/me/hybrid`

**Cách gửi JWT token**:

**Header**:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example**:

```bash
curl -X GET "http://localhost:8080/bookstore/api/v1/recommendations/me/hybrid" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📊 Response Format

Tất cả responses đều theo format:

```json
{
  "result": {
    /* ... */
  },
  "message": "Success",
  "statusCode": 200
}
```

## ❌ Error Handling

### 400 Bad Request

```json
{
  "message": "Invalid parameters",
  "statusCode": 400
}
```

### 401 Unauthorized

```json
{
  "message": "Missing or invalid JWT token",
  "statusCode": 401
}
```

### 404 Not Found

```json
{
  "message": "Resource not found",
  "statusCode": 404
}
```

### 500 Internal Server Error

```json
{
  "message": "Server error",
  "statusCode": 500
}
```

## 📈 Performance Tips

1. **Cache results**: Sách phổ biến thường không thay đổi, cache trong frontend
2. **Limit size**: Không request quá 100 items 1 lần
3. **Batch requests**: Nếu cần multiple recommendations, request tuần tự không parallel
4. **Train models**: Chạy train vào giờ off-peak (đêm khuya)

## 🔗 Related Documentation

- [Setup Guide](./SETUP_AI_SERVICE.md)
- [Quick Start](./QUICK_START.md)
- [Recommendation Service API](./recommendation-service/API_DOCUMENTATION.md)
- [Backend Swagger](http://localhost:8080/bookstore/swagger-ui.html)
- [Recommendation Service Docs](http://localhost:8000/docs)

---

**Last updated**: May 2026
**API Version**: 1.0
