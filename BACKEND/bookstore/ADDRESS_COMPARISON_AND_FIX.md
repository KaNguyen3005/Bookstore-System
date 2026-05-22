# Bảng So Sánh: Địa Chỉ SQL Hiện Tại vs. GHN Standard

**Ngày tạo:** 22/05/2026

---

## 📊 Phân Tích Chi Tiết

### **Vấn Đề 1: Tên Province Không Chuẩn**

| ID | Tên Hiện Tại | GHN Standard | Ghi Chú |
|----|-------------|-------------|--------|
| 1-21 | Thành phố Hồ Chí Minh | Hồ Chí Minh | ❌ Thêm "Thành phố" |
| 22-24 | Thành phố Hà Nội | Hà Nội | ❌ Thêm "Thành phố" |

**Nguyên nhân:** Dữ liệu seed thêm prefix "Thành phố" không cần thiết

**Giải pháp:** 
- Thay tất cả "Thành phố Hồ Chí Minh" → "Hồ Chí Minh"
- Thay tất cả "Thành phố Hà Nội" → "Hà Nội"

---

### **Vấn Đề 2: Tên District Không Chuẩn**

| Địa chỉ ID | District Hiện Tại | GHN Standard | Loại Lỗi |
|-----------|------------------|-------------|---------|
| 11 | Quận 4 | Quận 4 | ✅ OK |
| 12 | Quận 5 | Quận 5 | ✅ OK |
| 13 | Quận 11 | Quận 11 | ✅ OK |
| 14 | Quận 7 | Quận 7 | ✅ OK |
| 15 | Quận Tân Bình | Quận Tân Bình | ✅ OK |
| 16 | Quận 3 | Quận 3 | ✅ OK |
| 17 | Quận Bình Thạnh | Quận Bình Thạnh | ✅ OK |
| 18 | Quận Gò Vấp | Quận Gò Vấp | ✅ OK |
| 19 | Quận Phú Nhuận | Quận Phú Nhuận | ✅ OK |
| 20 | Quận 8 | Quận 8 | ✅ OK |
| 21 | Quận 11 | Quận 11 | ✅ OK |
| 22 | Quận Đống Đa | Quận Đống Đa | ✅ OK |
| 23 | Quận Hoàn Kiếm | Quận Hoàn Kiếm | ✅ OK |
| 24 | Quận Hai Bà Trưng | Quận Hai Bà Trưng | ✅ OK |

**Status:** ✅ Tên District hầu hết đúng, nhưng cần verify với GHN API

---

### **Vấn Đề 3: Tên Ward Không Chuẩn Nhất**

#### **TP. HCM - Quận 1:**
| ID | Ward Hiện Tại | GHN Standard | Status |
|----|-------------|-------------|--------|
| 1-10 | Bến Thành | Phường Bến Thành | ❌ Thiếu "Phường" |
| 1-10 | Đa Kao | Phường Đa Kao | ❌ Thiếu "Phường" |
| 1-10 | Nguyễn Cư Trinh | Phường Nguyễn Cư Trinh | ❌ Thiếu "Phường" |
| 1-10 | Bến Nghé | Phường Bến Nghé | ❌ Thiếu "Phường" |

#### **TP. HCM - Quận 4, 5, 7:**
| ID | Ward Hiện Tại | GHN Standard | Status |
|----|-------------|-------------|--------|
| 12 | Phường 3 | Phường 3 | ✅ OK |
| 14 | Tân Chí | Phường Tân Chí | ❌ Thiếu "Phường" |

#### **TP. HCM - Quận 5-11, Tân Bình, Bình Thạnh:**
| ID | Ward Hiện Tại | GHN Standard | Status |
|----|-------------|-------------|--------|
| 13, 15, 21 | Phường X | Phường X | ✅ OK |
| 16-20 | Phường Y | Phường Y | ✅ OK |

#### **Hà Nội:**
| ID | Ward Hiện Tại | GHN Standard | Status |
|----|-------------|-------------|--------|
| 22 | Phường 4 | Phường 4 | ✅ OK |
| 23 | Phường Hoàn Kiếm | Phường Hoàn Kiếm | ✅ OK |
| 24 | Phường Hai Bà Trưng | Phường Hai Bà Trưng | ✅ OK |

**Nguyên nhân:** Dữ liệu seed không chuẩn, lúc "Phường", lúc không

---

## 🔧 Script Sửa Lỗi

### **Step 1: Sửa Province Names**
```sql
UPDATE addresses 
SET province = 'Hồ Chí Minh' 
WHERE province = 'Thành phố Hồ Chí Minh';

UPDATE addresses 
SET province = 'Hà Nội' 
WHERE province = 'Thành phố Hà Nội';
```

