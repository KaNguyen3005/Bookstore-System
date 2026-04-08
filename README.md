# Bookstore Backend API

Ứng dụng backend cho hệ thống quản lý và bán sách trực tuyến, được xây dựng bằng Spring Boot và PostgreSQL.

## 📋 Thông Tin Dự Án

**Loại dự án:** Đồ án môn Thực tập Cơ sở  
**Trường:** Học Viện Công Nghệ Bưu Chính Viễn Thông - Cơ Sở HCM

### 👥 Thông Tin Sinh Viên

| Tên | MSSV | Lớp |
|-----|------|-----|
| Mô Ha Mách Bu Ba Ka | N23DCCN164 | D23CQCN03-N |

### 🎓 Giảng Viên Hướng Dẫn

- **Nguyễn Thị Tuyết Hải**

---

## 🚀 Công Nghệ Sử Dụng

### Backend Framework
- **Spring Boot 3.x** - Web framework
- **Spring Security** - Authentication & Authorization (JWT)
- **Spring Data JPA** - ORM & Database access
- **MapStruct** - Object mapping

### Database
- **PostgreSQL** - Relational database
- **Hibernate** - JPA implementation

### Tools & Libraries
- **Lombok** - Reduce boilerplate code
- **Swagger/OpenAPI** - API documentation
- **Cloudinary** - Image storage
- **Validation** - Bean validation

### Build & Deployment
- **Maven** - Dependency management
- **Docker** - Containerization

---

## 📦 Yêu Cầu Hệ Thống

### Yêu cầu tối thiểu
- Java 17 hoặc cao hơn
- Maven 3.6+
- PostgreSQL 12+
- Git

### Yêu cầu bổ sung (tùy chọn)
- Docker & Docker Compose
- IDE: IntelliJ IDEA / VS Code / Eclipse

---

## 🔧 Cài Đặt & Cấu Hình

### 1. Clone Repository

```bash
git clone <repository-url>
cd bookstore
```

### 2. Cấu Hình Database

**Tạo database:**
```sql
CREATE DATABASE bookstore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Tạo user (tùy chọn):**
```sql
CREATE USER 'bookstore_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON bookstore_db.* TO 'bookstore_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Cấu Hình Application

**File: `src/main/resources/application.yaml`**

```yaml
spring:
  application:
    name: bookstore
  
  datasource:
    url: jdbc:postgresql://localhost:5432/bookstore_db
    username: your_username
    password: your_password
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  security:
    jwt:
      secret: your-secret-key-min-32-characters-long
      expiration: 86400000  # 24 hours in milliseconds
      refreshExpiration: 604800000  # 7 days

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

server:
  port: 8080
  servlet:
    context-path: /
```

### 4. Cấu Hình Environment (Tùy chọn)

Tạo file `.env` trong thư mục root:
```
DB_URL=jdbc:postgresql://localhost:5432/bookstore_db
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-min-32-characters-long
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
VNPAY_TMNCODE=your_tmncode
VNPAY_HASHSECRET=your_hash_secret
```

---

## ▶️ Chạy Ứng Dụng

### Development Mode

```bash
# Build project
mvn clean install

# Run application
mvn spring-boot:run
```

### Using Maven Wrapper

```bash
./mvnw spring-boot:run
```

### Using Docker

```bash
# Build Docker image
docker build -t bookstore-api .

# Run container
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://postgres:5432/bookstore_db \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=password \
  bookstore-api
```

### Using Docker Compose

```bash
docker-compose up -d
```

---

## 📚 API Documentation

### Swagger UI

Khi ứng dụng chạy, truy cập Swagger UI tại:
```
http://localhost:8080/swagger-ui.html
```

### API Base URL
```
http://localhost:8080/api/v1
```

### Các Endpoint Chính

#### 📖 Books
- `GET /books` - Lấy danh sách sách (có phân trang)
- `GET /books/{id}` - Lấy chi tiết sách
- `GET /books/search?keyword=...&category=...&min_price=...&max_price=...&sort=asc` - Tìm kiếm sách
- `POST /books` - Tạo sách (Admin)
- `PUT /books/{id}` - Cập nhật sách (Admin)
- `DELETE /books/{id}` - Xóa sách (Admin)

