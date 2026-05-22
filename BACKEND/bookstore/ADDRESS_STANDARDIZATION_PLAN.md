# Plan: Chuẩn Hóa Địa Chỉ Theo API GHN (GiaoHangNhanh)

**Ngày:** 22/05/2026  
**Mục tiêu:** Đồng bộ hóa dữ liệu địa chỉ trong database với format trả về từ API GHN

---

## 📋 Phân Tích Vấn Đề Hiện Tại

### Tình Trạng SQL Hiện Tại:
```
addresses table có 24 records
- Province: "Thành phố Hồ Chí Minh", "Thành phố Hà Nội"
- District: "Quận 1", "Quận 4", "Quận Đống Đa", "Quận Hoàn Kiếm" (hỗn hợp)
- Ward: "Bến Thành", "Đa Kao", "Phường 3", "Phường Hoàn Kiếm" (không chuẩn)
```

### Vấn Đề:
1. ❌ **Không nhất quán**: Lúc "Quận", lúc "Phường", lúc không có tên
2. ❌ **Không khớp API GHN**: 
   - GHN trả về `ProvinceName` (e.g., "Hồ Chí Minh", "Hà Nội", "Hải Phòng")
   - GHN trả về `DistrictName` (e.g., "Quận 1", "Huyện Bắc Từ Liêm")
   - GHN trả về `WardName` (e.g., "Phường Bến Thành", "Xã Đông Anh")
3. ❌ **Không có ID**: Thiếu ProvinceID, DistrictID, WardCode từ GHN
4. ❌ **Dễ nhầm lẫn**: Khó mapping khi gọi GHN API để kiểm tra tính hợp lệ

---

## 🎯 Giải Pháp Đề Xuất

### **Phase 1: Thêm Cột ID vào Bảng `addresses`**

#### 1.1 Cập Nhật Schema:
```sql
ALTER TABLE `addresses` 
ADD COLUMN `province_id` INT NULL COMMENT 'ID từ GHN API' AFTER `province`,
ADD COLUMN `district_id` INT NULL COMMENT 'ID từ GHN API' AFTER `district`,
ADD COLUMN `ward_code` VARCHAR(100) NULL COMMENT 'Code từ GHN API' AFTER `ward`;

-- Thêm index để tăng tốc độ tìm kiếm
CREATE INDEX idx_province_id ON addresses(province_id);
CREATE INDEX idx_district_id ON addresses(district_id);
CREATE INDEX idx_ward_code ON addresses(ward_code);
```

**Lợi ích:**
- ✅ Lưu trữ dữ liệu gốc từ GHN
- ✅ Dễ validate/sync lại nếu cần
- ✅ Tăng tốc độ query

---

### **Phase 2: Tạo Bảng Mapping GHN (Optional nhưng Recommended)**

#### 2.1 Bảng `ghn_provinces`:
```sql
CREATE TABLE `ghn_provinces` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ghn_province_id` INT NOT NULL UNIQUE,
  `province_name` VARCHAR(255) NOT NULL COMMENT 'Tên từ GHN',
  `province_name_display` VARCHAR(255) NULL COMMENT 'Tên hiển thị UI',
  `sync_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `ghn_districts` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ghn_district_id` INT NOT NULL,
  `ghn_province_id` INT NOT NULL,
  `district_name` VARCHAR(255) NOT NULL COMMENT 'Tên từ GHN',
  `district_name_display` VARCHAR(255) NULL COMMENT 'Tên hiển thị UI',
  `sync_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_ghn_district` (`ghn_district_id`, `ghn_province_id`),
  FOREIGN KEY (`ghn_province_id`) REFERENCES `ghn_provinces`(`ghn_province_id`)
);

