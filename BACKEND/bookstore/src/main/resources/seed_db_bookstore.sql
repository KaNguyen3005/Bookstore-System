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
-- 1. ROLE + PERMISSION (Based on Controllers)
-- =====================================================
INSERT INTO `roles` (`role_id`, `role_name`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'ADMIN',   NOW(), NOW(), NULL),
(2, 'STAFF',   NOW(), NOW(), NULL),
(3, 'CUSTOMER',NOW(), NOW(), NULL);

-- Permissions từ Controllers: Book, User, Order, Category, Address, Author, Publisher, Voucher, Review, Payment, etc.
INSERT INTO `permissions` (`permission_id`, `permission_name`, `description`) VALUES
-- BOOK Permissions (BookController)
(1, 'CREATE_BOOK',      'Tạo sách mới'),
(2, 'READ_BOOK',        'Xem danh sách sách'),
(3, 'UPDATE_BOOK',      'Cập nhật thông tin sách'),
(4, 'DELETE_BOOK',      'Xóa sách'),

-- USER Permissions (UserController)
(5, 'CREATE_USER',      'Tạo người dùng mới'),
(6, 'READ_USER',        'Xem danh sách người dùng'),
(7, 'UPDATE_USER',      'Cập nhật thông tin người dùng'),
(8, 'DELETE_USER',      'Xóa người dùng'),

-- ORDER Permissions (OrderController)
(9, 'CREATE_ORDER',     'Tạo đơn hàng'),
(10, 'READ_ORDER',      'Xem danh sách đơn hàng'),
(11, 'UPDATE_ORDER',    'Cập nhật trạng thái đơn hàng'),
(12, 'DELETE_ORDER',    'Hủy đơn hàng'),
(13, 'APPROVE_ORDER',   'Phê duyệt đơn hàng'),

-- CATEGORY Permissions (CategoryController)
(14, 'CREATE_CATEGORY', 'Tạo danh mục'),
(15, 'READ_CATEGORY',   'Xem danh mục'),
(16, 'UPDATE_CATEGORY', 'Cập nhật danh mục'),
(17, 'DELETE_CATEGORY', 'Xóa danh mục'),

-- ADDRESS Permissions (AddressController)
(18, 'CREATE_ADDRESS',  'Tạo địa chỉ'),
(19, 'READ_ADDRESS',    'Xem địa chỉ'),
(20, 'UPDATE_ADDRESS',  'Cập nhật địa chỉ'),
(21, 'DELETE_ADDRESS',  'Xóa địa chỉ'),

-- AUTHOR Permissions (AuthorController)
(22, 'CREATE_AUTHOR',   'Tạo tác giả'),
(23, 'READ_AUTHOR',     'Xem tác giả'),
(24, 'UPDATE_AUTHOR',   'Cập nhật tác giả'),
(25, 'DELETE_AUTHOR',   'Xóa tác giả'),

-- PUBLISHER Permissions (PublisherController)
(26, 'CREATE_PUBLISHER','Tạo nhà xuất bản'),
(27, 'READ_PUBLISHER',  'Xem nhà xuất bản'),
(28, 'UPDATE_PUBLISHER','Cập nhật nhà xuất bản'),
(29, 'DELETE_PUBLISHER','Xóa nhà xuất bản'),

-- VOUCHER Permissions (VoucherController)
(30, 'CREATE_VOUCHER',  'Tạo mã giảm giá'),
(31, 'READ_VOUCHER',    'Xem mã giảm giá'),
(32, 'UPDATE_VOUCHER',  'Cập nhật mã giảm giá'),
(33, 'DELETE_VOUCHER',  'Xóa mã giảm giá'),

-- REVIEW Permissions (ReviewController)
(34, 'READ_REVIEW',     'Xem đánh giá'),
(35, 'CREATE_REVIEW',   'Tạo đánh giá'),
(36, 'DELETE_REVIEW',   'Xóa đánh giá'),

-- PAYMENT Permissions (PaymentController)
(37, 'READ_PAYMENT',    'Xem thanh toán'),
(38, 'CREATE_PAYMENT',  'Tạo thanh toán'),

