# 🚀 Hướng Dẫn Tiếp Theo - Khắc Phục Địa Chỉ GHN

**Ngày:** 22/05/2026

---

## 📍 Bạn Đang Ở Đâu?

Tôi đã tạo **4 file kế hoạch chi tiết** để giúp bạn khắc phục vấn đề địa chỉ không khớp với GHN API.

---

## 📂 4 File Kế Hoạch

### **1️⃣ ADDRESS_STANDARDIZATION_PLAN.md**
📋 **Kế hoạch toàn diện** - Cách làm từ A-Z

**Nội dung:**
- Phân tích vấn đề chi tiết
- 5 Phase triển khai
- Schema mới (thêm `province_id`, `district_id`, `ward_code`)
- Bảng mapping GHN tùy chọn

**Khi nào xem:** Trước tiên để hiểu rõ toàn cảnh

---

### **2️⃣ ADDRESS_COMPARISON_AND_FIX.md**
📊 **So sánh chi tiết + Danh sách sửa**

**Nội dung:**
- Danh sách 24 địa chỉ - hiện tại vs. chuẩn
- Các vấn đề cụ thể (Province, District, Ward)
- Script SQL để sửa từng phần
- Bảng mapping GHN cần confirm

**Khi nào xem:** Khi muốn biết cụ thể cần sửa gì

---

### **3️⃣ migration_address_standardization.sql**
🔧 **Script SQL sẵn sàng chạy**

**Nội dung:**
- 10 STEP để chuẩn hóa dữ liệu
- Thêm cột mới
- UPDATE dữ liệu
- Verification queries

**Khi nào xem:** Khi sẵn sàng chạy migration

---

### **4️⃣ ADDRESS_IMPLEMENTATION_SUMMARY.md**
📝 **Tóm tắt thực hiện**

**Nội dung:**
- Timeline 5 phase
- Checklist từng bước
- FAQ
- Tiếp theo là gì

**Khi nào xem:** Để theo dõi tiến độ

---

## ⏭️ Bước Tiếp Theo

### **Bước 1: Xem Kế Hoạch** (15 phút)
Bạn đọc `ADDRESS_STANDARDIZATION_PLAN.md` để hiểu full picture

**Tìm:**
- 5 Phase là gì?
- Option A vs Option B?
- Timeline bao lâu?

---

### **Bước 2: Cung Cấp GHN API Response** ⏳ QUAN TRỌNG

**Tôi cần bạn cung cấp:**

Danh sách Province từ GHN:
```json
{
  "data": [
    {
      "ProvinceID": 1,
      "ProvinceName": "Hồ Chí Minh"
    },
    {
      "ProvinceID": 2,
      "ProvinceName": "Hà Nội"
    }
  ]
}
```

Danh sách District của mỗi Province:
```json
{
  "data": [
    {
      "DistrictID": 1,
      "DistrictName": "Quận 1",
      "ProvinceID": 1
    },
    {
      "DistrictID": 3,
      "DistrictName": "Quận 3",
      "ProvinceID": 1
    }
  ]
}
```

Danh sách Ward của mỗi District:
```json
{
  "data": [
    {
      "WardCode": "001",
      "WardName": "Phường Bến Thành",
      "DistrictID": 1
    },
    {
      "WardCode": "002",
      "WardName": "Phường Đa Kao",
      "DistrictID": 1
    }
  ]
}
```

**Cách lấy:**
- Gọi GHN API hoặc xem docs GHN
- Hoặc copy từ Postman/cURL collection
- Gửi cho tôi dưới dạng JSON

---

### **Bước 3: Tôi Cập Nhật Script** (Khi nhận được GHN data)
Tôi sẽ:
- ✅ Cập nhật script SQL với ID thực tế
- ✅ Verify mapping đầy đủ
- ✅ Tạo version sẵn chạy

---

### **Bước 4: Chạy Migration** (Khi bạn sẵn sàng)

**Trước tiên:**
```bash
# 1. Backup database
mysqldump -u root -p db_bookstore > backup_addresses_$(date +%Y%m%d).sql

# 2. Test script trên dev/staging trước
mysql -u root -p db_bookstore_dev < migration_address_standardization.sql
```

**Khi OK:**
```bash
# 3. Chạy trên production
mysql -u root -p db_bookstore < migration_address_standardization.sql
```

**Verify:**
```sql
-- Kiểm tra dữ liệu
SELECT COUNT(*) FROM addresses WHERE province_id IS NOT NULL;
-- Expected: 24 (tất cả)

-- Xem chi tiết
SELECT address_id, province, province_id, district, district_id, ward, ward_code
FROM addresses
LIMIT 5;
```

---