CREATE TABLE `ghn_wards` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ghn_ward_code` VARCHAR(100) NOT NULL UNIQUE,
  `ghn_district_id` INT NOT NULL,
  `ward_name` VARCHAR(255) NOT NULL COMMENT 'Tên từ GHN',
  `ward_name_display` VARCHAR(255) NULL COMMENT 'Tên hiển thị UI',
  `sync_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`ghn_district_id`) REFERENCES `ghn_districts`(`ghn_district_id`)
);
```

**Lợi ích:**
- ✅ Cache dữ liệu từ GHN (giảm tải API)
- ✅ Dễ validate
- ✅ Hỗ trợ tìm kiếm autocomplete
- ✅ Lưu lịch sử sync

---

### **Phase 3: Cập Nhật Dữ Liệu SQL Seed**

#### 3.1 Danh Sách Address Hiện Tại Cần Sửa:

| ID | Tên Địa Chỉ | Province Hiện Tại | Province Chuẩn (GHN) | District Hiện Tại | District Chuẩn | Ward Hiện Tại | Ward Chuẩn |
|----|-----------|-----------------|-------------------|-----------------|--------------|-----------|-----------|
| 1-11 | TP. HCM Q1 | Thành phố Hồ Chí Minh | Hồ Chí Minh | Quận 1 | Quận 1 | Bến Thành | Phường Bến Thành |
| 12 | TP. HCM Q5 | Thành phố Hồ Chí Minh | Hồ Chí Minh | Quận 5 | Quận 5 | Phường 3 | Phường 3 |
| 13 | TP. HCM Q11 | Thành phố Hồ Chí Minh | Hồ Chí Minh | Quận 11 | Quận 11 | Phường 5 | Phường 5 |
| 14 | TP. HCM Q7 | Thành phố Hồ Chí Minh | Hồ Chí Minh | Quận 7 | Quận 7 | Tân Chí | Phường Tân Chí |
| 15 | TP. HCM Q.TB | Thành phố Hồ Chí Minh | Hồ Chí Minh | Quận Tân Bình | Quận Tân Bình | Phường 12 | Phường 12 |
| 16 | TP. HCM Q3 | Thành phố Hồ Chí Minh | Hồ Chí Minh | Quận 3 | Quận 3 | Phường 6 | Phường 6 |
| 17 | TP. HCM Q.BT | Thành phố Hồ Chí Minh | Hồ Chí Minh | Quận Bình Thạnh | Quận Bình Thạnh | Phường 25 | Phường 25 |
| 18 | TP. HCM Q.GV | Thành phố Hồ Chí Minh | Hồ Chí Minh | Quận Gò Vấp | Quận Gò Vấp | Phường 4 | Phường 4 |
| 19 | TP. HCM Q.PN | Thành phố Hồ Chí Minh | Hồ Chí Minh | Quận Phú Nhuận | Quận Phú Nhuận | Phường 6 | Phường 6 |
| 20 | TP. HCM Q8 | Thành phố Hồ Chí Minh | Hồ Chí Minh | Quận 8 | Quận 8 | Phường 3 | Phường 3 |
| 21 | TP. HCM Q11 | Thành phố Hồ Chí Minh | Hồ Chí Minh | Quận 11 | Quận 11 | Phường 1 | Phường 1 |
| 22 | Hà Nội Q.ĐD | Thành phố Hà Nội | Hà Nội | Quận Đống Đa | Quận Đống Đa | Phường 4 | Phường 4 |
| 23 | Hà Nội HK | Thành phố Hà Nội | Hà Nội | Quận Hoàn Kiếm | Quận Hoàn Kiếm | Phường Hoàn Kiếm | Phường Hoàn Kiếm |
| 24 | Hà Nội HBT | Thành phố Hà Nội | Hà Nội | Quận Hai Bà Trưng | Quận Hai Bà Trưng | Phường HBT | Phường Hai Bà Trưng |

#### 3.2 Cập Nhật Seed SQL:
- ✅ Chuẩn hóa tên Province/District/Ward
- ✅ Thêm ProvinceID, DistrictID, WardCode
- ✅ Đảm bảo tất cả đều hợp lệ theo GHN

---

### **Phase 4: Tạo Utility Functions**

#### 4.1 Java Service để validate/sync:
```java
// AddressService.java
@Service
public class AddressService {
    @Autowired
    private GHNService ghnService;
    
    // Validate address với GHN API
    public boolean validateAddress(String provinceId, String districtId, String wardCode) {
        // Gọi GHN API để kiểm tra
        return ghnService.validateAddress(provinceId, districtId, wardCode);
    }
    
    // Sync dữ liệu từ GHN
    public void syncGHNData() {
        // Tải danh sách Province, District, Ward từ GHN
        // Lưu vào bảng ghn_*
    }
    
    // Auto-correct địa chỉ
    public Address standardizeAddress(Address address) {
        // Tìm GHN ID dựa trên tên
        // Cập nhật address
        return address;
    }
}
```

---

### **Phase 5: Migration Script**

#### 5.1 Script để migrate dữ liệu hiện tại:

```sql
-- 1. Thêm cột mới
ALTER TABLE `addresses` 
ADD COLUMN `province_id` INT NULL AFTER `province`,
ADD COLUMN `district_id` INT NULL AFTER `district`,
ADD COLUMN `ward_code` VARCHAR(100) NULL AFTER `ward`;