-- REPORT Permissions (ReportController)
(39, 'READ_REPORT',     'Xem báo cáo'),
(40, 'READ_DASHBOARD',  'Xem dashboard');

-- Role Permissions Mapping
INSERT INTO `role_permission` (`role_id`, `permission_id`) VALUES
-- ADMIN: Tất cả quyền
(1,1),(1,2),(1,3),(1,4),
(1,5),(1,6),(1,7),(1,8),
(1,9),(1,10),(1,11),(1,12),(1,13),
(1,14),(1,15),(1,16),(1,17),
(1,18),(1,19),(1,20),(1,21),
(1,22),(1,23),(1,24),(1,25),
(1,26),(1,27),(1,28),(1,29),
(1,30),(1,31),(1,32),(1,33),
(1,34),(1,35),(1,36),
(1,37),(1,38),
(1,39),(1,40),

-- STAFF: Quản lý sách, đơn hàng, danh mục, báo cáo
(2,2),(2,3),(2,4),
(2,10),(2,11),(2,12),(2,13),
(2,14),(2,15),(2,16),(2,17),
(2,22),(2,23),(2,24),(2,25),
(2,26),(2,27),(2,28),(2,29),
(2,34),
(2,39),(2,40),

-- CUSTOMER: Xem sách, tạo đơn hàng, đánh giá, địa chỉ cá nhân
(3,2),
(3,9),(3,10),(3,12),
(3,18),(3,19),(3,20),(3,21),
(3,34),(3,35),
(3,40);

