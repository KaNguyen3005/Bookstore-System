-- =====================================================
-- ADDRESS STANDARDIZATION MIGRATION SCRIPT
-- Đồng bộ hóa dữ liệu địa chỉ theo định dạng GHN API
-- Ngày: 22/05/2026
-- Status: READY TO RUN (nhưng nên test trước)
-- =====================================================

-- =====================================================
-- STEP 1: BACKUP (khuyến nghị)
-- =====================================================
-- CREATE TABLE addresses_backup AS SELECT * FROM addresses;

-- =====================================================
-- STEP 2: THÊM CÁC CỘT MỚI (ProvinceID, DistrictID, WardCode)
-- =====================================================
ALTER TABLE `addresses`
ADD COLUMN `province_id` INT NULL COMMENT 'GHN Province ID' AFTER `province`,
ADD COLUMN `district_id` INT NULL COMMENT 'GHN District ID' AFTER `district`,
ADD COLUMN `ward_code` VARCHAR(100) NULL COMMENT 'GHN Ward Code' AFTER `ward`;

-- Thêm index để tăng tốc độ tìm kiếm
CREATE INDEX idx_addresses_province_id ON `addresses`(`province_id`);
CREATE INDEX idx_addresses_district_id ON `addresses`(`district_id`);
CREATE INDEX idx_addresses_ward_code ON `addresses`(`ward_code`);

-- =====================================================
-- STEP 3: CHUẨN HÓA TÊN PROVINCE
-- =====================================================
-- Thay "Thành phố Hồ Chí Minh" → "Hồ Chí Minh"
UPDATE `addresses`
SET `province` = 'Hồ Chí Minh',
    `province_id` = 1
WHERE `province` LIKE '%Hồ Chí Minh%';

-- Thay "Thành phố Hà Nội" → "Hà Nội"
UPDATE `addresses`
SET `province` = 'Hà Nội',
    `province_id` = 2
WHERE `province` LIKE '%Hà Nội%';

-- =====================================================
-- STEP 4: CHUẨN HÓA TÊN DISTRICT
-- =====================================================
-- TP. HCM - Quận 1
UPDATE `addresses`
SET `district_id` = 1
WHERE `district` = 'Quận 1' AND `province_id` = 1;

-- TP. HCM - Quận 3
UPDATE `addresses`
SET `district_id` = 3
WHERE `district` = 'Quận 3' AND `province_id` = 1;

-- TP. HCM - Quận 4
UPDATE `addresses`
SET `district_id` = 4
WHERE `district` = 'Quận 4' AND `province_id` = 1;

-- TP. HCM - Quận 5
UPDATE `addresses`
SET `district_id` = 5
WHERE `district` = 'Quận 5' AND `province_id` = 1;

-- TP. HCM - Quận 7
UPDATE `addresses`
SET `district_id` = 7
WHERE `district` = 'Quận 7' AND `province_id` = 1;

-- TP. HCM - Quận 8
UPDATE `addresses`
SET `district_id` = 8
WHERE `district` = 'Quận 8' AND `province_id` = 1;

-- TP. HCM - Quận 11
UPDATE `addresses`
SET `district_id` = 11
WHERE `district` = 'Quận 11' AND `province_id` = 1;

-- TP. HCM - Quận Tân Bình
UPDATE `addresses`
SET `district_id` = 12
WHERE `district` = 'Quận Tân Bình' AND `province_id` = 1;

-- TP. HCM - Quận Bình Thạnh
UPDATE `addresses`
SET `district_id` = 13
WHERE `district` = 'Quận Bình Thạnh' AND `province_id` = 1;

-- TP. HCM - Quận Gò Vấp
UPDATE `addresses`
SET `district_id` = 14
WHERE `district` = 'Quận Gò Vấp' AND `province_id` = 1;

-- TP. HCM - Quận Phú Nhuận
UPDATE `addresses`
SET `district_id` = 15
WHERE `district` = 'Quận Phú Nhuận' AND `province_id` = 1;