#### 👤 Authentication
- `POST /auth/register` - Đăng ký tài khoản mới
- `POST /auth/login` - Đăng nhập
- `POST /auth/refresh` - Làm mới token
- `POST /auth/logout` - Đăng xuất

#### 🛒 Cart
- `GET /carts/items` - Lấy tất cả items trong giỏ
- `POST /carts/items/{bookId}` - Thêm sách vào giỏ
- `PATCH /carts/items/{bookCartId}` - Cập nhật số lượng
- `DELETE /carts/items/{bookCartId}` - Xóa item khỏi giỏ

#### 📦 Orders
- `GET /orders` - Lấy danh sách đơn hàng
- `POST /orders` - Tạo đơn hàng mới
- `GET /orders/{orderId}` - Lấy chi tiết đơn hàng
- `PATCH /orders/{orderId}/status` - Cập nhật trạng thái đơn hàng (Admin)
- `POST /orders/{orderId}/cancel` - Hủy đơn hàng

#### 💳 Payment
- `POST /payments/checkout` - Tạo phiên thanh toán
- `POST /payments/confirm` - Xác nhận thanh toán
- `GET /payments/{paymentId}` - Lấy chi tiết thanh toán

#### 📮 Address
- `GET /addresses` - Lấy danh sách địa chỉ
- `POST /addresses` - Tạo địa chỉ mới
- `PUT /addresses/{id}` - Cập nhật địa chỉ
- `DELETE /addresses/{id}` - Xóa địa chỉ

#### 🎁 Voucher
- `GET /vouchers` - Lấy danh sách voucher (Admin)
- `POST /vouchers` - Tạo voucher (Admin)
- `GET /vouchers/{id}` - Lấy chi tiết voucher
- `PUT /vouchers/{id}` - Cập nhật voucher (Admin)
- `DELETE /vouchers/{id}` - Xóa voucher (Admin)

#### ⭐ Review
- `POST /reviews` - Tạo đánh giá
- `GET /reviews/book/{bookId}` - Lấy đánh giá sách
- `PUT /reviews/{id}` - Cập nhật đánh giá
- `DELETE /reviews/{id}` - Xóa đánh giá

---

## 📁 Cấu Trúc Dự Án

```
bookstore/
├── src/
│   ├── main/
│   │   ├── java/ptithcm/backend/bookstore/
│   │   │   ├── controller/           # REST Controllers
│   │   │   ├── service/              # Business logic
│   │   │   ├── repository/           # Data access layer
│   │   │   ├── entity/               # JPA Entities
│   │   │   ├── dto/
│   │   │   │   ├── request/          # Request DTOs
│   │   │   │   └── response/         # Response DTOs
│   │   │   ├── mapper/               # MapStruct mappers
│   │   │   ├── exception/            # Custom exceptions
│   │   │   ├── enums/                # Enumerations
│   │   │   ├── validator/            # Custom validators
│   │   │   ├── configuration/        # Spring configurations
│   │   │   └── utils/                # Utility classes
│   │   └── resources/
│   │       ├── application.yaml      # Main configuration
│   │       ├── application-dev.yaml  # Development config
│   │       └── static/               # Static resources
│   └── test/
│       └── java/                     # Unit tests
├── pom.xml                           # Maven configuration
├── Dockerfile                        # Docker configuration
├── docker-compose.yml                # Docker Compose
├── swagger.yaml                      # OpenAPI specification
├── README.md                         # This file
└── .gitignore
```

---

## 🎯 Các Tính Năng Chính

### ✅ Authentication & Authorization
- Đăng ký / Đăng nhập với JWT
- Phân quyền dựa trên Role (User, Admin)
- Refresh token mechanism
- Logout functionality

### 📖 Quản Lý Sách
- CRUD sách
- Tìm kiếm nâng cao (theo tiêu đề, tác giả, danh mục, giá)
- Sắp xếp theo giá (tăng/giảm)
- Đánh giá & bình luận sách

### 🛒 Giỏ Hàng
- Thêm/xóa sách vào giỏ
- Cập nhật số lượng
- Lưu trữ giỏ hàng theo user

### 📦 Đơn Hàng
- Tạo đơn hàng từ giỏ hàng
- Tracking trạng thái đơn hàng
- Hủy đơn hàng
- Xem lịch sử đơn hàng