-- =====================================================
-- 2. USER + ADDRESS
-- Password mẫu đều là BCrypt của chuỗi: 123456
-- =====================================================
INSERT INTO `users`
(`user_id`, `username`, `password`, `name`, `email`, `phone`, `status`, `gender`, `is_change_account`, `point`, `tier`, `dob`, `role_id`, `avatar_url`, `auth_provider`, `email_verified`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(1, 'admin01',    '$2y$10$/huMvV0ij6YO3HFj8wBpmeuYxcFWHttFqyH6jb8kWCaHQTlU862XG', 'Quản trị hệ thống', 'admin@bookstore.vn',    '0901000001', b'1', 'MALE',   b'1', 10000, 'PLATINUM', '1998-01-10 00:00:00', 1, 'http://localhost:8080/imgs/users/user_default.jpg', 'LOCAL', b'1', NOW(), NOW(), NULL),
(2, 'staff01',    '$2y$10$/huMvV0ij6YO3HFj8wBpmeuYxcFWHttFqyH6jb8kWCaHQTlU862XG', 'Nhân viên bán hàng', 'staff@bookstore.vn',    '0901000002', b'1', 'FEMALE', b'1', 5000, 'GOLD', '2000-05-20 00:00:00', 2, 'http://localhost:8080/imgs/users/user_default.jpg', 'LOCAL', b'1', NOW(), NOW(), NULL),
(3, 'sonnguyen',  '$2y$10$/huMvV0ij6YO3HFj8wBpmeuYxcFWHttFqyH6jb8kWCaHQTlU862XG', 'Nguyễn Văn Sơn',     'son@example.com',       '0901000003', b'1', 'MALE',   b'0', 1350, 'SILVER', '2003-09-15 00:00:00', 3, 'http://localhost:8080/imgs/users/user_default.jpg', 'LOCAL', b'1', NOW(), NOW(), NULL),
(4, 'lananh',     '$2y$10$/huMvV0ij6YO3HFj8wBpmeuYxcFWHttFqyH6jb8kWCaHQTlU862XG', 'Trần Lan Anh',       'lananh@example.com',    '0901000004', b'1', 'FEMALE', b'0', 2780, 'GOLD', '2004-12-01 00:00:00', 3, 'http://localhost:8080/imgs/users/user_default.jpg', 'LOCAL', b'1', NOW(), NOW(), NULL);

INSERT INTO `addresses`
(`address_id`, `user_id`, `detail_address`, `ward`, `district`, `province`, `customer_name`, `customer_phone`, `is_default`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(1, 3, '12 Nguyễn Huệ', 'Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', 'Nguyễn Văn Sơn', '0901000003', b'1', NOW(), NOW(), NULL),
(2, 4, '45 Võ Thị Sáu', 'Thống Nhất', 'Biên Hòa', 'Đồng Nai', 'Trần Lan Anh', '0901000004', b'1', NOW(), NOW(), NULL),
(3, 3, '18 Lý Tự Trọng', 'Bến Thành', 'Quận 1', 'TP. Hồ Chí Minh', 'Nguyễn Văn Sơn', '0901000003', b'0', NOW(), NOW(), NULL);

-- =====================================================
-- 3. AUTHOR + PUBLISHER + CATEGORY (RECURSIVE STRUCTURE)
-- =====================================================
INSERT INTO `authors` (`author_id`, `author_name`, `alias`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Nguyễn Nhật Ánh', 'NNA', NOW(), NOW(), NULL),
(2, 'Tô Hoài',         'TH', NOW(), NOW(), NULL),
(3, 'Dale Carnegie',   'DC', NOW(), NOW(), NULL),
(4, 'J. K. Rowling',   'JKR', NOW(), NOW(), NULL),
(5, 'James Clear',     'JC', NOW(), NOW(), NULL),
(6, 'Robert Martin',   'RM', NOW(), NOW(), NULL),
(7, 'Joshua Bloch',    'JB', NOW(), NOW(), NULL),
(8, 'Haruki Murakami', 'HM', NOW(), NOW(), NULL);

INSERT INTO `publishers` (`publisher_id`, `publisher_name`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'NXB Trẻ',             NOW(), NOW(), NULL),
(2, 'NXB Kim Đồng',        NOW(), NOW(), NULL),
(3, 'NXB Tổng Hợp TP.HCM', NOW(), NOW(), NULL),
(4, 'NXB Văn Học',         NOW(), NOW(), NULL),
(5, 'Penguin Books',       NOW(), NOW(), NULL);

-- ROOT CATEGORIES (Level 1)
INSERT INTO `categories` (`category_name`, `parent_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
('Lập Trình', NULL, NOW(), NOW(), NULL),
('Văn Học',   NULL, NOW(), NOW(), NULL),
('Kinh Tế',   NULL, NOW(), NOW(), NULL),
('Tâm Lý',    NULL, NOW(), NOW(), NULL),
('Khoa Học',  NULL, NOW(), NOW(), NULL);

-- LEVEL 2 CATEGORIES - Children of 'Lập Trình' (id: 1)
INSERT INTO `categories` (`category_name`, `parent_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
('Java', 1, NOW(), NOW(), NULL),
('Python', 1, NOW(), NOW(), NULL),
('C++', 1, NOW(), NOW(), NULL),
('Web Development', 1, NOW(), NOW(), NULL),
('Mobile Development', 1, NOW(), NOW(), NULL);

-- LEVEL 2 CATEGORIES - Children of 'Văn Học' (id: 2)
INSERT INTO `categories` (`category_name`, `parent_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
('Tiểu Thuyết', 2, NOW(), NOW(), NULL),
('Thơ',         2, NOW(), NOW(), NULL),
('Truyện Ngắn', 2, NOW(), NOW(), NULL);

-- LEVEL 3 CATEGORIES - Children of 'Java' (id: 6)
INSERT INTO `categories` (`category_name`, `parent_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
('Spring Boot',    6, NOW(), NOW(), NULL),
('Design Pattern', 6, NOW(), NOW(), NULL),
('Microservices',  6, NOW(), NOW(), NULL);

-- LEVEL 3 CATEGORIES - Children of 'Web Development' (id: 9)
INSERT INTO `categories` (`category_name`, `parent_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
('Frontend',  9, NOW(), NOW(), NULL),
('Backend',   9, NOW(), NOW(), NULL);

-- =====================================================
-- 4. BOOK + RELATION
-- =====================================================
INSERT INTO `books`
(`book_id`, `title`, `description`, `isbn`, `language`, `page_count`, `price`, `sale_percent`, `stock_quantity`, `avg_rating`, `cover_type`, `cover_image_url`, `is_active`, `width`, `length`, `height`, `weight`, `publisher_id`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(1, 'Mắt Biếc',
 'Tác phẩm nổi tiếng của Nguyễn Nhật Ánh về tuổi học trò và mối tình đầu.',
 '9786041234501', 'vi', 290, 95000.00, 10, 120, 4.8, 'Bìa mềm', 'http://localhost:8080/imgs/books/book_default.jpg', b'1', 14, 20, 2, 0.3, 1, NOW(), NOW(), NULL),

(2, 'Dế Mèn Phiêu Lưu Ký',
 'Tác phẩm kinh điển của Tô Hoài dành cho thiếu nhi và mọi lứa tuổi.',
 '9786041234502', 'vi', 210, 78000.00, 5, 90, 4.7, 'Bìa cứng', 'http://localhost:8080/imgs/books/book_default.jpg', b'1', 14, 20, 2, 0.3, 2, NOW(), NOW(), NULL),

(3, 'Đắc Nhân Tâm',
 'Cuốn sách kỹ năng giao tiếp và ứng xử kinh điển.',
 '9786041234503', 'vi', 320, 110000.00, 15, 150, 4.9, 'Bìa mềm', 'http://localhost:8080/imgs/books/book_default.jpg', b'1', 14, 20, 2, 0.3, 3, NOW(), NOW(), NULL),

(4, 'Harry Potter và Hòn Đá Phù Thủy',
 'Phần mở đầu của loạt truyện fantasy nổi tiếng thế giới.',
 '9786041234504', 'vi', 350, 150000.00, 20, 75, 4.9, 'Bìa mềm', 'http://localhost:8080/imgs/books/book_default.jpg', b'1', 14, 20, 2, 0.3, 4, NOW(), NOW(), NULL),

(5, 'Atomic Habits',
 'Cuốn sách về xây dựng thói quen tốt và loại bỏ thói quen xấu.',
 '9786041234505', 'en', 280, 180000.00, 12, 65, 4.8, 'Paperback', 'http://localhost:8080/imgs/books/book_default.jpg', b'1', 14, 20, 2, 0.3, 4, NOW(), NOW(), NULL);

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
(1, 'http://localhost:8080/imgs/books/book_extra.jpg', 1, NOW(), NOW(), NULL),
(2, 'http://localhost:8080/imgs/books/book_extra.jpg', 1, NOW(), NOW(), NULL),
(3, 'http://localhost:8080/imgs/books/book_extra.jpg',   2, NOW(), NOW(), NULL),
(4, 'http://localhost:8080/imgs/books/book_extra.jpg', 3, NOW(), NOW(), NULL),
(5, 'http://localhost:8080/imgs/books/book_extra.jpg',      4, NOW(), NOW(), NULL),
(6, 'http://localhost:8080/imgs/books/book_extra.jpg',   5, NOW(), NOW(), NULL);

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
(`order_id`, `customer_id`, `staff_id`, `voucher_id`, `status`, `vat_rate`, `vat_amount`, `tier_rate`, `total_amount`, `reward_point_applied`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(1, 3, 2, 1, 1, 0.05, 20000.00, 0.02, 270000.00, b'0', NOW(), NOW(), NULL),
(2, 4, 2, NULL, 0, 0.05, 16888.89, 0.01, 228000.00, b'0', NOW(), NOW(), NULL);

INSERT INTO `book_order`
(`book_order_id`, `order_id`, `book_id`, `quantity`, `unit`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(1, 1, 1, 1, 'Cuốn', NOW(), NOW(), NULL),
(2, 1, 3, 1, 'Cuốn', NOW(), NOW(), NULL),
(3, 2, 2, 1, 'Cuốn', NOW(), NOW(), NULL),
(4, 2, 5, 1, 'Cuốn', NOW(), NOW(), NULL);

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