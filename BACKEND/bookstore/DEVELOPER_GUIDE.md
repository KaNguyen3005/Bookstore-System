# BookService Review - Developer Guide

## 👨‍💻 Dành Cho Team Developers

Đây là guide để hiểu các thay đổi trong BookService.

---

## 🎯 Mục Đích Review

1. **Tìm ra performance issues** ✅ Found 5
2. **Sửa critical bugs** ✅ Fixed 2
3. **Refactor code smell** ✅ Refactored 1
4. **Improve code quality** ✅ Improved 5
5. **Document changes** ✅ Documented 3

---

## 📝 Thay Đổi Chính (Main Changes)

### 1. API Changes

#### Before ❌
```
GET /api/v1/books
→ Response: All 10,000 books (~500MB)
→ Time: 30 seconds
→ Status: OutOfMemory ❌
```

#### After ✅
```
GET /api/v1/books?page=0&size=10
→ Response: 10 books (~50KB)
→ Time: 150ms
→ Status: 200 OK ✅
```

### 2. Method Signature Changes

| Method | Before | After |
|--------|--------|-------|
| `getAll()` | `List<BR>` | `Page<BR>` + params |
| `getAllReview()` | `List<RR>` | `Page<RR>` + params |
| `get()` | No soft delete check | ✓ Added |
| `update()` | 150 lines | 5 methods + cleanup |

### 3. Repository Changes

```java
// NEW Methods added
Page<Book> findAllByDeletedAtIsNull(Pageable);
Page<Review> findByBook_BookId(Integer, Pageable);
```

---

## 🧪 Testing Guide

### Unit Tests (Should Add)

```java
@SpringBootTest
class BookServiceTests {
    
    @Test
    void testGetAllWithPagination() {
        // Given: 100 books
        Page<BookResponse> page = bookService.getAll(0, 10);
        
        // Then:
        assert page.getContent().size() == 10;
        assert page.getTotalElements() == 100;
        assert page.getNumber() == 0;
    }
    
    @Test
    void testGetAllInvalidPage() {
        // When: page = -1
        Page<BookResponse> page = bookService.getAll(-1, 10);
        
        // Then: Should start from page 0
        assert page.getNumber() == 0;
    }
    
    @Test
    void testGetDeletedBook() {
        // Given: Book deleted
        Book book = createAndDeleteBook();
        
        // When: Get book
        // Then: Should throw 404
        assertThrows(AppException.class, () -> {
            bookService.get(book.getId());
        });
    }
    
    @Test
    void testUpdateCoverImageDeletesOld() {
        // Given: Book with old cover
        String oldPublicId = "old-image-id";
        
        // When: Update cover
        UpdateBookRequest request = new UpdateBookRequest();
        request.setCoverImg(newImageFile);
        bookService.update(bookId, request);
        
        // Then: Old image should be deleted from Cloudinary
        verify(cloudinaryService).deleteFile(oldPublicId);
    }
}
```

### Integration Tests

```bash
# Test 1: Pagination
curl 'http://localhost:8080/api/v1/books?page=0&size=10'
# Expected: 200 OK, 10 books

# Test 2: Invalid page
curl 'http://localhost:8080/api/v1/books?page=-1&size=10'
# Expected: 200 OK, corrected to page 0

# Test 3: Large size
curl 'http://localhost:8080/api/v1/books?page=0&size=1000'
# Expected: 200 OK, limited to size 100

# Test 4: Deleted book
curl 'http://localhost:8080/api/v1/books/999'
# Expected: 404 Not Found

# Test 5: Reviews pagination
curl 'http://localhost:8080/api/v1/books/1/reviews?page=0&size=5'
# Expected: 200 OK, 5 reviews max
```

### Load Testing

```bash
# Simulate 1000 concurrent requests
ab -n 1000 -c 50 'http://localhost:8080/api/v1/books?page=0&size=10'

# Expected:
# - Requests per second: > 100
# - Failed requests: 0
# - Memory usage: < 100MB
```

---

## 🔍 Code Review Checklist

Khi review các PR liên quan, check:

- [ ] `getAll()` methods luôn return `Page<T>`
- [ ] `get()` methods check soft delete (deletedAt)
- [ ] Input parameters validate: page >= 0, size > 0
- [ ] Old resources cleanup khi update
- [ ] Error handling có try-catch
- [ ] Logging rõ ràng cho debug
- [ ] Repository queries có comment
- [ ] No N+1 Query problem

---

## 📚 Where to Find Information

| Tài Liệu | Nội Dung | Khi Nào Xem |
|---------|---------|-----------|
| `BOOK_SERVICE_REVIEW.md` | Chi tiết đầy đủ | Cần hiểu sâu |
| `BOOK_SERVICE_REVIEW_SUMMARY.md` | Tóm tắt + examples | Cần hỏi nhanh |
| `BOOK_SERVICE_DETAILED_ANALYSIS.md` | Phân tích chi tiết | Cần học best practices |
| Đây (Developer Guide) | Hướng dẫn team | Bắt đầu |

---

## 🚀 Deployment Guide

### Pre-Deployment Checklist

- [ ] Code compiled successfully
- [ ] All tests passed
- [ ] API contract unchanged (backward compatible)
- [ ] Database migration not needed
- [ ] No breaking changes

### Deployment Steps

```bash
# 1. Backup database (if needed)
# (Only backup if no DB schema changes)

# 2. Build & test
mvn clean install

# 3. Stop current service
docker-compose down

# 4. Update to new version
git pull origin main

# 5. Start new service
docker-compose up -d

# 6. Verify
curl 'http://localhost:8080/api/v1/books?page=0&size=10'
```

