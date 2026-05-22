# 📋 Kế Hoạch Khắc Phục Địa Chỉ - Tóm Tắt Thực Hiện

**Ngày:** 22/05/2026  
**Status:** 🔵 READY FOR REVIEW  
**Priority:** 🔴 HIGH

---

## 🎯 Mục Đích

Đồng bộ hóa dữ liệu địa chỉ trong database với định dạng chuẩn từ **API GHN (GiaoHangNhanh)** để:
- ✅ Hỗ trợ tính năng giao hàng
- ✅ Validation địa chỉ chính xác
- ✅ Tránh lỗi khi gọi GHN API

---

## 📊 Vấn Đề Được Xác Định

### **1. Province (Tỉnh/Thành phố)**
- ❌ **Hiện tại:** "Thành phố Hồ Chí Minh", "Thành phố Hà Nội" (thêm prefix không cần)
- ✅ **Chuẩn GHN:** "Hồ Chí Minh", "Hà Nội"
- 📝 **Giải pháp:** Xóa prefix "Thành phố", thêm `province_id` từ GHN

### **2. District (Quận/Huyện)**
- ❌ **Hiện tại:** Hỗn hợp "Quận 1", "Quận Tân Bình", "Phường 3" (nhầm lẫn)
- ✅ **Chuẩn GHN:** Luôn "Quận X" hoặc "Huyện X"
- 📝 **Giải pháp:** Verify với GHN API, thêm `district_id`

### **3. Ward (Phường/Xã)**
- ❌ **Hiện tại:** Lúc "Bến Thành" (thiếu "Phường"), lúc "Phường 3" (đầy đủ)
- ✅ **Chuẩn GHN:** Luôn bao gồm "Phường X" hoặc "Xã X"
- 📝 **Giải pháp:** Thêm "Phường/Xã", thêm `ward_code` từ GHN

---

## 📁 File Đã Tạo (4 file)

| # | File | Mục Đích |
|---|------|---------|
| 1 | `ADDRESS_STANDARDIZATION_PLAN.md` | 📋 Kế hoạch chi tiết (5 phase) |
| 2 | `ADDRESS_COMPARISON_AND_FIX.md` | 📊 So sánh đầy đủ + danh sách sửa |
| 3 | `migration_address_standardization.sql` | 🔧 Script SQL sẵn sàng chạy |
| 4 | `ADDRESS_IMPLEMENTATION_SUMMARY.md` | 📝 File này - tóm tắt |

---

## 🚀 Kế Hoạch 5 Phase

### **Phase 1: Khảng Định (2-3 giờ)** 🔵
**Mục tiêu:** Xác định đúng ID từ GHN API

**Tasks:**
- [ ] Lấy danh sách Province từ GHN API
- [ ] Lấy danh sách District từ GHN API
- [ ] Lấy danh sách Ward từ GHN API
- [ ] Lập bảng mapping GHN ID ↔ Tên hiện tại

**Output:** Bảng mapping hoàn chỉnh (xem file `ADDRESS_COMPARISON_AND_FIX.md`)

---

### **Phase 2: Thiết Kế (1-2 giờ)** 🔵
**Mục tiêu:** Thiết kế schema mới

**Tasks:**
- [x] Phân tích schema hiện tại
- [x] Lên kế hoạch thêm cột: `province_id`, `district_id`, `ward_code`
- [x] Quyết định: Tạo bảng `ghn_provinces`, `ghn_districts`, `ghn_wards`?
  - **Khuyến nghị:** NÊN tạo (để cache + validate)
  - **Optional:** Nếu chỉ lưu ID cũng được

**Output:** Schema được phê duyệt

---

### **Phase 3: Migration (3-5 giờ)** 🟡
**Mục tiêu:** Chạy migration, chuẩn hóa dữ liệu

**Tasks:**
- [ ] Backup database
- [ ] Chạy script `migration_address_standardization.sql`
- [ ] Verify dữ liệu được sửa đúng
- [ ] Xử lý những địa chỉ không match GHN API

**Output:** Database với dữ liệu chuẩn + 3 cột ID mới

**Script sẵn sàng:** `migration_address_standardization.sql` ✅

---

### **Phase 4: Code Implementation (3-5 giờ)** 🟡
**Mục tiêu:** Viết code để validate/sync dữ liệu

**Tasks:**
- [ ] Tạo `AddressService` với methods:
  - `validateAddress()` - Kiểm tra với GHN API
  - `syncGHNData()` - Cập nhật bảng `ghn_*` từ API
  - `standardizeAddress()` - Auto-correct địa chỉ

- [ ] Tạo bảng `ghn_provinces`, `ghn_districts`, `ghn_wards`
- [ ] Tạo scheduled job để sync dữ liệu định kỳ

**Output:** Code sẵn sàng deploy

---

### **Phase 5: Testing & Deployment (2-3 giờ)** 🟡
**Mục tiêu:** Test, review, deploy

**Tasks:**
- [ ] Unit test validation logic
- [ ] Integration test với GHN API
- [ ] Test trên staging environment
- [ ] Code review
- [ ] Deploy lên production