### **Step 2: Sửa Ward Names (Thêm "Phường")**
```sql
-- Quận 1
UPDATE addresses 
SET ward = 'Phường Bến Thành' 
WHERE ward = 'Bến Thành' AND district = 'Quận 1' AND province = 'Hồ Chí Minh';

UPDATE addresses 
SET ward = 'Phường Đa Kao' 
WHERE ward = 'Đa Kao' AND district = 'Quận 1' AND province = 'Hồ Chí Minh';

UPDATE addresses 
SET ward = 'Phường Nguyễn Cư Trinh' 
WHERE ward = 'Nguyễn Cư Trinh' AND district = 'Quận 1' AND province = 'Hồ Chí Minh';

UPDATE addresses 
SET ward = 'Phường Bến Nghé' 
WHERE ward = 'Bến Nghé' AND district = 'Quận 1' AND province = 'Hồ Chí Minh';

-- Quận 4
UPDATE addresses 
SET ward = 'Phường Tân Định' 
WHERE ward = 'Tân Định' AND district = 'Quận 4' AND province = 'Hồ Chí Minh';

-- Quận 7
UPDATE addresses 
SET ward = 'Phường Tân Chí' 
WHERE ward = 'Tân Chí' AND district = 'Quận 7' AND province = 'Hồ Chí Minh';
```

---

## 📋 Danh Sách Đầy Đủ Địa Chỉ Cần Sửa

### **TP. HCM - Quận 1 (Address ID 1-10)**

| ID | Hiện Tại | Sửa Thành |
|----|---------|----------|
| 1 | Thành phố Hồ Chí Minh, Quận 1, Bến Thành | Hồ Chí Minh, Quận 1, Phường Bến Thành |
| 2 | Thành phố Hồ Chí Minh, Quận 1, Đa Kao | Hồ Chí Minh, Quận 1, Phường Đa Kao |
| 3 | Thành phố Hồ Chí Minh, Quận 1, Nguyễn Cư Trinh | Hồ Chí Minh, Quận 1, Phường Nguyễn Cư Trinh |
| 4 | Thành phố Hồ Chí Minh, Quận 1, Bến Nghé | Hồ Chí Minh, Quận 1, Phường Bến Nghé |
| 5 | Thành phố Hồ Chí Minh, Quận 1, Bến Thành | Hồ Chí Minh, Quận 1, Phường Bến Thành |
| 6 | Thành phố Hồ Chí Minh, Quận 1, Đa Kao | Hồ Chí Minh, Quận 1, Phường Đa Kao |
| 7 | Thành phố Hồ Chí Minh, Quận 1, Nguyễn Cư Trinh | Hồ Chí Minh, Quận 1, Phường Nguyễn Cư Trinh |
| 8 | Thành phố Hồ Chí Minh, Quận 1, Bến Nghé | Hồ Chí Minh, Quận 1, Phường Bến Nghé |
| 9 | Thành phố Hồ Chí Minh, Quận 1, Bến Thành | Hồ Chí Minh, Quận 1, Phường Bến Thành |
| 10 | Thành phố Hồ Chí Minh, Quận 1, Đa Kao | Hồ Chí Minh, Quận 1, Phường Đa Kao |

### **TP. HCM - Quận 4 (Address ID 11)**
| ID | Hiện Tại | Sửa Thành |
|----|---------|----------|
| 11 | Thành phố Hồ Chí Minh, Quận 4, Tân Định | Hồ Chí Minh, Quận 4, Phường Tân Định |

### **TP. HCM - Quận 5 (Address ID 12)**
| ID | Hiện Tại | Sửa Thành |
|----|---------|----------|
| 12 | Thành phố Hồ Chí Minh, Quận 5, Phường 3 | Hồ Chí Minh, Quận 5, Phường 3 |

### **TP. HCM - Quận 11 (Address ID 13, 21)**
| ID | Hiện Tại | Sửa Thành |
|----|---------|----------|
| 13 | Thành phố Hồ Chí Minh, Quận 11, Phường 5 | Hồ Chí Minh, Quận 11, Phường 5 |
| 21 | Thành phố Hồ Chí Minh, Quận 11, Phường 1 | Hồ Chí Minh, Quận 11, Phường 1 |

### **TP. HCM - Quận 7 (Address ID 14)**
| ID | Hiện Tại | Sửa Thành |
|----|---------|----------|
| 14 | Thành phố Hồ Chí Minh, Quận 7, Tân Chí | Hồ Chí Minh, Quận 7, Phường Tân Chí |