-- 2. Tạo bảng mapping (nếu dùng)
-- (Xem Phase 2)

-- 3. Update dữ liệu hiện tại
-- Ví dụ: Hồ Chí Minh = 1 (giả định)
UPDATE addresses SET province_id = 1 WHERE province LIKE '%Hồ Chí Minh%';
UPDATE addresses SET province_id = 2 WHERE province LIKE '%Hà Nội%';

-- 4. Update District ID
UPDATE addresses SET district_id = 1 WHERE district = 'Quận 1' AND province_id = 1;
UPDATE addresses SET district_id = 4 WHERE district = 'Quận 4' AND province_id = 1;
-- ... (tiếp tục cho các district khác)

-- 5. Update Ward Code
UPDATE addresses SET ward_code = 'X001' WHERE ward = 'Phường Bến Thành';
-- ... (tiếp tục cho các ward khác)
```

---

## 🔄 Quy Trình Thực Hiện

### **Bước 1: Khảng định (2-3 giờ)**
- [ ] Liệt kê tất cả Province/District/Ward trên GHN API
- [ ] So sánh với dữ liệu SQL hiện tại
- [ ] Xác định mapping chính xác

### **Bước 2: Thiết kế (1-2 giờ)**
- [ ] Thiết kế schema mới (thêm province_id, district_id, ward_code)
- [ ] Quyết định có cần bảng ghn_provinces/ghn_districts/ghn_wards hay không
- [ ] Lập kế hoạch migration

### **Bước 3: Phát triển (3-5 giờ)**
- [ ] Viết migration script
- [ ] Viết validation logic
- [ ] Viết sync service
- [ ] Test comprehensive

### **Bước 4: Triển khai (1-2 giờ)**
- [ ] Backup database
- [ ] Chạy migration trên dev/staging
- [ ] Kiểm tra dữ liệu
- [ ] Chạy trên production

### **Bước 5: Monitoring (tuỳ vào)**
- [ ] Theo dõi lỗi
- [ ] Rollback nếu cần

---

## 💾 SQL Cần Thực Hiện

### Option A: Minimal (Chỉ thêm ID columns)
```sql
-- 1. Alter table
ALTER TABLE `addresses` 
ADD COLUMN `province_id` INT NULL COMMENT 'ID từ GHN API',
ADD COLUMN `district_id` INT NULL COMMENT 'ID từ GHN API',
ADD COLUMN `ward_code` VARCHAR(100) NULL COMMENT 'Code từ GHN API';

-- 2. Update data (cần mapping chính xác từ GHN API)
-- ... (UPDATE statements)

-- 3. Optional: Thêm constraint
ALTER TABLE `addresses`
ADD CONSTRAINT fk_ghn_mapping CHECK (
  (province_id IS NOT NULL) AND 
  (district_id IS NOT NULL) AND 
  (ward_code IS NOT NULL)
);
```

### Option B: Comprehensive (Bao gồm bảng mapping)
```sql
-- (Xem Phase 2)
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Cần GHN API Response Thực Tế**
   - Tôi cần bạn cung cấp response từ GHN API
   - Hoặc danh sách Province/District/Ward có sẵn

2. **Thử Nghiệm Đầy Đủ**
   - Validate địa chỉ trước/sau migration
   - Kiểm tra tất cả các trường hợp

3. **Backward Compatibility**
   - UI có thể vẫn hiển thị tên cũ
   - Backend dùng ID chuẩn GHN

4. **Performance**
   - Cân nhắc caching GHN data
   - Index cần thiết trên province_id, district_id, ward_code

---

## 📝 Bước Tiếp Theo

**Để tôi lập kế hoạch chi tiết hơn, tôi cần:**

1. ✅ **GHN API Response mẫu:**
   ```json
   // Province list example
   {
     "data": [
       {
         "ProvinceID": 1,
         "ProvinceName": "Hồ Chí Minh"
       }
     ]
   }
   ```

2. ✅ **Danh sách Province/District/Ward hiện tại trên GHN** (bạn có thể lấy từ GHN docs hoặc API)

3. ✅ **Xác nhận:** Có cần tạo bảng ghn_provinces/ghn_districts/ghn_wards không?

4. ✅ **Thời gian:** Bạn muốn implement Option A (minimal) hay Option B (comprehensive)?

---

**Status:** ⏳ Chờ thông tin từ bạn  
**Priority:** 🔴 HIGH (Ảnh hưởng đến tính năng giao hàng)

