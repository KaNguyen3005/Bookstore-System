# SQL Database Improvements - Summary

## Ngày: 22/05/2026
## File được cập nhật:
- `src/main/resources/seed_db_bookstore_v2_vietnamese.sql`
- `src/main/resources/init.sql`

---

## 🔧 Các Cải Thiện Thực Hiện

### 1. **Bổ Sung Dữ Liệu Đơn Hàng (Orders & Book_Order)**

#### Vấn đề:
- Các đơn hàng sinh ra luôn có thời gian là `NOW()` (hiện tại)
- Một số đơn hàng rỗng không có chi tiết sản phẩm (`book_order` trống)

#### Giải pháp:
✅ **Phân bố thời gian đều từ tháng 1 - tháng 5 năm 2025:**
- Tháng 1/2025: 5 đơn hàng
- Tháng 2/2025: 4 đơn hàng
- Tháng 3/2025: 5 đơn hàng
- Tháng 4/2025: 4 đơn hàng
- Tháng 5/2025: 2 đơn hàng
- **Tổng: 20 đơn hàng**

✅ **Bổ sung dữ liệu sách cho MỌI đơn hàng:**
- Mỗi đơn hàng được gán 1-3 sách tương ứng
- Chi tiết đơn hàng (`book_order`): 26 records
- Đảm bảo không có đơn hàng rỗng

**Ví dụ thời gian:**
```sql
-- Tháng 1
(1, 'PENDING', 0.05, 12, '2025-01-05 10:30:00'),
(2, 'CONFIRMED', 0.05, 13, '2025-01-08 14:15:00'),
...
-- Tháng 5
(19, 'PENDING', 0.05, 16, '2025-05-08 11:30:00'),
(20, 'CONFIRMED', 0.05, 17, '2025-05-20 14:45:00'),
```

---

### 2. **Chuẩn Hóa Trạng Thái Thanh Toán (Payment Status)**

#### Vấn đề:
- Trạng thái thanh toán không đồng nhất:
  - Lúc `'SUCCESS'` (string)
  - Lúc `'Đang chờ'` (tiếng Việt)
  - Không tuân theo ENUM của DB

#### Giải pháp:
✅ **Chuẩn hóa dùng ENUM từ database:**
- `PENDING` - Chờ thanh toán
- `SUCCESS` - Thanh toán thành công
- `FAILED` - Thanh toán thất bại (reserved)
- `CANCELLED` - Thanh toán bị hủy (reserved)

✅ **Phân bố trạng thái thanh toán hợp lý:**
- PENDING: ~35% (7/20) - các đơn hàng mới
- SUCCESS: ~65% (13/20) - các đơn hàng cũ hơn

✅ **Phân bố phương thức thanh toán đa dạng:**
```sql
-- Trước: Tất cả dùng 'COD'
-- Sau: Phân bố các phương thức
(1,  6000000, 'COD', 'PENDING', 1, '2025-01-05 10:30:00'),
(2,  5500000, 'COD', 'SUCCESS', 2, '2025-01-08 14:15:00'),
(7,  8200000, 'MOMO', 'SUCCESS', 7, '2025-02-10 10:45:00'),
(8,  6500000, 'VNPAY', 'SUCCESS', 8, '2025-02-15 15:20:00'),
(14, 10200000, 'ZALOPAY', 'SUCCESS', 14, '2025-03-28 10:30:00'),
```

---

### 3. **Thêm Trigger - Không Cho Phép Đơn Hàng Rỗng**

#### Vấn đề:
- Hệ thống không có cơ chế ngăn chặn đơn hàng rỗng
- Có thể xóa tất cả sản phẩm khỏi đơn hàng

#### Giải pháp:
✅ **Tạo trigger `check_order_not_empty`:**
```sql
CREATE TRIGGER check_order_not_empty BEFORE DELETE ON book_order
FOR EACH ROW
BEGIN
    DECLARE book_count INT;
    SELECT COUNT(*) INTO book_count FROM book_order 
    WHERE order_id = OLD.order_id AND book_order_id != OLD.book_order_id;
    
    IF book_count = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Không thể xóa chi tiết đơn hàng cuối cùng. 
                            Đơn hàng phải có ít nhất 1 sách.';
    END IF;
END$$
```