### **TP. HCM - Quận Tân Bình (Address ID 15)**
| ID | Hiện Tại | Sửa Thành |
|----|---------|----------|
| 15 | Thành phố Hồ Chí Minh, Quận Tân Bình, Phường 12 | Hồ Chí Minh, Quận Tân Bình, Phường 12 |

### **TP. HCM - Quận 3 (Address ID 16)**
| ID | Hiện Tại | Sửa Thành |
|----|---------|----------|
| 16 | Thành phố Hồ Chí Minh, Quận 3, Phường 6 | Hồ Chí Minh, Quận 3, Phường 6 |

### **TP. HCM - Quận Bình Thạnh (Address ID 17)**
| ID | Hiện Tại | Sửa Thành |
|----|---------|----------|
| 17 | Thành phố Hồ Chí Minh, Quận Bình Thạnh, Phường 25 | Hồ Chí Minh, Quận Bình Thạnh, Phường 25 |

### **TP. HCM - Quận Gò Vấp (Address ID 18)**
| ID | Hiện Tại | Sửa Thành |
|----|---------|----------|
| 18 | Thành phố Hồ Chí Minh, Quận Gò Vấp, Phường 4 | Hồ Chí Minh, Quận Gò Vấp, Phường 4 |

### **TP. HCM - Quận Phú Nhuận (Address ID 19)**
| ID | Hiện Tại | Sửa Thành |
|----|---------|----------|
| 19 | Thành phố Hồ Chí Minh, Quận Phú Nhuận, Phường 6 | Hồ Chí Minh, Quận Phú Nhuận, Phường 6 |

### **TP. HCM - Quận 8 (Address ID 20)**
| ID | Hiện Tại | Sửa Thành |
|----|---------|----------|
| 20 | Thành phố Hồ Chí Minh, Quận 8, Phường 3 | Hồ Chí Minh, Quận 8, Phường 3 |

### **Hà Nội (Address ID 22-24)**
| ID | Hiện Tại | Sửa Thành |
|----|---------|----------|
| 22 | Thành phố Hà Nội, Quận Đống Đa, Phường 4 | Hà Nội, Quận Đống Đa, Phường 4 |
| 23 | Thành phố Hà Nội, Quận Hoàn Kiếm, Phường Hoàn Kiếm | Hà Nội, Quận Hoàn Kiếm, Phường Hoàn Kiếm |
| 24 | Thành phố Hà Nội, Quận Hai Bà Trưng, Phường Hai Bà Trưng | Hà Nội, Quận Hai Bà Trưng, Phường Hai Bà Trưng |

---

## 🎯 GHN API ID Mapping (Cần Xác Nhận)

### **Provinces**
| ProvinceName | ProvinceID (từ GHN) | Hiện Tại | Status |
|------------|-------------------|---------|--------|
| Hồ Chí Minh | ? (cần confirm) | Thành phố Hồ Chí Minh | ❓ |
| Hà Nội | ? (cần confirm) | Thành phố Hà Nội | ❓ |

### **Districts (TP. HCM)**
| DistrictName | DistrictID (từ GHN) | Status |
|------------|-------------------|--------|
| Quận 1 | ? | ❓ |
| Quận 3 | ? | ❓ |
| Quận 4 | ? | ❓ |
| Quận 5 | ? | ❓ |
| Quận 7 | ? | ❓ |
| Quận 8 | ? | ❓ |
| Quận 11 | ? | ❓ |
| Quận Tân Bình | ? | ❓ |
| Quận Bình Thạnh | ? | ❓ |
| Quận Gò Vấp | ? | ❓ |
| Quận Phú Nhuận | ? | ❓ |

### **Districts (Hà Nội)**
| DistrictName | DistrictID (từ GHN) | Status |
|------------|-------------------|--------|
| Quận Đống Đa | ? | ❓ |
| Quận Hoàn Kiếm | ? | ❓ |
| Quận Hai Bà Trưng | ? | ❓ |

---

## ✅ Checklist Triển Khai

- [ ] Xác nhận ProvinceID từ GHN API
- [ ] Xác nhận DistrictID từ GHN API
- [ ] Xác nhận WardCode từ GHN API
- [ ] Backup database trước khi sửa
- [ ] Chạy script sửa Province names
- [ ] Chạy script sửa Ward names
- [ ] Verify dữ liệu sau khi sửa
- [ ] Test API GHN validation
- [ ] Cập nhật seed file SQL
- [ ] Cập nhật file này khi hoàn thành

---

**Status:** ⏳ Chờ GHN API Response  
**Last Updated:** 22/05/2026

