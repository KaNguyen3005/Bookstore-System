USE `db_bookstore`;

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_SAFE_UPDATES = 0;
-- Xóa dữ liệu theo thứ tự tránh lỗi khóa ngoại
DELETE FROM `user_voucher`;
DELETE FROM `role_permission`;
DELETE FROM `book_order`;
DELETE FROM `book_cart`;
DELETE FROM `book_author`;
DELETE FROM `book_category`;
DELETE FROM `book_imgs`;
DELETE FROM `payments`;
DELETE FROM `shipments`;
DELETE FROM `reviews`;
DELETE FROM `interact_events`;
DELETE FROM `orders`;
DELETE FROM `carts`;
DELETE FROM `addresses`;
DELETE FROM `users`;
DELETE FROM `books`;
DELETE FROM `authors`;
DELETE FROM `publishers`;
DELETE FROM `categories`;
DELETE FROM `vouchers`;
DELETE FROM `permissions`;
DELETE FROM `roles`;
DELETE FROM `invalidated_token`;

ALTER TABLE `roles` AUTO_INCREMENT = 1;
ALTER TABLE `permissions` AUTO_INCREMENT = 1;
ALTER TABLE `users` AUTO_INCREMENT = 1;
ALTER TABLE `addresses` AUTO_INCREMENT = 1;
ALTER TABLE `authors` AUTO_INCREMENT = 1;
ALTER TABLE `publishers` AUTO_INCREMENT = 1;
ALTER TABLE `categories` AUTO_INCREMENT = 1;
ALTER TABLE `books` AUTO_INCREMENT = 1;
ALTER TABLE `book_imgs` AUTO_INCREMENT = 1;
ALTER TABLE `carts` AUTO_INCREMENT = 1;
ALTER TABLE `book_cart` AUTO_INCREMENT = 1;
ALTER TABLE `vouchers` AUTO_INCREMENT = 1;
ALTER TABLE `orders` AUTO_INCREMENT = 1;
ALTER TABLE `book_order` AUTO_INCREMENT = 1;
ALTER TABLE `payments` AUTO_INCREMENT = 1;
ALTER TABLE `reviews` AUTO_INCREMENT = 1;
ALTER TABLE `interact_events` AUTO_INCREMENT = 1;
ALTER TABLE `shipments` AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

START TRANSACTION;

-- =====================================================
-- 1. ROLE + PERMISSION
-- =====================================================
INSERT INTO `roles` (`role_id`, `role_name`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'ADMIN',   NOW(), NOW(), NULL),
(2, 'STAFF',   NOW(), NOW(), NULL),
(3, 'CUSTOMER',NOW(), NOW(), NULL);

INSERT INTO `permissions` (`permission_id`, `permission_name`, `description`) VALUES
(1, 'USER_READ',        'Xem danh sách người dùng'),
(2, 'USER_WRITE',       'Tạo và cập nhật người dùng'),
(3, 'BOOK_READ',        'Xem sách'),
(4, 'BOOK_WRITE',       'Tạo và cập nhật sách'),
(5, 'ORDER_READ',       'Xem đơn hàng'),
(6, 'ORDER_WRITE',      'Xử lý đơn hàng'),
(7, 'VOUCHER_MANAGE',   'Quản lý voucher'),
(8, 'REVIEW_MODERATE',  'Kiểm duyệt đánh giá');

INSERT INTO `role_permission` (`role_id`, `permission_id`) VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),
(2,3),(2,4),(2,5),(2,6),
(3,3),(3,5);