**Output:** Feature hoạt động, các lỗi địa chỉ được sửa

---

## 💻 Bước Thực Hiện Sắp Tới

### **Bước 1: GHN API Response** ⏳ CHỜ BẠN CUNG CẤP
**Bạn cần:**
```json
// Response từ GHN Get Province API
[
  {
    "ProvinceID": 1,
    "ProvinceName": "Hồ Chí Minh"
  },
  {
    "ProvinceID": 2,
    "ProvinceName": "Hà Nội"
  }
]

// Response từ GHN Get District API
[
  {
    "DistrictID": 1,
    "DistrictName": "Quận 1",
    "ProvinceID": 1
  },
  {
    "DistrictID": 4,
    "DistrictName": "Quận 4",
    "ProvinceID": 1
  }
]

// Response từ GHN Get Ward API
[
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
```

### **Bước 2: Xác Nhận Kế Hoạch** ⏳ CHỜ REVIEW
- Bạn xem lại file `ADDRESS_STANDARDIZATION_PLAN.md`
- Bạn chọn Option A (minimal) hay Option B (comprehensive)
- Bạn xác nhận timeline

### **Bước 3: Chạy Migration** (Khi sẵn sàng)
```bash
# 1. Backup
mysqldump -u user -p db_bookstore > backup_addresses.sql

# 2. Chạy migration
mysql -u user -p db_bookstore < migration_address_standardization.sql

# 3. Verify
SELECT COUNT(*) FROM addresses WHERE province_id IS NOT NULL;
```

### **Bước 4: Cập Nhật Seed File** (Sau migration)
- Update `seed_db_bookstore_v2_vietnamese.sql` với dữ liệu chuẩn
- Ghi lại ProvinceID, DistrictID, WardCode

### **Bước 5: Viết Code** (Phía backend)
- Tạo `AddressService` với validation logic
- Tạo endpoint để sync dữ liệu từ GHN

---

## 📈 Timeline Dự Kiến

| Phase | Tasks | Duration | Status |
|-------|-------|----------|--------|
| 1 | Khảng định GHN API | 2-3h | ⏳ Chờ |
| 2 | Thiết kế schema | 1-2h | ✅ Hoàn thành |
| 3 | Migration + script | 3-5h | ⏳ Chờ approval |
| 4 | Code implementation | 3-5h | ⏳ Chờ |
| 5 | Testing + deployment | 2-3h | ⏳ Chờ |
| **TOTAL** | | **12-18h** | ⏳ |

---

## 🔗 GHN API Endpoints (Tham khảo)

```
GET /api/v2/location/province
GET /api/v2/location/district?province_id={id}
GET /api/v2/location/ward?district_id={id}
```

**Header cần thiết:**
```
Authorization: Bearer {token}
shopid: {shop_id}
```

---

## 📝 Danh Sách Kiểm Tra

### **Trước Migration:**
- [ ] Backup database
- [ ] Xác nhận GHN API ID mapping
- [ ] Test migration script trên dev
- [ ] Có rollback plan

### **Sau Migration:**
- [ ] Verify 24/24 addresses có province_id, district_id, ward_code
- [ ] Kiểm tra tên province/district/ward chuẩn
- [ ] Test API GHN validation
- [ ] Update seed file SQL
- [ ] Code review

---

## 🛠️ Công Cụ Cần Thiết

| Công Cụ | Mục Đích |
|---------|---------|
| MySQL Client | Chạy migration script |
| DBeaver/Workbench | Verify dữ liệu |
| Postman/cURL | Test GHN API |
| Git | Version control |

---

## 📚 Tài Liệu Tham Khảo

1. **GHN API Documentation** → Xem thêm ProvinceID, DistrictID, WardCode
2. **File này** → Tóm tắt kế hoạch
3. `ADDRESS_STANDARDIZATION_PLAN.md` → Kế hoạch chi tiết
4. `ADDRESS_COMPARISON_AND_FIX.md` → So sánh + danh sách sửa
5. `migration_address_standardization.sql` → Script SQL

---

## ❓ FAQ

**Q1: Có cần cập nhật seed file SQL?**
- ✅ Có, để dữ liệu nhất quán

**Q2: Có cần thay đổi API response?**
- ✅ Có, thêm `province_id`, `district_id`, `ward_code` vào `GetAddressResponse`

**Q3: Có cần tạo bảng `ghn_*`?**
- 🤔 Optional, nhưng khuyến nghị (để cache + validate nhanh)

**Q4: Có cần notify user?**
- ❌ Không, chỉ cập nhật database nội bộ

**Q5: Có cần test gì sau migration?**
- ✅ Validate địa chỉ với GHN API, test tất cả endpoint liên quan

---

## 🎯 Kết Luận

**Status:** ✅ Kế hoạch hoàn thành, sẵn sàng thực hiện

**Tiếp theo:** 
1. Bạn cung cấp GHN API response
2. Tôi cập nhật migration script với ID thực tế
3. Chạy migration + code implementation
4. Deploy + test

---

**Prepared by:** GitHub Copilot  
**Date:** 22/05/2026  
**Version:** 1.0