### 💳 Thanh Toán
- Hỗ trợ nhiều phương thức:
  - COD (Thanh toán khi nhận hàng)
  - VNPay
  - Momo
  - ZaloPay
- Tracking trạng thái thanh toán

### 🎁 Voucher & Khuyến Mãi
- Tạo mã voucher
- Hỗ trợ discount theo số tiền cố định hoặc phần trăm
- Giới hạn lượt sử dụng
- Giá trị đơn hàng tối thiểu
- Thời hạn voucher

### 📮 Quản Lý Địa Chỉ
- Lưu nhiều địa chỉ giao hàng
- Đặt địa chỉ mặc định
- Cập nhật/xóa địa chỉ

### ⭐ Đánh Giá & Review
- Đánh giá sách (1-5 sao)
- Viết bình luận chi tiết
- Xem đánh giá của người khác

### 👥 Quản Lý User (Admin)
- Xem danh sách users
- Khoá/mở khoá tài khoản
- Xem lịch sử mua hàng

---

## 🔐 Security

### Authentication
- JWT Token-based authentication
- Token expiration: 24 giờ
- Refresh token: 7 ngày
- HTTPS recommended cho production

### Authorization
- Role-based access control (RBAC)
- Method-level security
- Endpoint-level permissions

### Data Protection
- Password encryption (BCrypt)
- SQL Injection prevention (JPA parameterized queries)
- CORS configuration
- Input validation

---

## 🧪 Testing

### Run Unit Tests
```bash
mvn test
```

### Run Integration Tests
```bash
mvn verify
```

### Coverage Report
```bash
mvn jacoco:report
```

---

## 📝 Convention & Best Practices

### Naming Convention
- Entity class: PascalCase (User, Book, Order)
- Repository class: EntityNameRepository (UserRepository)
- Service class: EntityNameService (UserService)
- Controller class: EntityNameController (UserController)
- DTO class: EntityNameRequest/Response

### Code Style
- Sử dụng Lombok để giảm boilerplate
- Tuân thủ Java naming conventions
- Meaningful method/variable names
- Proper exception handling

### Documentation
- Javadoc cho public methods
- Inline comments cho logic phức tạp
- Clear error messages

---

## 🐛 Troubleshooting

### Database Connection Error
```
Problem: "Connection refused"
Solution: 
1. Kiểm tra PostgreSQL đang chạy
2. Kiểm tra connection string trong application.yaml
3. Kiểm tra username/password
```

### Port Already in Use
```
Problem: "Address already in use: bind"
Solution:
1. Thay đổi port trong application.yaml
2. Hoặc kill process đang sử dụng port 8080:
   - Linux/Mac: lsof -ti:8080 | xargs kill -9
   - Windows: netstat -ano | findstr :8080
```

### JWT Token Expired
```
Problem: "JWT token was either expired or invalid"
Solution:
1. Sử dụng /auth/refresh endpoint để lấy token mới
2. Hoặc đăng nhập lại
```

---

## 📞 Support & Contact

Nếu có bất kỳ câu hỏi hoặc vấn đề, vui lòng liên hệ:
- **Sinh viên:** Mô Ha Mách Bu Ba Ka (N23DCCN164)
- **Giảng viên:** Nguyễn Thị Tuyết Hải

---

## 📄 License

Dự án này được sử dụng cho mục đích học tập tại Học Viện Công Nghệ Bưu Chính Viễn Thông - Cơ Sở HCM

---

## 🙏 Ghi Nhớ

- Luôn backup database trước khi chạy migration
- Không commit sensitive data (.env files, credentials)
- Thường xuyên update dependencies
- Kiểm tra logs trong file `logs/` để debug issues
- Tham khảo Swagger UI để hiểu rõ API structure

---

## 🔄 Changelog

### Version 1.0.0 (Initial Release)
- ✅ Authentication & Authorization
- ✅ Book Management
- ✅ Shopping Cart
- ✅ Order Management
- ✅ Payment Integration
- ✅ Voucher System
- ✅ Review System
- ✅ Address Management

---

**Last Updated:** April 2026  
**Project Repository:** [Add your repository URL]

Beta
0 / 0
used queries