-- Hà Nội - Quận Đống Đa
UPDATE `addresses`
SET `district_id` = 101
WHERE `district` = 'Quận Đống Đa' AND `province_id` = 2;

-- Hà Nội - Quận Hoàn Kiếm
UPDATE `addresses`
SET `district_id` = 102
WHERE `district` = 'Quận Hoàn Kiếm' AND `province_id` = 2;

-- Hà Nội - Quận Hai Bà Trưng
UPDATE `addresses`
SET `district_id` = 103
WHERE `district` = 'Quận Hai Bà Trưng' AND `province_id` = 2;

-- =====================================================
-- STEP 5: CHUẨN HÓA TÊN WARD (Quận 1 - TP. HCM)
-- =====================================================
-- Thêm "Phường" nếu thiếu, và gán ward_code
UPDATE `addresses`
SET `ward` = 'Phường Bến Thành',
    `ward_code` = '001'
WHERE `ward` = 'Bến Thành' AND `district_id` = 1;

UPDATE `addresses`
SET `ward` = 'Phường Đa Kao',
    `ward_code` = '002'
WHERE `ward` = 'Đa Kao' AND `district_id` = 1;

UPDATE `addresses`
SET `ward` = 'Phường Nguyễn Cư Trinh',
    `ward_code` = '003'
WHERE `ward` = 'Nguyễn Cư Trinh' AND `district_id` = 1;

UPDATE `addresses`
SET `ward` = 'Phường Bến Nghé',
    `ward_code` = '004'
WHERE `ward` = 'Bến Nghé' AND `district_id` = 1;

-- =====================================================
-- STEP 6: CHUẨN HÓA TÊN WARD (Quận khác - TP. HCM)
-- =====================================================
-- Quận 4 - Phường Tân Định
UPDATE `addresses`
SET `ward` = 'Phường Tân Định',
    `ward_code` = '101'
WHERE `ward` = 'Tân Định' AND `district_id` = 4;

-- Quận 5 - Phường 3
UPDATE `addresses`
SET `ward_code` = '201'
WHERE `ward` = 'Phường 3' AND `district_id` = 5;

-- Quận 7 - Phường Tân Chí
UPDATE `addresses`
SET `ward` = 'Phường Tân Chí',
    `ward_code` = '301'
WHERE `ward` = 'Tân Chí' AND `district_id` = 7;

-- Quận 11 - Phường 1, 5
UPDATE `addresses`
SET `ward_code` = '401'
WHERE `ward` = 'Phường 1' AND `district_id` = 11;

UPDATE `addresses`
SET `ward_code` = '402'
WHERE `ward` = 'Phường 5' AND `district_id` = 11;

-- Quận Tân Bình - Phường 12
UPDATE `addresses`
SET `ward_code` = '501'
WHERE `ward` = 'Phường 12' AND `district_id` = 12;

-- Quận Bình Thạnh - Phường 25
UPDATE `addresses`
SET `ward_code` = '601'
WHERE `ward` = 'Phường 25' AND `district_id` = 13;

-- Quận Gò Vấp - Phường 4
UPDATE `addresses`
SET `ward_code` = '701'
WHERE `ward` = 'Phường 4' AND `district_id` = 14;

-- Quận Phú Nhuận - Phường 6
UPDATE `addresses`
SET `ward_code` = '801'
WHERE `ward` = 'Phường 6' AND `district_id` = 15;

-- Quận 3 - Phường 6
UPDATE `addresses`
SET `ward_code` = '901'
WHERE `ward` = 'Phường 6' AND `district_id` = 3;

-- Quận 8 - Phường 3
UPDATE `addresses`
SET `ward_code` = '1001'
WHERE `ward` = 'Phường 3' AND `district_id` = 8;

