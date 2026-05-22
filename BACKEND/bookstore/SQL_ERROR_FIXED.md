# ✅ LỖI TRIGGER SỬA XONG

**Ngày:** 22/05/2026  
**Status:** ✅ FIXED  
**Lỗi:** `SQLSyntaxErrorException: You have an error in your SQL syntax...DELIMITER`

---

## 📋 Vấn Đề & Giải Pháp

### **Vấn Đề:**
```
Spring initialization scripts không hỗ trợ DELIMITER statement
Trigger bị lỗi khi Spring Boot khởi động database
```

### **Giải Pháp:**
✅ **Xóa** trigger khỏi `init.sql`  
✅ **Tạo** file `triggers.sql` riêng  
✅ Chạy triggers.sql thủ công qua MySQL client

---

## 📁 File Được Thay Đổi

| File | Thay Đổi |
|------|---------|
| `init.sql` | ✅ Xóa DELIMITER + Trigger |
| `triggers.sql` | ✅ Tạo mới - Trigger riêng |

---

## 🚀 Cách Khắc Phục

### **1. Rebuild Project (Xóa lỗi):**
```bash
mvn clean install
# hoặc
./mvnw clean install
```

### **2. Chạy Triggers (After Database Created):**
```bash
# Sau khi database tạo thành công, chạy:
mysql -u root -p db_bookstore < src/main/resources/triggers.sql

# Hoặc qua MySQL client:
# mysql -u root -p
# mysql> use db_bookstore;
# mysql> source triggers.sql;
```

### **3. Verify Triggers:**
```sql
-- Kiểm tra trigger đã tạo
SHOW TRIGGERS IN db_bookstore;

-- Kết quả:
-- Trigger: check_order_not_empty
-- Event: DELETE
-- Table: book_order
```

---

## 📝 Trigger Details

**Trigger:** `check_order_not_empty`

**Khi nào chạy:**
- BEFORE DELETE ON book_order

**Chức năng:**
- Kiểm tra khi xóa chi tiết đơn hàng
- Nếu đây là chi tiết cuối cùng → từ chối xóa
- Đảm bảo mỗi order có ít nhất 1 item

**Ví dụ:**
```sql
-- Được phép: Có 3 items, xóa 1
DELETE FROM book_order WHERE book_order_id = 1 AND order_id = 1;  -- ✅ OK

-- Từ chối: Là item cuối cùng
DELETE FROM book_order WHERE book_order_id = 1 AND order_id = 1;  -- ❌ ERROR
-- Error: Không thể xóa chi tiết đơn hàng cuối cùng
```

---

## ✅ Checklist

- [x] Xóa DELIMITER khỏi init.sql
- [x] Tạo file triggers.sql riêng
- [x] Rebuild project
- [ ] Chạy triggers.sql sau database created
- [ ] Verify triggers

---

## 📚 Tài Liệu

**File:**
- `init.sql` - Main schema (no triggers)
- `triggers.sql` - Triggers (run separately)

**Cách chạy:**
```bash
# Step 1: Spring Boot initialize
mvn spring-boot:run

# Step 2: After database ready
mysql -u root -p db_bookstore < triggers.sql
```

---

## 🎉 Status

**✅ FIXED - Application sẽ start được bây giờ!**

Khi Spring khởi động:
1. ✅ init.sql chạy thành công (không có DELIMITER)
2. ✅ Database được tạo
3. ⏳ Chạy triggers.sql thủ công sau

---

**Prepared by:** GitHub Copilot  
**Date:** 22/05/2026