-- =====================================================
-- 2. USER + ADDRESS
-- Password mẫu đều là BCrypt của chuỗi: 123456
-- =====================================================
INSERT INTO `users`
(`user_id`, `username`, `password`, `name`, `email`, `phone`, `status`, `gender`, `is_change_account`, `point`, `dob`, `role_id`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(1, 'admin01',    '$2y$10$/huMvV0ij6YO3HFj8wBpmeuYxcFWHttFqyH6jb8kWCaHQTlU862XG', 'Quản trị hệ thống', 'admin@bookstore.vn',    '0901000001', b'1', 'MALE',   b'1', 5000, '1998-01-10 00:00:00', 1, NOW(), NOW(), NULL),
(2, 'staff01',    '$2y$10$/huMvV0ij6YO3HFj8wBpmeuYxcFWHttFqyH6jb8kWCaHQTlU862XG', 'Nhân viên bán hàng', 'staff@bookstore.vn',    '0901000002', b'1', 'FEMALE', b'1', 1200, '2000-05-20 00:00:00', 2, NOW(), NOW(), NULL),
(3, 'sonnguyen',  '$2y$10$/huMvV0ij6YO3HFj8wBpmeuYxcFWHttFqyH6jb8kWCaHQTlU862XG', 'Nguyễn Văn Sơn',     'son@example.com',       '0901000003', b'1', 'MALE',   b'0', 350,  '2003-09-15 00:00:00', 3, NOW(), NOW(), NULL),
(4, 'lananh',     '$2y$10$/huMvV0ij6YO3HFj8wBpmeuYxcFWHttFqyH6jb8kWCaHQTlU862XG', 'Trần Lan Anh',       'lananh@example.com',    '0901000004', b'1', 'FEMALE', b'0', 780,  '2004-12-01 00:00:00', 3, NOW(), NOW(), NULL);

INSERT INTO `addresses`
(`address_id`, `customer_name`, `customer_phone`, `detail_address`, `ward`, `district`, `province`, `is_default`, `user_id`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(1, 'Nguyễn Văn Sơn', '0901000003', '12 Nguyễn Huệ', 'Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', b'1', 3, NOW(), NOW(), NULL),
(2, 'Trần Lan Anh',   '0901000004', '45 Võ Thị Sáu', 'Thống Nhất', 'Biên Hòa', 'Đồng Nai',        b'1', 4, NOW(), NOW(), NULL),
(3, 'Nguyễn Văn Sơn', '0901000003', '18 Lý Tự Trọng', 'Bến Thành', 'Quận 1', 'TP. Hồ Chí Minh', b'0', 3, NOW(), NOW(), NULL);

-- =====================================================
-- 3. AUTHOR + PUBLISHER + CATEGORY
-- =====================================================
INSERT INTO `authors` (`author_id`, `alias`, `author_name`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'NNA',   'Nguyễn Nhật Ánh', NOW(), NOW(), NULL),
(2, 'THD',   'Tô Hoài',         NOW(), NOW(), NULL),
(3, 'DMB',   'Dale Carnegie',   NOW(), NOW(), NULL),
(4, 'JKR',   'J. K. Rowling',   NOW(), NOW(), NULL),
(5, 'JAMES', 'James Clear',     NOW(), NOW(), NULL);

INSERT INTO `publishers` (`publisher_id`, `publisher_name`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'NXB Trẻ',             NOW(), NOW(), NULL),
(2, 'NXB Kim Đồng',        NOW(), NOW(), NULL),
(3, 'NXB Tổng Hợp TP.HCM', NOW(), NOW(), NULL),
(4, 'NXB Văn Học',         NOW(), NOW(), NULL);

INSERT INTO `categories` (`category_id`, `category_name`, `parent_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Sách tiếng Việt', NULL, NOW(), NOW(), NULL),
(2, 'Văn học',         NULL, NOW(), NOW(), NULL),
(3, 'Kỹ năng sống',    NULL, NOW(), NOW(), NULL),
(4, 'Thiếu nhi',       NULL, NOW(), NOW(), NULL),
(5, 'Tiểu thuyết',     2,    NOW(), NOW(), NULL),
(6, 'Truyện dài',      2,    NOW(), NOW(), NULL),
(7, 'Tâm lý - Kỹ năng',3,    NOW(), NOW(), NULL),
(8, 'Fantasy',         NULL, NOW(), NOW(), NULL),
(9, 'Self-help',       3,    NOW(), NOW(), NULL),
(10,'Truyện đồng thoại',4,   NOW(), NOW(), NULL);

-- =====================================================
-- 4. BOOK + RELATION
-- =====================================================
INSERT INTO `books`
(`book_id`, `title`, `description`, `isbn`, `language`, `page_count`, `price`, `sale_percent`, `stock_quantity`, `avg_rating`, `cover_type`, `cover_image_url`, `is_active`, `publisher_id`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(1, 'Mắt Biếc',
 'Tác phẩm nổi tiếng của Nguyễn Nhật Ánh về tuổi học trò và mối tình đầu.',
 '9786041234501', 'vi', 290, 95000.00, 10, 120, 4.8, 'Bìa mềm', 'https://example.com/mat-biec.jpg', b'1', 1, NOW(), NOW(), NULL),

(2, 'Dế Mèn Phiêu Lưu Ký',
 'Tác phẩm kinh điển của Tô Hoài dành cho thiếu nhi và mọi lứa tuổi.',
 '9786041234502', 'vi', 210, 78000.00, 5, 90, 4.7, 'Bìa cứng', 'https://example.com/de-men.jpg', b'1', 2, NOW(), NOW(), NULL),

(3, 'Đắc Nhân Tâm',
 'Cuốn sách kỹ năng giao tiếp và ứng xử kinh điển.',
 '9786041234503', 'vi', 320, 110000.00, 15, 150, 4.9, 'Bìa mềm', 'https://example.com/dac-nhan-tam.jpg', b'1', 3, NOW(), NOW(), NULL),

(4, 'Harry Potter và Hòn Đá Phù Thủy',
 'Phần mở đầu của loạt truyện fantasy nổi tiếng thế giới.',
 '9786041234504', 'vi', 350, 150000.00, 20, 75, 4.9, 'Bìa mềm', 'https://example.com/hp1.jpg', b'1', 4, NOW(), NOW(), NULL),

(5, 'Atomic Habits',
 'Cuốn sách về xây dựng thói quen tốt và loại bỏ thói quen xấu.',
 '9786041234505', 'en', 280, 180000.00, 12, 65, 4.8, 'Paperback', 'https://example.com/atomic-habits.jpg', b'1', 4, NOW(), NOW(), NULL);

INSERT INTO `book_author` (`book_id`, `author_id`) VALUES
(1,1),
(2,2),
(3,3),
(4,4),
(5,5);

INSERT INTO `book_category` (`category_id`, `book_id`) VALUES
(2,1),(5,1),(6,1),
(4,2),(10,2),
(3,3),(7,3),
(8,4),(5,4),
(3,5),(9,5);

INSERT INTO `book_imgs` (`book_img_id`, `img_url`, `book_book_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'https://example.com/mat-biec-1.jpg', 1, NOW(), NOW(), NULL),
(2, 'https://example.com/mat-biec-2.jpg', 1, NOW(), NOW(), NULL),
(3, 'https://example.com/de-men-1.jpg',   2, NOW(), NOW(), NULL),
(4, 'https://example.com/dac-nhan-tam-1.jpg', 3, NOW(), NOW(), NULL),
(5, 'https://example.com/hp1-1.jpg',      4, NOW(), NOW(), NULL),
(6, 'https://example.com/atomic-1.jpg',   5, NOW(), NOW(), NULL);

-- =====================================================
-- 5. CART
-- =====================================================
INSERT INTO `carts` (`cart_id`, `user_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 3, NOW(), NOW(), NULL),
(2, 4, NOW(), NOW(), NULL);

INSERT INTO `book_cart` (`book_cart_id`, `cart_id`, `book_id`, `quantity`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, NOW(), NOW(), NULL),
(2, 1, 3, 2, NOW(), NOW(), NULL),
(3, 2, 2, 1, NOW(), NOW(), NULL),
(4, 2, 5, 1, NOW(), NOW(), NULL);

-- =====================================================
-- 6. VOUCHER
-- =====================================================
INSERT INTO `vouchers`
(`voucher_id`, `voucher_code`, `title`, `description`, `type`, `discount_value`, `min_order_value`, `max_discount_amount`, `min_point`, `total_limit`, `used_count`, `limit_per_user`, `is_active`, `start_date`, `end_date`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(1, 'WELCOME10', 'Giảm 10% cho khách mới', 'Áp dụng cho đơn từ 200.000đ', 'PERCENTAGE', 10.00, 200000.00, 50000.00, 0, 1000, 12, 1, b'1', '2026-01-01 00:00:00', '2026-12-31 23:59:59', NOW(), NOW(), NULL),
(2, 'FREESHIP25', 'Giảm 25.000đ', 'Áp dụng cho đơn từ 150.000đ', 'FIXED', 25000.00, 150000.00, 25000.00, 100, 500, 35, 2, b'1', '2026-01-01 00:00:00', '2026-12-31 23:59:59', NOW(), NOW(), NULL);

INSERT INTO `user_voucher` (`user_id`, `voucher_id`) VALUES
(3,1),
(3,2),
(4,1);

-- =====================================================
-- 7. ORDER + ORDER ITEM + PAYMENT + SHIPMENT
-- status trong orders/shipments là số nguyên vì schema hiện tại map kiểu số
-- =====================================================
INSERT INTO `orders`
(`order_id`, `customer_id`, `staff_id`, `voucher_id`, `status`, `total_amount`, `vat_rate`, `vat_amount`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(1, 3, 2, 1, 1, 270000.00, 8.00, 20000.00, NOW(), NOW(), NULL),
(2, 4, 2, NULL, 0, 228000.00, 8.00, 16888.89, NOW(), NOW(), NULL);

INSERT INTO `book_order`
(`book_order_id`, `order_id`, `book_id`, `quantity`, `unit`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(1, 1, 1, 1, 'Cuốn', NOW(), NOW(), NULL),
(2, 1, 3, 1, 'Cuốn', NOW(), NOW(), NULL),
(3, 2, 2, 1, 'Cuốn', NOW(), NOW(), NULL),
(4, 2, 5, 1, 'Cuốn', NOW(), NOW(), NULL);

INSERT INTO `payments`
(`payment_id`, `order_id`, `amount`, `method`, `status`, `transaction_id`, `paid_at`, `created_at`, `updated_at`)
VALUES
(1, 1, 270000.00, 'MOMO',    'SUCCESS', 'MOMO_TXN_0001', NOW(), NOW(), NOW()),
(2, 2, 228000.00, 'COD',     'PENDING', NULL,             NULL,  NOW(), NOW());

INSERT INTO `shipments`
(`shipment_id`, `order_id`, `carrier_name`, `tracking_number`, `customer_name`, `customer_phone`, `detail_address`, `ward`, `district`, `province`, `estimated_delivery_date`, `actual_delivery_date`, `status`)
VALUES
(2, 2, 'Giao Hàng Tiết Kiệm', 'LHQAQ9', 'Trần Lan Anh', '0901000004', '45 Võ Thị Sáu', 'Thống Nhất', 'Biên Hòa', 'Đồng Nai', '2026-04-11 18:00:00', NULL, 1);

-- =====================================================
-- 8. REVIEW + INTERACT EVENT + TOKEN
-- =====================================================
INSERT INTO `reviews`
(`review_id`, `content`, `rating`, `book_id`, `user_id`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(1, 'Truyện rất hay, nhiều cảm xúc.', 5, 1, 3, NOW(), NOW(), NULL),
(2, 'Sách giao tiếp rất thực tế và dễ áp dụng.', 5, 3, 4, NOW(), NOW(), NULL),
(3, 'Bản dịch ổn, nội dung cuốn hút.', 4, 4, 3, NOW(), NOW(), NULL);

INSERT INTO `interact_events`
(`interact_event_id`, `user_id`, `book_id`, `event_type`, `event_time`, `value`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(1, 3, 1, 'VIEW',      NOW(), 1, NOW(), NOW(), NULL),
(2, 3, 3, 'ADD_CART',  NOW(), 2, NOW(), NOW(), NULL),
(3, 4, 2, 'VIEW',      NOW(), 1, NOW(), NOW(), NULL),
(4, 4, 5, 'PURCHASE',  NOW(), 1, NOW(), NOW(), NULL);

INSERT INTO `invalidated_token` (`id`, `expiry_time`) VALUES
('sample_revoked_token_001', '2026-12-31 23:59:59');

COMMIT;

-- =====================================================
-- Gợi ý kiểm tra nhanh sau khi seed
-- SELECT * FROM roles;
-- SELECT * FROM users;
-- SELECT * FROM books;
-- SELECT * FROM orders;
-- =====================================================