**Cách hoạt động:**
- Trước khi xóa một `book_order`, trigger kiểm tra
- Nếu đây là sản phẩm cuối cùng của đơn hàng → từ chối xóa
- Nếu còn sản phẩm khác → cho phép xóa

---

### 4. **Cập Nhật Dữ Liệu Tương Tác (Interact Events)**

#### Cải thiện:
✅ **Phân bố thời gian phù hợp:**
- Sự kiện VIEW xảy ra trước khi đặt hàng 1-2 ngày
- Sự kiện ADD_CART xảy ra cùng ngày đặt hàng
- Sự kiện PURCHASE xảy ra lúc tạo đơn hàng

**Ví dụ:**
```sql
-- Order tạo lúc 2025-01-05 10:30:00
(1, 'VIEW', 1, 1, 12, '2025-01-04 09:00:00'),      -- 1 ngày trước
(2, 'ADD_CART', 3, 1, 12, '2025-01-05 10:00:00'),  -- 30 phút trước
(3, 'PURCHASE', 8, 1, 12, '2025-01-05 10:30:00'),  -- Cùng lúc
```

---

## 📊 Thống Kê Dữ Liệu Sau Cập Nhật

| Thực thể | Số lượng | Ghi chú |
|---------|---------|--------|
| Orders | 20 | Phân bố đều tháng 1-5/2025 |
| Book_Order | 26 | Mỗi order có 1-3 sách |
| Payments | 20 | 65% SUCCESS, 35% PENDING |
| Shipments | 20 | Phân bố theo orders |
| Interact_Events | 39 | Bao gồm VIEW, ADD_CART, PURCHASE |

---

## 🔍 Kiểm Tra Dữ Liệu

### Queries để xác minh:
```sql
-- 1. Kiểm tra các đơn hàng rỗng (không nên có kết quả)
SELECT o.order_id, COUNT(bo.book_order_id) as item_count
FROM orders o
LEFT JOIN book_order bo ON o.order_id = bo.order_id AND bo.deleted_at IS NULL
GROUP BY o.order_id
HAVING item_count = 0;

-- 2. Phân bố đơn hàng theo tháng
SELECT MONTH(created_at) as month, YEAR(created_at) as year, COUNT(*) as count
FROM orders
WHERE YEAR(created_at) = 2025
GROUP BY MONTH(created_at)
ORDER BY MONTH(created_at);

-- 3. Thống kê trạng thái thanh toán
SELECT status, COUNT(*) as count
FROM payments
GROUP BY status;

-- 4. Kiểm tra phương thức thanh toán
SELECT method, COUNT(*) as count
FROM payments
GROUP BY method;

-- 5. Kiểm tra trigger (cố gắng xóa sách cuối cùng)
DELETE FROM book_order WHERE order_id = 1 AND book_order_id IN (
    SELECT MAX(book_order_id) FROM book_order WHERE order_id = 1
);
-- Sẽ có lỗi: Không thể xóa chi tiết đơn hàng cuối cùng...
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Trigger chỉ kiểm tra DELETE:**
   - Nếu muốn kiểm tra INSERT (không cho phép tạo order rỗng), cần trigger INSERT/UPDATE trên `orders`

2. **Trạng thái Order vs Payment:**
   - Order status: PENDING, CONFIRMED, SHIPPING, DELIVERED, COMPLETED, CANCELLED
   - Payment status: PENDING, SUCCESS, FAILED, CANCELLED
   - Cần cơ chế đồng bộ giữa hai bảng

3. **Dữ liệu được seed đã được tối ưu:**
   - Không dùng `NOW()` - dùng thời gian cụ thể
   - Không có order rỗng
   - Trạng thái thanh toán chuẩn hóa

---

## 📝 Hướng Tương Lai

1. **Thêm constraint NOT NULL:**
   ```sql
   ALTER TABLE orders ADD CONSTRAINT check_order_has_items 
   FOREIGN KEY (...) REFERENCES book_order(...);
   ```

2. **Thêm trigger INSERT:**
   - Kiểm tra không tạo order mà không có items từ đầu

3. **Procedure để tạo order:**
   - Bắt buộc phải có ít nhất 1 item khi tạo

---

**Cập nhật bởi:** System  
**Ngày cập nhật:** 22/05/2026