### **Bước 5: Cập Nhật Seed File** (Sau migration)

File: `seed_db_bookstore_v2_vietnamese.sql`

Update section ADDRESSES:
```sql
-- Cũ:
INSERT INTO `addresses` VALUES
(1, 'Trần Văn A', '0901123456', '123 Đường Nguyễn Huệ', 'Bến Thành', 'Quận 1', 'Thành phố Hồ Chí Minh', ...);

-- Mới:
INSERT INTO `addresses` VALUES
(1, 'Trần Văn A', '0901123456', '123 Đường Nguyễn Huệ', 'Phường Bến Thành', 'Quận 1', 'Hồ Chí Minh', ...);
-- Hoặc nếu có cột mới:
INSERT INTO `addresses` (address_id, customer_name, phone, detail_address, ward, district, province, province_id, district_id, ward_code, ...)
VALUES (1, 'Trần Văn A', '0901123456', '123 Đường Nguyễn Huệ', 'Phường Bến Thành', 'Quận 1', 'Hồ Chí Minh', 1, 1, '001', ...);
```

---

### **Bước 6: Viết Code** (Phía Backend)

**File cần tạo:**
- `AddressService.java` - validate/sync với GHN
- Tạo bảng `ghn_provinces`, `ghn_districts`, `ghn_wards` (nếu chọn Option B)

**Methods cần:**
```java
// Validate địa chỉ với GHN API
public boolean validateAddress(Integer provinceId, Integer districtId, String wardCode)

// Sync dữ liệu từ GHN API
public void syncGHNProvinces()
public void syncGHNDistricts(Integer provinceId)
public void syncGHNWards(Integer districtId)

// Auto-correct địa chỉ
public Address standardizeAddress(Address address)
```

---

### **Bước 7: Testing** ✅

**Test cases:**
1. [ ] Verify 24 addresses có đúng province_id, district_id, ward_code
2. [ ] Gọi GHN API validate cho mỗi address
3. [ ] Test sync dữ liệu từ GHN
4. [ ] Test API endpoint get address

---

### **Bước 8: Deploy** 🚀

**Checklist:**
- [ ] Code review
- [ ] Test trên staging
- [ ] Backup production
- [ ] Deploy
- [ ] Monitor lỗi

---

## 📞 Khi Có Vấn Đề

**Nếu script migration gặp lỗi:**
- Xem phần ROLLBACK PLAN trong file SQL
- Restore từ backup
- Gửi error message cho tôi

**Nếu GHN API ID khác:**
- Update bảng mapping trong `ADDRESS_COMPARISON_AND_FIX.md`
- Cập nhật script SQL
- Chạy lại

---

## 🎯 Tóm Tắt

| Bước | Task | Trách Nhiệm | Timeline |
|------|------|-----------|----------|
| 1 | Xem kế hoạch | Bạn | 15 min |
| 2 | Cung cấp GHN API | Bạn | 30 min |
| 3 | Cập nhật script | Tôi | 30 min |
| 4 | Chạy migration | Bạn | 30 min |
| 5 | Cập nhật seed file | Bạn | 30 min |
| 6 | Viết code backend | Bạn | 3-5h |
| 7 | Testing | Bạn | 1-2h |
| 8 | Deploy | Bạn | 1h |
| **TOTAL** | | | **7-9h** |

---

## 💡 Gợi Ý

1. **Bắt đầu từ file nào?**
   - → `ADDRESS_STANDARDIZATION_PLAN.md`

2. **Muốn biết cụ thể cần sửa gì?**
   - → `ADDRESS_COMPARISON_AND_FIX.md`

3. **Sẵn sàng chạy SQL?**
   - → `migration_address_standardization.sql`

4. **Cần xem lại timeline?**
   - → `ADDRESS_IMPLEMENTATION_SUMMARY.md`

---

## 🔗 Liên Kết Nhanh

```
📂 E:\2026\ProjectWebBanSach\backend\bookstore\
├── ADDRESS_STANDARDIZATION_PLAN.md          ← Bắt đầu ở đây
├── ADDRESS_COMPARISON_AND_FIX.md            ← Chi tiết cần sửa
├── migration_address_standardization.sql    ← Script SQL
├── ADDRESS_IMPLEMENTATION_SUMMARY.md        ← Tóm tắt + timeline
└── ADDRESS_NEXT_STEPS.md                   ← File này
```

---

## ✅ Status

- ✅ Kế hoạch hoàn thành
- ✅ Script sẵn sàng
- ⏳ Chờ GHN API response từ bạn
- ⏳ Chờ bạn xác nhận Phase 1

---

**Ready? Let's go! 🚀**

---

*Tạo bởi: GitHub Copilot*  
*Ngày: 22/05/2026*