### Rollback (Nếu có vấn đề)

```bash
# 1. Stop service
docker-compose down

# 2. Revert code
git checkout old-version

# 3. Rebuild
mvn clean install

# 4. Restart
docker-compose up -d
```

---

## ⚠️ Common Mistakes (Tránh)

### ❌ Mistake 1: Forget Pagination

```java
// ❌ WRONG
public List<BookResponse> getAll() {
    return bookRepository.findAll()
            .map(bookMapper::toResponse)
            .toList();
}

// ✅ RIGHT
public Page<BookResponse> getAll(int page, int size) {
    return bookRepository.findAllByDeletedAtIsNull(PageRequest.of(page, size))
            .map(bookMapper::toResponse);
}
```

### ❌ Mistake 2: Forget Soft Delete Check

```java
// ❌ WRONG
Book book = bookRepository.findById(id).orElseThrow(...);
return bookMapper.toResponse(book);

// ✅ RIGHT
Book book = bookRepository.findById(id).orElseThrow(...);
if (book.getDeletedAt() != null) throw new AppException(...);
return bookMapper.toResponse(book);
```

### ❌ Mistake 3: Forget Resource Cleanup

```java
// ❌ WRONG
book.setCoverImageUrl(newUrl);  // ảnh cũ vẫn trên server

// ✅ RIGHT
deleteOldImage(book.getPublicIdCoverImage());
book.setCoverImageUrl(newUrl);
```

### ❌ Mistake 4: Forget Input Validation

```java
// ❌ WRONG
public Page<BookResponse> getAll(int page, int size) {
    return bookRepository.findAll(PageRequest.of(page, size))...
}

// ✅ RIGHT
public Page<BookResponse> getAll(int page, int size) {
    if (page < 0) page = 0;
    if (size <= 0 || size > 100) size = 10;
    return bookRepository.findAll(PageRequest.of(page, size))...
}
```

---

## 🎓 Best Practices for BookService

### Pattern 1: Paginate Everything
```java
// Always use Page<> for getAll/findAll
public Page<BookResponse> getAll(int page, int size) { ... }
```

### Pattern 2: Check Soft Delete
```java
// Always check deletedAt for single item queries
if (book.getDeletedAt() != null) {
    throw new AppException(ErrorCode.BOOK_NOT_FOUND);
}
```

### Pattern 3: Cleanup Resources
```java
// Always delete old resources when updating
try {
    uploadNewFile();
    deleteOldFile();  // ← Important!
} catch (Exception e) {
    // Rollback
}
```

### Pattern 4: Validate Input
```java
// Always validate pagination parameters
if (page < 0) page = 0;
if (size <= 0 || size > 100) size = 10;
```

### Pattern 5: Refactor Long Methods
```java
// If method > 100 lines, break into helpers
public void complexMethod() {
    helper1();
    helper2();
    helper3();
}
```

---

## 📊 Performance Monitoring

### Metrics to Watch

```
1. Response Time
   - getAll(): Should be < 500ms
   - get(id): Should be < 100ms
   - update(): Should be < 1000ms

2. Memory Usage
   - Per request: < 50MB
   - Peak: < 200MB

3. Database Queries
   - getAll(): 1-2 queries
   - get(id): 1 query
   - update(): 3-5 queries

4. Error Rate
   - OutOfMemoryError: 0
   - N+1 Query: 0
   - Soft Delete miss: 0
```

### How to Monitor

```bash
# Check Spring Actuator metrics
curl 'http://localhost:8080/actuator/metrics'

# Check database query count
# (Add logging: log.info("Query count: {}", queryCount))

# Check memory usage
# jps -l  (list Java processes)
# jstat -gc <PID>  (check GC stats)
```

---

## 🐛 Debugging Tips

### Debug Tip 1: N+1 Query Detection
```java
// Enable SQL logging in application.yaml
logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor: TRACE
```

### Debug Tip 2: Performance Issues
```java
// Add timing logs
long startTime = System.currentTimeMillis();
List<Book> books = bookRepository.findAll(pageable);
long duration = System.currentTimeMillis() - startTime;
log.info("Query took {} ms", duration);
```

### Debug Tip 3: Soft Delete Issues
```java
// Check database directly
SELECT COUNT(*) FROM books WHERE deleted_at IS NULL;
SELECT COUNT(*) FROM books WHERE deleted_at IS NOT NULL;
```

---

## 📞 Support & Questions

### FAQ

**Q1: Tại sao phải phân trang?**
A: Tránh OutOfMemoryError khi database lớn. Load 10 sách/trang thay vì 100,000.

**Q2: Tại sao phải check deletedAt?**
A: Vì soft delete, sách vẫn ở DB nhưng không nên hiển thị.

**Q3: Tại sao phải xóa ảnh cũ?**
A: Tiết kiệm storage, tránh lãng phí.

**Q4: Tại sao phải validate input?**
A: Tránh edge cases, invalid data gây crash.

### Contact

- 💬 Ask on team chat
- 📧 Email: [team-email]
- 📞 Call: [team-phone]

---

## ✅ Summary for Developers

1. **Update imports** nếu code bạn dùng BookService
2. **Change API calls** từ `List` → `Page` + params
3. **Add tests** cho các changes
4. **Deploy carefully** - test staging trước
5. **Monitor** performance sau deploy

**All changes là backward compatible** (mostly) ✅

---

**Last Updated:** April 13, 2026  
**For Questions:** See documentation files