-- =====================================================
-- STEP 7: CHUẨN HÓA TÊN WARD (Hà Nội)
-- =====================================================
-- Hà Nội - Quận Đống Đa - Phường 4
UPDATE `addresses`
SET `ward_code` = '2001'
WHERE `ward` = 'Phường 4' AND `district_id` = 101;

-- Hà Nội - Quận Hoàn Kiếm - Phường Hoàn Kiếm
UPDATE `addresses`
SET `ward_code` = '2002'
WHERE `ward` = 'Phường Hoàn Kiếm' AND `district_id` = 102;

-- Hà Nội - Quận Hai Bà Trưng - Phường Hai Bà Trưng
UPDATE `addresses`
SET `ward_code` = '2003'
WHERE `ward` = 'Phường Hai Bà Trưng' AND `district_id` = 103;

-- =====================================================
-- STEP 8: KIỂM TRA KẾT QUẢ
-- =====================================================
-- Kiểm tra địa chỉ nào vẫn thiếu dữ liệu
SELECT address_id, customer_name, province, district, ward,
       province_id, district_id, ward_code
FROM addresses
WHERE province_id IS NULL
   OR district_id IS NULL
   OR ward_code IS NULL
ORDER BY address_id;

-- Hiển thị dữ liệu sau khi sửa
SELECT address_id, customer_name, province, province_id,
       district, district_id, ward, ward_code
FROM addresses
ORDER BY address_id;

-- Đếm số bản ghi đã chuẩn hóa
SELECT
  COUNT(*) as total_addresses,
  COUNT(CASE WHEN province_id IS NOT NULL THEN 1 END) as with_province_id,
  COUNT(CASE WHEN district_id IS NOT NULL THEN 1 END) as with_district_id,
  COUNT(CASE WHEN ward_code IS NOT NULL THEN 1 END) as with_ward_code,
  COUNT(CASE WHEN province_id IS NOT NULL AND district_id IS NOT NULL AND ward_code IS NOT NULL THEN 1 END) as fully_standardized
FROM addresses;

-- =====================================================
-- STEP 9: (OPTIONAL) THÊM CONSTRAINT
-- =====================================================
-- Nếu muốn bắt buộc các cột này không được NULL:
-- ALTER TABLE `addresses`
-- MODIFY COLUMN `province_id` INT NOT NULL,
-- MODIFY COLUMN `district_id` INT NOT NULL,
-- MODIFY COLUMN `ward_code` VARCHAR(100) NOT NULL;

-- =====================================================
-- STEP 10: (OPTIONAL) ROLLBACK PLAN
-- =====================================================
-- Nếu muốn khôi phục về trạng thái cũ:
-- RESTORE FROM addresses_backup;
-- -- hoặc
-- ALTER TABLE `addresses`
-- DROP COLUMN `province_id`,
-- DROP COLUMN `district_id`,
-- DROP COLUMN `ward_code`;
-- DROP INDEX idx_addresses_province_id ON `addresses`;
-- DROP INDEX idx_addresses_district_id ON `addresses`;
-- DROP INDEX idx_addresses_ward_code ON `addresses`;

-- =====================================================
-- VERIFICATION QUERIES (Bỏ comment để kiểm tra)
-- =====================================================
-- SELECT * FROM addresses WHERE province_id IS NULL;
-- SELECT DISTINCT province, province_id FROM addresses ORDER BY province;
-- SELECT DISTINCT district, district_id FROM addresses WHERE province_id = 1 ORDER BY district;
-- SELECT COUNT(*) as count FROM addresses WHERE province_id IS NOT NULL AND district_id IS NOT NULL AND ward_code IS NOT NULL;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
-- Sau khi chạy script này:
-- 1. Verify dữ liệu bằng các VERIFICATION QUERIES
-- 2. Test API GHN validation
-- 3. Update seed_db file nếu cần
-- 4. Cập nhật tài liệu PROJECT

-- NOTE: ProvinceID, DistrictID, WardCode ở trên là GIẢ ĐỊNH
-- Vui lòng thay bằng giá trị THỰC từ GHN API trước khi chạy

