-- Seed data for BookStore Database - Vietnamese VERSION
-- Date: May 7, 2026
-- Language: TIẾNG VIỆT
-- Currency: VNĐ (VND)
-- Exchange Rate: 1 USD ≈ 24,000 VNĐ

SET FOREIGN_KEY_CHECKS=0;

-- =====================================================
-- ROLES & PERMISSIONS
-- =====================================================
INSERT INTO `roles` (`role_id`, `role_name`, `created_at`) VALUES
                                                               (1, 'ADMIN', NOW()),
                                                               (2, 'CUSTOMER', NOW()),
                                                               (3, 'STAFF', NOW());

INSERT INTO `permissions` (`permission_id`, `permission_name`, `description`) VALUES
                                                                                  -- User Management
                                                                                  (1, 'CREATE_USER', 'Tạo người dùng mới'),
                                                                                  (2, 'READ_USER', 'Xem thông tin người dùng'),
                                                                                  (3, 'UPDATE_USER', 'Cập nhật thông tin người dùng'),
                                                                                  (4, 'DELETE_USER', 'Xóa người dùng'),
                                                                                  -- Book Management
                                                                                  (5, 'CREATE_BOOK', 'Tạo sách mới'),
                                                                                  (6, 'READ_BOOK', 'Xem thông tin sách'),
                                                                                  (7, 'UPDATE_BOOK', 'Cập nhật sách'),
                                                                                  (8, 'DELETE_BOOK', 'Xóa sách'),
                                                                                  -- Author Management
                                                                                  (9, 'CREATE_AUTHOR', 'Tạo tác giả mới'),
                                                                                  (10, 'READ_AUTHOR', 'Xem thông tin tác giả'),
                                                                                  (11, 'UPDATE_AUTHOR', 'Cập nhật tác giả'),
                                                                                  (12, 'DELETE_AUTHOR', 'Xóa tác giả'),
                                                                                  -- Publisher Management
                                                                                  (13, 'CREATE_PUBLISHER', 'Tạo nhà xuất bản mới'),
                                                                                  (14, 'READ_PUBLISHER', 'Xem thông tin nhà xuất bản'),
                                                                                  (15, 'UPDATE_PUBLISHER', 'Cập nhật nhà xuất bản'),
                                                                                  (16, 'DELETE_PUBLISHER', 'Xóa nhà xuất bản'),
                                                                                  -- Category Management
                                                                                  (17, 'CREATE_CATEGORY', 'Tạo danh mục mới'),
                                                                                  (18, 'UPDATE_CATEGORY', 'Cập nhật danh mục'),
                                                                                  (19, 'DELETE_CATEGORY', 'Xóa danh mục'),
                                                                                  -- Address Management
                                                                                  (20, 'CREATE_ADDRESS', 'Tạo địa chỉ mới'),
                                                                                  (21, 'READ_ADDRESS', 'Xem thông tin địa chỉ'),
                                                                                  (22, 'UPDATE_ADDRESS', 'Cập nhật địa chỉ'),
                                                                                  (23, 'DELETE_ADDRESS', 'Xóa địa chỉ'),
                                                                                  -- Order Management
                                                                                  (24, 'CREATE_ORDER', 'Tạo đơn hàng mới'),
                                                                                  (25, 'READ_ORDER', 'Xem thông tin đơn hàng'),
                                                                                  -- Voucher Management
                                                                                  (26, 'CREATE_VOUCHER', 'Tạo voucher mới'),
                                                                                  (27, 'UPDATE_VOUCHER', 'Cập nhật voucher'),
                                                                                  (28, 'DELETE_VOUCHER', 'Xóa voucher'),
                                                                                  -- Role & Permission Management
                                                                                  (29, 'CREATE_ROLE', 'Tạo vai trò mới'),
                                                                                  (30, 'UPDATE_ROLE', 'Cập nhật vai trò'),
                                                                                  (31, 'DELETE_ROLE', 'Xóa vai trò'),
                                                                                  (32, 'READ_PERMISSION', 'Xem danh sách quyền'),
                                                                                  -- Dashboard & Report
                                                                                  (33, 'READ_DASHBOARD', 'Xem dashboard'),
                                                                                  (34, 'READ_REPORT', 'Xem báo cáo');

INSERT INTO `role_permission` (`role_id`, `permission_id`) VALUES
-- ADMIN: Tất cả permissions (1-34)
(1, 1), (1, 2), (1, 3), (1, 4),    -- User Management
(1, 5), (1, 6), (1, 7), (1, 8),    -- Book Management
(1, 9), (1, 10), (1, 11), (1, 12), -- Author Management
(1, 13), (1, 14), (1, 15), (1, 16),-- Publisher Management
(1, 17), (1, 18), (1, 19),         -- Category Management
(1, 20), (1, 21), (1, 22), (1, 23),-- Address Management
(1, 24), (1, 25),                  -- Order Management
(1, 26), (1, 27), (1, 28),         -- Voucher Management
(1, 29), (1, 30), (1, 31),         -- Role Management
(1, 32), (1, 33), (1, 34),         -- Permission, Dashboard, Report
-- STAFF: Quản lý sách, đơn hàng, báo cáo
(3, 6), (3, 7),                    -- READ_BOOK, UPDATE_BOOK
(3, 5),                            -- CREATE_BOOK
(3, 24), (3, 25),                  -- Order Management
(3, 33), (3, 34),                  -- Dashboard, Report
-- CUSTOMER: Chỉ có quyền cơ bản
(2, 6),                            -- READ_BOOK
(2, 20), (2, 21), (2, 22), (2, 23),-- Address Management
(2, 24), (2, 25);                  -- Order Management

-- =====================================================
-- USERS (NGƯỜI DÙNG)
-- =====================================================
INSERT INTO `users` (`user_id`, `username`, `password`, `name`, `email`, `phone`, `status`, `gender`, `tier`, `point`, `avatar_url`, `public_id_avatar`, `is_change_account`, `role_id`, `created_at`) VALUES
                                                                                                                                                                                                                (1, 'admin', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Quản trị viên', 'admin@sachtinhyeu.vn', '0987654321', 1, 'Nam', 'PLATINUM', 50000, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/admin_avatar', 0, 1, NOW()),
(2, 'staff1', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Trần Văn A', 'nhanvien1@sachtinhyeu.vn', '0901123456', 1, 'Nam', 'GOLD', 23000, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/staff1_avatar', 0, 3, NOW()),
(3, 'staff2', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Lê Thị B', 'nhanvien2@sachtinhyeu.vn', '0901123457', 1, 'Nữ', 'GOLD', 24000, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/staff2_avatar', 0, 3, NOW()),
(4, 'staff3', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Phạm Văn C', 'nhanvien3@sachtinhyeu.vn', '0901123458', 1, 'Nam', 'GOLD', 23500, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/staff3_avatar', 0, 3, NOW()),
(5, 'staff4', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Hoàng Thị D', 'nhanvien4@sachtinhyeu.vn', '0901123459', 1, 'Nữ', 'GOLD', 24500, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/staff4_avatar', 0, 3, NOW()),
(6, 'staff5', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Đỗ Văn E', 'nhanvien5@sachtinhyeu.vn', '0901123460', 1, 'Nam', 'GOLD', 23000, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/staff5_avatar', 0, 3, NOW()),
(7, 'staff6', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Vũ Thị F', 'nhanvien6@sachtinhyeu.vn', '0901123461', 1, 'Nữ', 'GOLD', 24000, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/staff6_avatar', 0, 3, NOW()),
(8, 'staff7', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Bùi Văn G', 'nhanvien7@sachtinhyeu.vn', '0901123462', 1, 'Nam', 'GOLD', 23700, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/staff7_avatar', 0, 3, NOW()),
(9, 'staff8', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Trần Thị H', 'nhanvien8@sachtinhyeu.vn', '0901123463', 1, 'Nữ', 'GOLD', 24200, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/staff8_avatar', 0, 3, NOW()),
(10, 'staff9', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Lý Văn I', 'nhanvien9@sachtinhyeu.vn', '0901123464', 1, 'Nam', 'GOLD', 23800, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/staff9_avatar', 0, 3, NOW()),
(11, 'staff10', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Ngô Thị J', 'nhanvien10@sachtinhyeu.vn', '0901123465', 1, 'Nữ', 'GOLD', 24100, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/staff10_avatar', 0, 3, NOW()),
(12, 'customer1', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Nguyễn Văn Khách', 'khach1@email.com', '0912345678', 1, 'Nam', 'BRONZE', 2500, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer1', 0, 2, NOW()),
(13, 'customer2', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Lê Thị Hoa', 'khach2@email.com', '0912345679', 1, 'Nữ', 'SILVER', 13000, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer2', 0, 2, NOW()),
(14, 'customer3', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Trương Văn An', 'khach3@email.com', '0912345680', 1, 'Nam', 'BRONZE', 2600, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer3', 0, 2, NOW()),
(15, 'customer4', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Phạm Thị Linh', 'khach4@email.com', '0912345681', 1, 'Nữ', 'GOLD', 29000, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer4', 0, 2, NOW()),
(16, 'customer5', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Hoàng Văn Tân', 'khach5@email.com', '0912345682', 1, 'Nam', 'SILVER', 13500, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer5', 0, 2, NOW()),
(17, 'customer6', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Đặng Thị Thu', 'khach6@email.com', '0912345683', 1, 'Nữ', 'BRONZE', 2700, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer6', 0, 2, NOW()),
(18, 'customer7', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Vương Văn Khôi', 'khach7@email.com', '0912345684', 1, 'Nam', 'PLATINUM', 30000, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer7', 0, 2, NOW()),
(19, 'customer8', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Tạ Thị Hương', 'khach8@email.com', '0912345685', 1, 'Nữ', 'SILVER', 13800, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer8', 0, 2, NOW()),
(20, 'customer9', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Giang Văn Tùng', 'khach9@email.com', '0912345686', 1, 'Nam', 'BRONZE', 2800, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer9', 0, 2, NOW()),
(21, 'customer10', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Thái Thị Duyên', 'khach10@email.com', '0912345687', 1, 'Nữ', 'GOLD', 29500, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer10', 0, 2, NOW()),
(22, 'customer11', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Khuất Văn Quyết', 'khach11@email.com', '0912345688', 1, 'Nam', 'SILVER', 13200, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer11', 0, 2, NOW()),
(23, 'customer12', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Tôn Thị Huệ', 'khach12@email.com', '0912345689', 1, 'Nữ', 'BRONZE', 2900, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer12', 0, 2, NOW()),
(24, 'customer13', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Hà Văn Đạt', 'khach13@email.com', '0912345690', 1, 'Nam', 'PLATINUM', 31000, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer13', 0, 2, NOW()),
(25, 'customer14', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Tây Thị Lệ', 'khach14@email.com', '0912345691', 1, 'Nữ', 'GOLD', 29800, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'users/customer14', 0, 2, NOW());

-- =====================================================
-- ADDRESSES (ĐỊA CHỈ)
-- =====================================================
INSERT INTO `addresses` (`address_id`, `customer_name`, `customer_phone`, `detail_address`, `ward`, `district`, `province`, `is_default`, `user_id`, `created_at`) VALUES
(1, 'Trần Văn A', '0901123456', '123 Đường Nguyễn Huệ', 'Bến Thành', 'Quận 1', 'Thành phố Hồ Chí Minh', 1, 2, NOW()),
(2, 'Lê Thị B', '0901123457', '456 Đường Lê Lợi', 'Đa Kao', 'Quận 1', 'Thành phố Hồ Chí Minh', 1, 3, NOW()),
(3, 'Phạm Văn C', '0901123458', '789 Đường Trần Hưng Đạo', 'Nguyễn Cư Trinh', 'Quận 1', 'Thành phố Hồ Chí Minh', 1, 4, NOW()),
(4, 'Hoàng Thị D', '0901123459', '321 Đường Pasteur', 'Bến Nghé', 'Quận 1', 'Thành phố Hồ Chí Minh', 1, 5, NOW()),
(5, 'Đỗ Văn E', '0901123460', '654 Đường Tôn Đức Thắng', 'Bến Thành', 'Quận 1', 'Thành phố Hồ Chí Minh', 1, 6, NOW()),
(6, 'Vũ Thị F', '0901123461', '987 Đường Calmette', 'Đa Kao', 'Quận 1', 'Thành phố Hồ Chí Minh', 1, 7, NOW()),
(7, 'Bùi Văn G', '0901123462', '147 Đường Mạc Thiên Tích', 'Nguyễn Cư Trinh', 'Quận 1', 'Thành phố Hồ Chí Minh', 1, 8, NOW()),
(8, 'Trần Thị H', '0901123463', '258 Đường Hai Bà Trưng', 'Bến Nghé', 'Quận 1', 'Thành phố Hồ Chí Minh', 1, 9, NOW()),
(9, 'Lý Văn I', '0901123464', '369 Đường Võ Văn Kiệt', 'Bến Thành', 'Quận 1', 'Thành phố Hồ Chí Minh', 1, 10, NOW()),
(10, 'Ngô Thị J', '0901123465', '741 Đường Nam Kỳ Khởi Nghĩa', 'Đa Kao', 'Quận 1', 'Thành phố Hồ Chí Minh', 1, 11, NOW()),
(11, 'Nguyễn Văn Khách', '0912345678', '111 Đường Lý Thường Kiệt', 'Tân Định', 'Quận 4', 'Thành phố Hồ Chí Minh', 1, 12, NOW()),
(12, 'Lê Thị Hoa', '0912345679', '222 Đường Nguyễn Thị Minh Khai', 'Phường 3', 'Quận 5', 'Thành phố Hồ Chí Minh', 1, 13, NOW()),
(13, 'Trương Văn An', '0912345680', '333 Đường Âu Cơ', 'Phường 5', 'Quận 11', 'Thành phố Hồ Chí Minh', 1, 14, NOW()),
(14, 'Phạm Thị Linh', '0912345681', '444 Đường Lâm Văn Gen', 'Tân Chí', 'Quận 7', 'Thành phố Hồ Chí Minh', 1, 15, NOW()),
(15, 'Hoàng Văn Tân', '0912345682', '555 Đường Cộng Hoà', 'Phường 12', 'Quận Tân Bình', 'Thành phố Hồ Chí Minh', 1, 16, NOW()),
(16, 'Đặng Thị Thu', '0912345683', '666 Đường Cách Mạng Tháng Tám', 'Phường 6', 'Quận 3', 'Thành phố Hồ Chí Minh', 1, 17, NOW()),
(17, 'Vương Văn Khôi', '0912345684', '777 Đường Điền Biên Phủ', 'Phường 25', 'Quận Bình Thạnh', 'Thành phố Hồ Chí Minh', 1, 18, NOW()),
(18, 'Tạ Thị Hương', '0912345685', '888 Đường Ung Văn Khiêm', 'Phường 4', 'Quận Gò Vấp', 'Thành phố Hồ Chí Minh', 1, 19, NOW()),
(19, 'Giang Văn Tùng', '0912345686', '999 Đường Hoàng Văn Thụ', 'Phường 6', 'Quận Phú Nhuận', 'Thành phố Hồ Chí Minh', 1, 20, NOW()),
(20, 'Thái Thị Duyên', '0912345687', '1010 Đường Tạ Quang Bửu', 'Phường 3', 'Quận 8', 'Thành phố Hồ Chí Minh', 1, 21, NOW()),
(21, 'Khuất Văn Quyết', '0912345688', '1111 Đường Lê Thánh Tông', 'Phường 1', 'Quận 11', 'Thành phố Hồ Chí Minh', 1, 22, NOW()),
(22, 'Tôn Thị Huệ', '0912345689', '1212 Đường Huỳnh Thủc Kháng', 'Phường 4', 'Quận Đống Đa', 'Thành phố Hà Nội', 1, 23, NOW()),
(23, 'Hà Văn Đạt', '0912345690', '1313 Đường Phan Chu Trinh', 'Phường Hoàn Kiếm', 'Quận Hoàn Kiếm', 'Thành phố Hà Nội', 1, 24, NOW()),
(24, 'Tây Thị Lệ', '0912345691', '1414 Đường Trương Định', 'Phường Hai Bà Trưng', 'Quận Hai Bà Trưng', 'Thành phố Hà Nội', 1, 25, NOW());

-- =====================================================
-- AUTHORS (TÁC GIẢ)
-- =====================================================
INSERT INTO `authors` (`author_id`, `alias`, `author_name`, `created_at`) VALUES
(1, 'George Orwell', 'George Orwell', NOW()),
(2, 'J.K. Rowling', 'Joanne Kathleen Rowling', NOW()),
(3, 'Stephen King', 'Stephen King', NOW()),
(4, 'Jane Austen', 'Jane Austen', NOW()),
(5, 'Charles Dickens', 'Charles Dickens', NOW()),
(6, 'Emily Brontë', 'Emily Brontë', NOW()),
(7, 'Charlotte Brontë', 'Charlotte Brontë', NOW()),
(8, 'Paulo Coelho', 'Paulo Coelho', NOW()),
(9, 'Colleen Hoover', 'Colleen Hoover', NOW()),
(10, 'Haruki Murakami', 'Haruki Murakami', NOW()),
(11, 'J.R.R. Tolkien', 'John Ronald Reuel Tolkien', NOW()),
(12, 'Dan Brown', 'Dan Brown', NOW()),
(13, 'Khaled Hosseini', 'Khaled Hosseini', NOW()),
(14, 'Yoko Ogawa', 'Yoko Ogawa', NOW()),
(15, 'Kazuo Ishiguro', 'Kazuo Ishiguro', NOW());

-- =====================================================
-- PUBLISHERS (NHÀ XUẤT BẢN)
-- =====================================================
INSERT INTO `publishers` (`publisher_id`, `publisher_name`, `created_at`) VALUES
(1, 'Nhà Xuất Bản Giáo Dục', NOW()),
(2, 'Nhà Xuất Bản Trẻ', NOW()),
(3, 'Nhà Xuất Bản Hội Nhà Văn', NOW()),
(4, 'Nhà Xuất Bản Văn Học', NOW()),
(5, 'Nhà Xuất Bản Kim Đồng', NOW()),
(6, 'Nhà Xuất Bản Thanh Niên', NOW()),
(7, 'Nhà Xuất Bản Công An Nhân Dân', NOW()),
(8, 'Nhà Xuất Bản Lao Động', NOW());

-- =====================================================
-- CATEGORIES (DANH MỤC)
-- =====================================================
INSERT INTO `categories` (`category_id`, `category_name`, `parent_id`, `created_at`) VALUES
(1, 'Tiểu Thuyết', NULL, NOW()),
(2, 'Khoa Học Viễn Tưởng', 1, NOW()),
(3, 'Thần Thoại - Huyền Ảo', 1, NOW()),
(4, 'Trinh Thám', 1, NOW()),
(5, 'Tình Yêu', 1, NOW()),
(6, 'Sách Chuyên Khảo', NULL, NOW()),
(7, 'Tiểu Sử', 6, NOW()),
(8, 'Lịch Sử', 6, NOW()),
(9, 'Tự Giúp Bản Thân', 6, NOW()),
(10, 'Sách Thiếu Nhi', NULL, NOW());

-- =====================================================
-- BOOKS (SÁCH) - 50 QUYỂN
-- =====================================================
INSERT INTO `books` (`book_id`, `title`, `isbn`, `language`, `description`, `page_count`, `cover_type`, `stock_quantity`, `price`, `avg_rating`, `sale_percent`, `is_active`, `weight`, `length`, `width`, `height`, `cover_image_url`, `public_id_cover_image`, `publisher_id`, `created_at`) VALUES
(1, '1984', '978-0451524935', 'Tiếng Anh', 'Một tiểu thuyết khoa học viễn tưởng tối tăm về một thế giới độc tài', 328, 'Bìa cứng', 50, 383760, 4.5, 10, 1, 0.5, 25, 18, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778676564/1011-1984-1_etjmnl.jpg', '1011-1984-1_etjmnl', 1, NOW()),
(2, 'Harry Potter và Đôi Chiếc Giày Phù Thủy', '978-0439708180', 'Tiếng Anh', 'Một cậu bé phát hiện mình là pháp sư và bắt đầu cuộc phiêu lưu ma thuật tuyệt vời', 309, 'Bìa cứng', 100, 359760, 4.8, 5, 1, 0.7, 23, 16, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778676431/6fe381fdffaeb4e584a364d9d062fe8e_xkslho.jpg', '6fe381fdffaeb4e584a364d9d062fe8e_xkslho', 2, NOW()),
(3, 'Chiếc Khách Sạn Hành Động', '978-0385121675', 'Tiếng Anh', 'Một tiểu thuyết kinh dị tâm lý kịch tính về điều quỷ quái xảy ra trong một khách sạn biệt lập', 447, 'Bìa mềm', 40, 311760, 4.3, 15, 1, 0.8, 24, 17, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778683536/8935333710277_xoodhh.jpg', '8935333710277_xoodhh', 3, NOW()),
(4, 'Thế Giới Mới Tươi Đẹp', '978-0060085260', 'Tiếng Anh', 'Một tiểu thuyết khoa học viễn tưởng tội ác về một thế giới tương lai thoái hoá', 288, 'Bìa mềm', 60, 335760, 4.2, 20, 1, 0.6, 22, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778677404/1_agmixk.jpg', '1_agmixk', 4, NOW()),
(5, 'Anh Em Những Chiếc Nhẫn Quyền Lực', '978-0544003415', 'Tiếng Anh', 'Quyển đầu tiên của series Chúa Tể Những Chiếc Nhẫn - một hành trình anh hùng đầy sắc thái', 423, 'Bìa cứng', 75, 455760, 4.7, 0, 1, 1.0, 26, 19, 6, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778677632/R.5ec1a2eb8d001018998aebc9aed432c5_psbejg.jpg', 'R.5ec1a2eb8d001018998aebc9aed432c5_psbejg', 5, NOW()),
(6, 'Tự Tin Và Kiếm Sống', '978-0062415684', 'Tiếng Anh', 'Hướng dẫn thực tiễn để xây dựng tự tin và thành công trong cuộc sống', 360, 'Bìa cứng', 45, 335760, 4.4, 12, 1, 0.55, 23, 17, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778677802/nghe-thuat-song-tu-tin-1175107_hwwqlt.jpg', 'nghe-thuat-song-tu-tin-1175107_hwwqlt', 6, NOW()),
(7, 'Chinh Phục Tâm Trí Của Bạn', '978-0735211292', 'Tiếng Anh', 'Các kỹ năng tâm lý để vượt qua những thách thức trong cuộc sống', 400, 'Bìa cứng', 50, 431760, 4.5, 8, 1, 0.7, 24, 18, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778677987/OIP_lvlnet.webp', 'OIP_lvlnet', 7, NOW()),
(8, 'Câu Chuyện về những Người Có Trái Tim Mạnh Mẽ', '978-0544534482', 'Tiếng Anh', 'Những tiểu sử truyền cảm hứng của những người đã vượt qua khó khăn lớn', 298, 'Bìa mềm', 60, 287760, 4.6, 14, 1, 0.65, 22, 16, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778678104/cau-chuyen-tu-trai-tim-pdf_nfdbyd.jpg', 'cau-chuyen-tu-trai-tim-pdf_nfdbyd', 8, NOW()),
(9, 'Thời Gian Thay Đổi - Lịch Sử Thế Giới Hiện Đại', '978-0691165332', 'Tiếng Anh', 'Một phân tích sâu sắc về những sự kiện lịch sử định hình thế giới ngày nay', 520, 'Bìa cứng', 35, 575760, 4.4, 6, 1, 1.1, 27, 20, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778678203/OIP_kye2cr.webp', 'OIP_kye2cr', 1, NOW()),
(10, 'Khám Phá Chính Bản Thân Bạn', '978-0425234052', 'Tiếng Anh', 'Một hành trình tự khám phá để tìm kiếm mục đích trong cuộc sống', 380, 'Bìa cứng', 55, 407760, 4.3, 10, 1, 0.75, 24, 17, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778678303/kham-pha-suc-manh-ban-than_egxhya.jpg', 'kham-pha-suc-manh-ban-than_egxhya', 2, NOW()),
(11, 'Những Cô Gái Có Sự Ưa Thích Độc Đáo', '978-1492660230', 'Tiếng Anh', 'Một câu chuyện tình yêu hiện đại trong thế giới kỹ thuật số', 340, 'Bìa mềm', 65, 311760, 4.5, 7, 1, 0.6, 22, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778678383/OIP_gawl2u.webp', 'OIP_gawl2u', 3, NOW()),
(12, 'Những Kỳ Dị Bên Cạnh Chúng Ta', '978-0698405288', 'Tiếng Anh', 'Một tập hợp những câu chuyện ma quái và bí ẩn kỳ lạ', 290, 'Bìa mềm', 45, 239760, 4.2, 18, 1, 0.55, 21, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778678581/b57e3a61604ab33985aee25d82bad0f2_eeopox.jpg', 'b57e3a61604ab33985aee25d82bad0f2_eeopox', 4, NOW()),
(13, 'Hành Trình Tìm Kiếm Ý Nghĩa', '978-0062701671', 'Tiếng Anh', 'Khám phá các triết lý cổ đại và hiện đại để tìm ý nghĩa trong cuộc sống', 420, 'Bìa cứng', 40, 455760, 4.6, 9, 1, 0.85, 25, 19, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778678695/2021_05_17_16_36_20_1-390x510_znt8ql.jpg', '2021_05_17_16_36_20_1-390x510_znt8ql', 5, NOW()),
(14, 'Một Ngàn Và Một Đêm', '978-0141044742', 'Tiếng Anh', 'Những câu chuyện chuẩn bị từ các nền văn hóa Trung Đông cổ đại', 656, 'Bìa cứng', 30, 595760, 4.4, 5, 1, 1.3, 28, 21, 6, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778678786/OIP_ch9hoq.webp', 'OIP_ch9hoq', 6, NOW()),
(15, 'Núi Gió - Cuốn Tiểu Thuyết Kỳ Ảo', '978-0062885837', 'Tiếng Anh', 'Một câu chuyện quy mô lớn về tình yêu, chiến tranh và sự yên bình', 480, 'Bìa cứng', 50, 551760, 4.7, 3, 1, 0.95, 26, 20, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778678881/9786049952074_gkxsla.jpg', '9786049952074_gkxsla', 7, NOW()),
(16, 'Những Bộ Sưu Tập Lạ Kỳ', '978-0061357725', 'Tiếng Anh', 'Những câu chuyện độc lập nhưng liên kết bởi những chủ đề toàn vũ trụ', 350, 'Bìa mềm', 55, 287760, 4.3, 11, 1, 0.65, 23, 16, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778678989/51MXGXBhDEL._SX218_BO1_204_203_200_QL40_ML2__wldkem.jpg', '51MXGXBhDEL._SX218_BO1_204_203_200_QL40_ML2__wldkem', 8, NOW()),
(17, 'Sự Biến Mất Của Bố', '978-0062885388', 'Tiếng Anh', 'Một nghiên cứu về cha hay và sự vắng mặt của họ trong cuộc sống hiện đại', 425, 'Bìa cứng', 45, 407760, 4.5, 7, 1, 0.8, 24, 18, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778679208/581d4c2ef9c2d875296fde50f24af21b_u5rjff.jpg', '581d4c2ef9c2d875296fde50f24af21b_u5rjff', 1, NOW()),
(18, 'Những Người Bạn Tốt Nên Biết', '978-0544495708', 'Tiếng Anh', 'Hướng dẫn để tìm und phát triển những mối quan hệ ý nghĩa', 390, 'Bìa cứng', 50, 383760, 4.6, 8, 1, 0.7, 23, 17, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778679302/nhung-nguoi-ban-tu-trang-sach_bia_xalouw.jpg', 'nhung-nguoi-ban-tu-trang-sach_bia_xalouw', 2, NOW()),
(19, 'Theo Dõi Những Điều Bình Thường', '978-0062701649', 'Tiếng Anh', 'Các tiểu sử về những người bình thường đã làm điều bất thường', 450, 'Bìa cứng', 40, 431760, 4.4, 6, 1, 0.85, 25, 19, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778679383/nhat-trinh-phi-thuong-cua-nhung-dieu-binh-thuong_l1ddkd.jpg', 'nhat-trinh-phi-thuong-cua-nhung-dieu-binh-thuong_l1ddkd', 3, NOW()),
(20, 'Những Riêng Tư Của Một Bí Mật', '978-0544534529', 'Tiếng Anh', 'Một triết lý về cách giữ bí mật và những gì nó có nghĩa đối với chúng ta', 380, 'Bìa mềm', 55, 335760, 4.3, 9, 1, 0.7, 22, 16, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778679464/OIP_cwnkyn.webp', 'OIP_cwnkyn', 4, NOW()),
(21, 'Âm Mưu Của Những Sao Lạ', '978-0385495097', 'Tiếng Anh', 'Một câu chuyện khoa học viễn tưởng về những sao lạ và những bí mật của vũ trụ', 510, 'Bìa cứng', 35, 479760, 4.5, 4, 1, 0.95, 26, 20, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778679538/OIP_uzkzq6.webp', 'OIP_uzkzq6', 5, NOW()),
(22, 'Những Tay Sư Phù Thủy', '978-0062357786', 'Tiếng Anh', 'Một cuốn sách về những ngoại lệ thần kỳ và những bí mật của họ', 470, 'Bìa cứng', 50, 455760, 4.6, 5, 1, 0.9, 25, 19, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778679644/OIP_lhuwpf.webp', 'OIP_lhuwpf', 6, NOW()),
(23, 'Đêm Kỳ Dị', '978-0544334014', 'Tiếng Anh', 'Một tuyển tập những câu chuyện kinh dị bắt đầu vào ban đêm', 340, 'Bìa mềm', 60, 287760, 4.2, 12, 1, 0.65, 22, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778679725/fee59d8b086096f784c61d9b51d3f3d2_sd8cyd.jpg', 'fee59d8b086096f784c61d9b51d3f3d2_sd8cyd', 7, NOW()),
(24, 'Triết Lý Cho Tất Cả Mọi Người', '978-0062701656', 'Tiếng Anh', 'Giới thiệu các đại cuộc triết học với những ví dụ dễ hiểu từ cuộc sống hàng ngày', 420, 'Bìa cứng', 45, 407760, 4.4, 7, 1, 0.8, 24, 18, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778679820/triet_ly_lam_giau_cua_nguoi_do_thai_9b27f7c4b5_mxjrpc.jpg', 'triet_ly_lam_giau_cua_nguoi_do_thai_9b27f7c4b5_mxjrpc', 8, NOW()),
(25, 'Những Lá Thư Từ Quá Khứ', '978-0544334021', 'Tiếng Anh', 'Một tiểu thuyết epistolary về tình yêu và sự mất mát', 380, 'Bìa cứng', 50, 359760, 4.5, 8, 1, 0.75, 23, 17, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778679911/d083c33421e5605fd9fa32df23ff0457_czdpvq.jpg', 'd083c33421e5605fd9fa32df23ff0457_czdpvq', 1, NOW()),
(26, 'Giai Đoạn Nàng Tuổi Trẻ', '978-0062701732', 'Tiếng Anh', 'Hướng dẫn giáo dục về việc chấp nhận những thay đổi của tuổi trẻ', 350, 'Bìa mềm', 65, 311760, 4.3, 10, 1, 0.6, 22, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778680065/nhat-ky-truong-thanh-cua-dua-con-ngoan-thoi-quen-xau-tam-biet-nhe-pdf-1_cfjkcq.jpg', 'nhat-ky-truong-thanh-cua-dua-con-ngoan-thoi-quen-xau-tam-biet-nhe-pdf-1_cfjkcq', 2, NOW()),
(27, 'Bí Ẩn Của Những Cây Cổ', '978-0544334039', 'Tiếng Anh', 'Một khám phá khoa học về những bí mật của thiên nhiên', 440, 'Bìa cứng', 40, 431760, 4.7, 3, 1, 0.85, 25, 19, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778680180/082792fad8dbc8363ab131c846c2c930_ipirbo.jpg', '082792fad8dbc8363ab131c846c2c930_ipirbo', 3, NOW()),
(28, 'Tôi Là Ai Thực Sự', '978-0062701740', 'Tiếng Anh', 'Một cuốn sách về khám phá bản sắc cá nhân và việc chấp nhận bản thân', 410, 'Bìa cứng', 55, 383760, 4.4, 6, 1, 0.75, 24, 18, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778680261/8935235218826_hdtohk.jpg', '8935235218826_hdtohk', 4, NOW()),
(29, 'Lịch Sử Của Một Tình Yêu', '978-0544334047', 'Tiếng Anh', 'Một tiểu thuyết lịch sử về những cặp đôi nổi tiếng trong lịch sử', 520, 'Bìa cứng', 35, 575760, 4.5, 5, 1, 1.0, 26, 20, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778680336/ZxzBJGTR_mqzi1g.jpg', 'ZxzBJGTR_mqzi1g', 5, NOW()),
(30, 'Những Thành Tích Vô Hình', '978-0062701748', 'Tiếng Anh', 'Những tiểu sử về những người đã thay đổi thế giới nhưng ít được biết đến', 480, 'Bìa cứng', 50, 455760, 4.6, 4, 1, 0.9, 25, 19, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778680495/OIP_lxy6a0.webp', 'OIP_lxy6a0', 6, NOW()),
(31, 'Hành Trình Không Hồi Lại', '978-0544334054', 'Tiếng Anh', 'Một tiểu thuyết phiêu lưu về một nhóm người cố gắng trở về nhà', 450, 'Bìa cứng', 45, 431760, 4.3, 7, 1, 0.85, 25, 19, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778680655/bbf4974a0e3548e7ccf604de18ad1c1c_zlpclk.jpg', 'bbf4974a0e3548e7ccf604de18ad1c1c_zlpclk', 7, NOW()),
(32, 'Những Nài Của Tình Yêu', '978-0062701755', 'Tiếng Anh', 'Những câu chuyện lãng mạn từ các nước khác nhau', 380, 'Bìa mềm', 60, 335760, 4.4, 9, 1, 0.7, 23, 16, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'bbf4974a0e3548e7ccf604de18ad1c1c_zlpclk', 8, NOW()),
(33, 'Những Điểm Mù Của Thị Giác', '978-0544334062', 'Tiếng Anh', 'Khám phá những điều bị ẩn giấu trong tâm trí chúng ta', 400, 'Bìa cứng', 50, 407760, 4.5, 6, 1, 0.8, 24, 18, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778680846/R_x9hqcw.jpg', 'R_x9hqcw', 1, NOW()),
(34, 'Sách Yêu Thương Cho Trẻ Em', '978-0062701762', 'Tiếng Anh', 'Một tuyển tập những câu chuyện cho lũ trẻ', 320, 'Bìa cứng', 70, 263760, 4.7, 15, 1, 0.6, 21, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778680959/OIP_cucb99.webp', 'OIP_cucb99', 2, NOW()),
(35, 'Lý Thuyết Về Mọi Vật', '978-0544334070', 'Tiếng Anh', 'Một hành trình qua các lĩnh vực khoa học khác nhau', 540, 'Bìa cứng', 30, 599760, 4.4, 4, 1, 1.05, 27, 20, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778681136/image-20221012114323663_f9jxsr.jpg', 'image-20221012114323663_f9jxsr', 3, NOW()),
(36, 'Tôi Chưa Bao Giờ Nói Không', '978-0062701769', 'Tiếng Anh', 'Một hướng dẫn đặt ranh giới trong cuộc sống cá nhân và chuyên nghiệp', 370, 'Bìa cứng', 55, 359760, 4.5, 8, 1, 0.7, 23, 17, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778681501/XL_ckynxx.png', 'XL_ckynxx', 4, NOW()),
(37, 'Những Bông Hoa Lạ Lẫm', '978-0544334088', 'Tiếng Anh', 'Một tiểu thuyết lãng mạn tấn công thiên nhiên', 460, 'Bìa cứng', 45, 455760, 4.6, 5, 1, 0.85, 25, 19, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778681751/the-gioi-trong-mat-be_nhung-bong-hoa-ruc-ro_bia_ecbdzq.jpg', 'the-gioi-trong-mat-be_nhung-bong-hoa-ruc-ro_bia_ecbdzq', 5, NOW()),
(38, 'Cùng Làm Một Thế Giới Tốt Hơn', '978-0062701776', 'Tiếng Anh', 'Hành động và hành động cụ thể để tạo ra sự thay đổi khí hậu', 420, 'Bìa cứng', 50, 407760, 4.3, 7, 1, 0.8, 24, 18, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778681953/9d1c477c1c9d0289270d5487441cbeb2_cw7afl.jpg', '9d1c477c1c9d0289270d5487441cbeb2_cw7afl', 6, NOW()),
(39, 'Những Trái Tim Tăm Tối', '978-0544334095', 'Tiếng Anh', 'Một tiểu thuyết ma quái về những bí mật gia đình', 480, 'Bìa cứng', 40, 479760, 4.4, 6, 1, 0.9, 25, 19, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778682114/1191-atlas-of-the-heart-bg-30a_vpdsvv.webp', '1191-atlas-of-the-heart-bg-30a_vpdsvv', 7, NOW()),
(40, 'Các Nàng Thợ Dệt', '978-0062701783', 'Tiếng Anh', 'Một tiểu thuyết về sức mạnh của phụ nữ và công việc của họ', 410, 'Bìa cứng', 55, 383760, 4.5, 8, 1, 0.75, 24, 18, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778682210/muse-1-664x1024_i8nw5x.jpg', 'muse-1-664x1024_i8nw5x', 8, NOW()),
(41, 'Cơn Hủy Diệt Của Tâm Trí', '978-0544334102', 'Tiếng Anh', 'Khám phá cách chúng ta tự phá hủy mình', 390, 'Bìa mềm', 60, 335760, 4.2, 10, 1, 0.7, 22, 16, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778682289/b_a-1_8_4_mpfrnw.jpg', 'b_a-1_8_4_mpfrnw', 1, NOW()),
(42, 'Chiến Tranh Dân Tộc', '978-0062701790', 'Tiếng Anh', 'Một lịch sử toàn diện về các cuộc chiến tranh vì độc lập', 560, 'Bìa cứng', 35, 623760, 4.6, 3, 1, 1.1, 28, 21, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778682364/OIP_bv9rea.webp', 'OIP_bv9rea', 2, NOW()),
(43, 'Àng Yêu Con Người Đầy Lỗi Lầm', '978-0544334110', 'Tiếng Anh', 'Một tiểu thuyết lãng mạn tâm lý về tình yêu sau khiếm khuyết', 440, 'Bìa cứng', 50, 431760, 4.5, 6, 1, 0.85, 25, 19, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778682456/O8z8kdI0M1h4YKUM5l6AoLGg2IVyi6f5AsQix3OK-WilP3735GK3jKAscmByUpaG55zzHit2OHgKt-yLQtA2h6wCEHHQ2uFgz0qbywEBDErHDfTLZY4fFQIjJKzcIkNZ_FM6DUU21izB9s8ZL4L7FtE_kkx9iu.png', 'O8z8kdI0M1h4YKUM5l6AoLGg2IVyi6f5AsQix3OK-WilP3735GK3jKAscmByUpaG55zzHit2OHgKt-yLQtA2h6wCEHHQ2uFgz0qbywEBDErHDfTLZY4fFQIjJKzcIkNZ_FM6DUU21izB9s8ZL4L7FtE_kkx9iu', 3, NOW()),
(44, 'Những Bí Mật Của Vũ Trụ', '978-0062701807', 'Tiếng Anh', 'Khám phá những điều lạ kỳ nhất về vũ trụ của chúng ta', 500, 'Bìa cứng', 40, 527760, 4.7, 4, 1, 0.95, 26, 20, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778682598/bi-mat-vu-tru-f6645b20_ppmckz.jpg', 'bi-mat-vu-tru-f6645b20_ppmckz', 4, NOW()),
(45, 'Sống Một Cuộc Sống Tối Giản', '978-0544334128', 'Tiếng Anh', 'Hướng dẫn sống với ít hơn và hạnh phúc hơn', 360, 'Bìa cứng', 60, 335760, 4.4, 9, 1, 0.7, 23, 17, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778682715/OIP_y1vv8s.webp', 'OIP_y1vv8s', 5, NOW()),
(46, 'Những Mơ Ước Vô Hạn', '978-0062701814', 'Tiếng Anh', 'Một tiểu thuyết khoa học viễn tưởng về những thế giới song song', 510, 'Bìa cứng', 35, 575760, 4.5, 5, 1, 0.95, 26, 20, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778682994/nhung-buoc-don-gian-den-uoc-mo_e5je2t.jpg', 'nhung-buoc-don-gian-den-uoc-mo_e5je2t', 6, NOW()),
(47, 'Chào Mừng Đến Nước Kỳ Diệu', '978-0544334135', 'Tiếng Anh', 'Một tiểu thuyết phiêu lưu huyền ảo cho trẻ em', 380, 'Bìa cứng', 70, 359760, 4.6, 12, 1, 0.7, 23, 17, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778683057/OIP_xqwfao.webp', 'OIP_xqwfao', 7, NOW()),
(48, 'Cuộc Chiến Chống Lại Tuyệt Vọng', '978-0062701821', 'Tiếng Anh', 'Hướng dẫn tâm lý để vượt qua trầm cảm và lo âu', 420, 'Bìa cứng', 55, 407760, 4.3, 8, 1, 0.8, 24, 18, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778683128/9786326040463_dxyube.jpg', '9786326040463_dxyube', 8, NOW()),
(49, 'Những Tóc Vàng Lạ Lùng', '978-0544334143', 'Tiếng Anh', 'Một tiểu thuyết kỳ diệu về sức mạnh của nhan sắc', 470, 'Bìa cứng', 48, 455760, 4.5, 6, 1, 0.9, 25, 19, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778683238/419ftyJkQiL._SY445_SX342__z74vws.jpg', '419ftyJkQiL._SY445_SX342__z74vws', 1, NOW()),
(50, 'Tự Do Là Một Lựa Chọn', '978-0062701828', 'Tiếng Anh', 'Một cuốn sách triết lý về tự do và trách nhiệm', 400, 'Bìa cứng', 50, 407760, 4.4, 7, 1, 0.8, 24, 18, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778683363/f8d701b4e225eed9ca19abec68570f42_nig3sc.jpg', 'f8d701b4e225eed9ca19abec68570f42_nig3sc', 2, NOW());

-- =====================================================
-- BOOK_IMGS (HÌNH ẢNH SÁCH)
-- Tất cả ảnh đều trỏ về ảnh mặc định trong resources/static/imgs/books/book_default.jpg
-- Khi chạy app (context-path=/bookstore), ảnh này sẽ được serve tại: /bookstore/imgs/books/book_default.jpg
-- =====================================================
INSERT INTO `book_imgs` (`book_img_id`, `img_url`, `public_id`, `book_id`, `created_at`) VALUES
(1,  '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778683650/a8171a9cb5ac948914f1f861af67f878_bhbom6.jpg', 'a8171a9cb5ac948914f1f861af67f878_bhbom6', 1,  NOW()),
(2,  '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778683755/2022_12_09_10_30_42_6-390x510_fgvkls.jpg', '2022_12_09_10_30_42_6-390x510_fgvkls', 2,  NOW()),
(3,  '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778683824/sach-kinh-doanh-khach-san-1_bygg9b.jpg', 'sach-kinh-doanh-khach-san-1_bygg9b', 3,  NOW()),
(4,  '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778683912/31100630905_3_wqkqvu.jpg', '31100630905_3_wqkqvu', 4,  NOW()),
(5,  '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778683985/OIP_cluvek.webp', 'OIP_cluvek', 5,  NOW()),
(6,  '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684062/9c13aa0bffe7edbc745b7d91073c4fe5_vfabpm.jpg', '9c13aa0bffe7edbc745b7d91073c4fe5_vfabpm', 6,  NOW()),
(7,  '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684136/image_188919_a94d3ddd3dda42e0bc0c83fd153f52c9_master_a65rfz.jpg', 'image_188919_a94d3ddd3dda42e0bc0c83fd153f52c9_master_a65rfz', 7,  NOW()),
(8,  '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684198/OIP_a6rrmp.webp', 'OIP_a6rrmp', 8,  NOW()),
(9,  '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684274/2023_11_30_16_30_43_3-390x510_yswrwk.jpg', '2023_11_30_16_30_43_3-390x510_yswrwk', 9,  NOW()),
(10, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684334/OIP_enjpd3.webp', 'OIP_enjpd3', 10, NOW()),
(11, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684405/OIP_fcqjen.webp', 'OIP_fcqjen', 11, NOW()),
(12, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684477/OIP_yxr1fl.webp', 'OIP_yxr1fl', 12, NOW()),
(13, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684538/OIP_gw36es.webp', 'OIP_gw36es', 13, NOW()),
(14, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684608/OIP_izh5q2.webp', 'OIP_izh5q2', 14, NOW()),
(15, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684697/e89c4e18922fbfba7156d1a0517e2ca7_fac0rd.jpg', 'e89c4e18922fbfba7156d1a0517e2ca7_fac0rd', 15, NOW()),
(16, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684770/anh-mo-ta_f6sbb0.png', 'anh-mo-ta_f6sbb0', 16, NOW()),
(17, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684841/5bd9f0f29c3a787368414aa567a73604_drkiwy.jpg', '5bd9f0f29c3a787368414aa567a73604_drkiwy', 17, NOW()),
(18, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684902/OIP_rqv7sz.webp', 'OIP_rqv7sz', 18, NOW()),
(19, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778684982/dieu-binh-thuong-la-co-mot-nguoi-thuong_teu6cl.jpg', 'dieu-binh-thuong-la-co-mot-nguoi-thuong_teu6cl', 19, NOW()),
(20, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778685056/OIP_zhsuht.webp', 'OIP_zhsuht', 20, NOW()),
(21, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778685134/OIP_ewzxp4.webp', 'OIP_ewzxp4', 21, NOW()),
(22, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778685196/OIP_trcv4j.webp', 'OIP_trcv4j', 22, NOW()),
(23, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778685270/OIP_spo46x.webp', 'OIP_spo46x', 23, NOW()),
(24, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778685343/OIP_qmaddm.webp', 'OIP_qmaddm', 24, NOW()),
(25, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778685405/3d37e237feecfa2ddbe321b6a19ebf28_p0tx8b.jpg', '3d37e237feecfa2ddbe321b6a19ebf28_p0tx8b', 25, NOW()),
(26, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778685465/OIP_vfy8nc.webp', 'OIP_vfy8nc', 26, NOW()),
(27, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778685538/12ac5863147db5fbd250bbf9e214fe8a_mmbohe.jpg', '12ac5863147db5fbd250bbf9e214fe8a_mmbohe', 27, NOW()),
(28, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778685613/ddfc5b673940c2cfa4320cb4cc429e41_ym5ptu.jpg', 'ddfc5b673940c2cfa4320cb4cc429e41_ym5ptu', 28, NOW()),
(29, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778685680/OIP_kbmfg2.webp', 'OIP_kbmfg2', 29, NOW()),
(30, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778685821/OIP_l17wo9.webp', 'OIP_l17wo9', 30, NOW()),
(31, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778685880/6b25698b71bb075a09cbab703c96011b_npg4qk.jpg', '6b25698b71bb075a09cbab703c96011b_npg4qk', 31, NOW()),
(32, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778685967/719kFvvozAL._SY342__n0bgsp.jpg', '719kFvvozAL._SY342__n0bgsp', 32, NOW()),
(33, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686025/OIP_wjaejo.webp', 'OIP_wjaejo', 33, NOW()),
(34, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686084/OIP_rks3fh.webp', 'OIP_rks3fh', 34, NOW()),
(35, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686144/OIP_q9zdeg.webp', 'OIP_q9zdeg', 35, NOW()),
(36, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686203/tbph_3_dm5oke.png', 'tbph_3_dm5oke', 36, NOW()),
(37, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686256/0843f87fd67207ccf3e912a9d11efa4c_xz8x8v.jpg', '0843f87fd67207ccf3e912a9d11efa4c_xz8x8v', 37, NOW()),
(38, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686330/quan-ly-mo-lam-viec-tot-hon-vi-mot-the-gioi-tot-hon-02_chsqh2.jpg', 'quan-ly-mo-lam-viec-tot-hon-vi-mot-the-gioi-tot-hon-02_chsqh2', 38, NOW()),
(39, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686407/6ac0081dc3fe36062907d2a44c9b3a80_aiwvse.jpg', '6ac0081dc3fe36062907d2a44c9b3a80_aiwvse', 39, NOW()),
(40, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686461/sg-11134201-7qvdt-li029i12nihe29_ydb2og.jpg', 'sg-11134201-7qvdt-li029i12nihe29_ydb2og', 40, NOW()),
(41, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686530/2021_06_23_16_14_47_6-390x510_h6hf4t.jpg', '2021_06_23_16_14_47_6-390x510_h6hf4t', 41, NOW()),
(42, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686615/OIP_k6ac4n.webp', 'OIP_k6ac4n', 42, NOW()),
(43, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686677/viet-gi-khi-tang-sach-cho-nguoi-yeu-8_xzo20v.jpg', 'viet-gi-khi-tang-sach-cho-nguoi-yeu-8_xzo20v', 43, NOW()),
(44, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686736/bi-mat-vu-tru-pdf_selvff.jpg', 'bi-mat-vu-tru-pdf_selvff', 44, NOW()),
(45, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686792/OIP_qgj2yr.webp', 'OIP_qgj2yr', 45, NOW()),
(46, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686883/top-5-cuon-sach-hay-ve-uoc-mo-truyen-cam-hung-giup-ban-tre-theo-duoi-dam-me-3_cmu5op.jpg', 'top-5-cuon-sach-hay-ve-uoc-mo-truyen-cam-hung-giup-ban-tre-theo-duoi-dam-me-3_cmu5op', 46, NOW()),
(47, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778686955/OIP_esa6eu.webp', 'OIP_esa6eu', 47, NOW()),
(48, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778687024/d690be0c355389e49493bd800b7c5a40_s33wdn.jpg', 'd690be0c355389e49493bd800b7c5a40_s33wdn', 48, NOW()),
(49, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778687096/vn-11134201-23030-k35rchbopmova2_h2keie.jpg', 'vn-11134201-23030-k35rchbopmova2_h2keie', 49, NOW()),
(50, '/https://res.cloudinary.com/duqhdj1ff/image/upload/v1778687160/vn-11134207-7ras8-m0f2zhzqn2el76_zxiab7.jpg', 'vn-11134207-7ras8-m0f2zhzqn2el76_zxiab7', 50, NOW());

-- =====================================================
-- BOOK_AUTHOR (GÁN TÁC GIẢ CHO SÁCH)
-- =====================================================
INSERT INTO `book_author` (`book_id`, `author_id`) VALUES
(1, 1), (2, 2), (3, 3), (4, 1), (5, 11), (6, 8), (7, 9), (8, 10), (9, 5), (10, 4),
(11, 9), (12, 3), (13, 8), (14, 1), (15, 2), (16, 10), (17, 11), (18, 4), (19, 5), (20, 6),
(21, 7), (22, 2), (23, 3), (24, 8), (25, 9), (26, 10), (27, 11), (28, 1), (29, 4), (30, 5),
(31, 6), (32, 7), (33, 2), (34, 3), (35, 8), (36, 9), (37, 10), (38, 11), (39, 1), (40, 4),
(41, 5), (42, 6), (43, 7), (44, 2), (45, 3), (46, 8), (47, 9), (48, 10), (49, 11), (50, 1);

-- =====================================================
-- BOOK_CATEGORY (PHÂN LOẠI SÁCH)
-- =====================================================
INSERT INTO `book_category` (`book_id`, `category_id`) VALUES
(1, 1), (1, 2), (2, 3), (2, 10), (3, 4), (4, 1), (4, 2), (5, 3),
(6, 6), (6, 9), (7, 6), (8, 7), (9, 8), (10, 6), (11, 5), (12, 4),
(13, 6), (14, 3), (15, 5), (16, 1), (17, 7), (18, 6), (19, 7), (20, 6),
(21, 2), (22, 3), (23, 4), (24, 6), (25, 5), (26, 6), (27, 1), (28, 6),
(29, 5), (30, 7), (31, 1), (32, 5), (33, 6), (34, 10), (35, 2), (36, 6),
(37, 5), (38, 6), (39, 4), (40, 7), (41, 6), (42, 8), (43, 5), (44, 2),
(45, 6), (46, 2), (47, 3), (47, 10), (48, 6), (49, 5), (50, 6);

-- =====================================================
-- CARTS (GIỎ HÀNG)
-- =====================================================
INSERT INTO `carts` (`cart_id`, `user_id`, `created_at`) VALUES
(1, 12, NOW()), (2, 13, NOW()), (3, 14, NOW()), (4, 15, NOW()), (5, 16, NOW()),
(6, 17, NOW()), (7, 18, NOW()), (8, 19, NOW()), (9, 20, NOW()), (10, 21, NOW()),
(11, 22, NOW()), (12, 23, NOW()), (13, 24, NOW()), (14, 25, NOW());

-- =====================================================
-- BOOK_CART (CÁC SÁCH TRONG GIỎ)
-- =====================================================
INSERT INTO `book_cart` (`book_cart_id`, `quantity`, `book_id`, `cart_id`, `created_at`) VALUES
(1, 2, 1, 1, NOW()), (2, 1, 15, 1, NOW()), (3, 3, 25, 2, NOW()), (4, 1, 35, 2, NOW()),
(5, 2, 5, 3, NOW()), (6, 1, 10, 3, NOW()), (7, 1, 20, 4, NOW()), (8, 2, 30, 5, NOW()),
(9, 3, 40, 6, NOW()), (10, 1, 45, 7, NOW()), (11, 2, 7, 8, NOW()), (12, 1, 17, 9, NOW()),
(13, 2, 27, 10, NOW()), (14, 1, 37, 11, NOW()), (15, 3, 47, 12, NOW()), (16, 1, 2, 13, NOW()),
(17, 2, 12, 14, NOW()), (18, 1, 22, 1, NOW()), (19, 2, 32, 2, NOW()), (20, 1, 42, 3, NOW());

-- =====================================================
-- VOUCHERS (MÃ GIẢM GIÁ)
-- =====================================================
INSERT INTO `vouchers` (`voucher_id`, `voucher_code`, `title`, `description`, `type`, `discount_value`, `min_order_value`, `start_date`, `end_date`, `total_limit`, `limit_per_user`, `is_active`, `created_at`) VALUES
(1, 'GIAM10', 'Giảm 10%', 'Giảm 10% cho tất cả các sách', 'PERCENTAGE', 10, 1200000, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 100, 1, 1, NOW()),
(2, 'TIET50', 'Tiết kiệm 50k', 'Giảm 50,000 VNĐ cho đơn hàng', 'FIXED', 50000, 1200000, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 150, 2, 1, NOW()),
(3, 'WELCOME15', 'Chào Mừng 15%', 'Giảm 15% cho khách mua lần đầu', 'PERCENTAGE', 15, 1200000, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 200, 1, 1, NOW()),
(4, 'HE20', 'Hè 20%', 'Khuyến mãi mùa hè 20%', 'PERCENTAGE', 20, 1500000, NOW(), DATE_ADD(NOW(), INTERVAL 45 DAY), 80, 1, 1, NOW()),
(5, 'THANK5', 'Cảm ơn 5%', 'Lợi nhuận khách hàng 5%', 'PERCENTAGE', 5, 800000, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), 300, 3, 1, NOW());

-- =====================================================
-- ORDERS (ĐƠN HÀNG)
-- =====================================================
INSERT INTO `orders` (`order_id`, `status`, `vat_rate`, `total_amount`, `customer_id`, `created_at`) VALUES
(1, 'PENDING', 0.05, 6000000, 12, NOW()),
(2, 'PENDING', 0.05, 5500000, 13, NOW()),
(3, 'CONFIRMED', 0.05, 7200000, 14, NOW()),
(4, 'CONFIRMED', 0.05, 6800000, 15, NOW()),
(5, 'SHIPPING', 0.05, 9000000, 16, NOW()),
(6, 'SHIPPING', 0.05, 5400000, 17, NOW()),
(7, 'DELIVERED', 0.05, 11000000, 18, NOW()),
(8, 'DELIVERED', 0.05, 6200000, 19, NOW()),
(9, 'COMPLETED', 0.05, 8500000, 20, NOW()),
(10, 'COMPLETED', 0.05, 7100000, 21, NOW()),
(11, 'PENDING', 0.05, 6500000, 22, NOW()),
(12, 'CONFIRMED', 0.05, 5900000, 23, NOW()),
(13, 'SHIPPING', 0.05, 9500000, 24, NOW()),
(14, 'DELIVERED', 0.05, 8000000, 25, NOW()),
(15, 'COMPLETED', 0.05, 10200000, 12, NOW()),
(16, 'PENDING', 0.05, 6300000, 13, NOW()),
(17, 'CONFIRMED', 0.05, 7800000, 14, NOW()),
(18, 'SHIPPING', 0.05, 5600000, 15, NOW()),
(19, 'DELIVERED', 0.05, 9200000, 16, NOW()),
(20, 'COMPLETED', 0.05, 8800000, 17, NOW());

-- =====================================================
-- SHIPMENTS (VẬN CHUYỂN)
-- Lưu ý: server.servlet.context-path=/bookstore nên img_url ở book_imgs đã có prefix /bookstore
-- Ở đây seed tối giản: gán shipment cho từng order + địa chỉ của customer (address_id = customer_id - 1)
-- =====================================================
INSERT INTO `shipments` (`shipment_id`, `status`, `order_id`, `address_id`, `weight`, `length`, `width`, `height`, `created_at`) VALUES
(1,  'PENDING',  1,  11, 1.0, 25, 18, 10, NOW()),
(2,  'PENDING',  2,  12, 1.0, 25, 18, 10, NOW()),
(3,  'READY_TO_SHIP', 3,  13, 1.0, 25, 18, 10, NOW()),
(4,  'READY_TO_SHIP', 4,  14, 1.0, 25, 18, 10, NOW()),
(5,  'IN_TRANSIT', 5,  15, 1.0, 25, 18, 10, NOW()),
(6,  'IN_TRANSIT', 6,  16, 1.0, 25, 18, 10, NOW()),
(7,  'DELIVERED', 7,  17, 1.0, 25, 18, 10, NOW()),
(8,  'DELIVERED', 8,  18, 1.0, 25, 18, 10, NOW()),
(9,  'DELIVERED', 9,  19, 1.0, 25, 18, 10, NOW()),
(10, 'DELIVERED', 10, 20, 1.0, 25, 18, 10, NOW()),
(11, 'PENDING',  11, 21, 1.0, 25, 18, 10, NOW()),
(12, 'READY_TO_SHIP', 12, 22, 1.0, 25, 18, 10, NOW()),
(13, 'IN_TRANSIT', 13, 23, 1.0, 25, 18, 10, NOW()),
(14, 'DELIVERED', 14, 24, 1.0, 25, 18, 10, NOW()),
(15, 'DELIVERED', 15, 11, 1.0, 25, 18, 10, NOW()),
(16, 'PENDING',  16, 12, 1.0, 25, 18, 10, NOW()),
(17, 'READY_TO_SHIP', 17, 13, 1.0, 25, 18, 10, NOW()),
(18, 'IN_TRANSIT', 18, 14, 1.0, 25, 18, 10, NOW()),
(19, 'DELIVERED', 19, 15, 1.0, 25, 18, 10, NOW()),
(20, 'DELIVERED', 20, 16, 1.0, 25, 18, 10, NOW());

-- =====================================================
-- PAYMENTS (THANH TOÁN)
-- Seed tối giản: mỗi order có 1 payment COD với amount = total_amount
-- =====================================================
INSERT INTO `payments` (`payment_id`, `amount`, `method`, `status`, `order_id`, `created_at`) VALUES
(1,  6000000, 'COD', 'PENDING',   1,  NOW()),
(2,  5500000, 'COD', 'PENDING',   2,  NOW()),
(3,  7200000, 'COD', 'PENDING',   3,  NOW()),
(4,  6800000, 'COD', 'PENDING',   4,  NOW()),
(5,  9000000, 'COD', 'PENDING',   5,  NOW()),
(6,  5400000, 'COD', 'PENDING',   6,  NOW()),
(7,  11000000,'COD', 'SUCCESS',   7,  NOW()),
(8,  6200000, 'COD', 'SUCCESS',   8,  NOW()),
(9,  8500000, 'COD', 'SUCCESS',   9,  NOW()),
(10, 7100000, 'COD', 'SUCCESS',   10, NOW()),
(11, 6500000, 'COD', 'PENDING',   11, NOW()),
(12, 5900000, 'COD', 'PENDING',   12, NOW()),
(13, 9500000, 'COD', 'PENDING',   13, NOW()),
(14, 8000000, 'COD', 'SUCCESS',   14, NOW()),
(15, 10200000,'COD', 'SUCCESS',   15, NOW()),
(16, 6300000, 'COD', 'PENDING',   16, NOW()),
(17, 7800000, 'COD', 'PENDING',   17, NOW()),
(18, 5600000, 'COD', 'PENDING',   18, NOW()),
(19, 9200000, 'COD', 'SUCCESS',   19, NOW()),
(20, 8800000, 'COD', 'SUCCESS',   20, NOW());

-- =====================================================
-- BOOK_ORDER (CHI TIẾT ĐƠN HÀNG - CÓ ĐÁNH GIÁ)
-- =====================================================
INSERT INTO `book_order` (`book_order_id`, `quantity`, `unit`, `rate`, `content`, `book_id`, `order_id`, `created_at`) VALUES
-- 1 STAR (Rất không hài lòng) - 2 items`
(1, 2, 'quyển', NULL, NULL, 1, 1, NOW()),
(2, 1, 'quyển', NULL, NULL, 15, 1, NOW()),
-- 2 STARS (Không hài lòng) - 3 items
(3, 3, 'quyển', NULL, NULL, 25, 2, NOW()),
(4, 1, 'quyển', NULL, NULL, 35, 2, NOW()),
(5, 2, 'quyển', NULL, NULL, 5, 3, NOW()),
-- 3 STARS (Bình thường) - 4 items
(6, 1, 'quyển', NULL, NULL, 10, 3, NOW()),
(7, 1, 'quyển', NULL, NULL, 20, 4, NOW()),
(8, 2, 'quyển', NULL, NULL, 30, 5, NOW()),
(9, 3, 'quyển', NULL, NULL, 40, 6, NOW()),
-- 4 STARS (Hài lòng) - 5 items
(10, 1, 'quyển', 4, 'Hay, nhân vật thú vị, mặc dù kết thúc hơi nhanh!', 45, 7, NOW()),
(11, 2, 'quyển', 4, 'Rất hay, tôi thích nó nhưng có nhược điểm nhỏ!', 7, 8, NOW()),
(12, 1, 'quyển', 4, 'Tốt, nội dung hấp dẫn nhưng hơi dài một chút!', 17, 9, NOW()),
(13, 2, 'quyển', 4, 'Hay lắm, tôi sẽ giới thiệu cho bạn bè!', 27, 10, NOW()),
(14, 1, 'quyển', NULL, NULL, 37, 11, NOW()),
-- 5 STARS (Rất hài lòng) - 6 items
(15, 3, 'quyển', NULL, NULL, 47, 12, NOW()),
(16, 1, 'quyển', NULL, NULL, 2, 13, NOW()),
(17, 2, 'quyển', 5, 'Tuyệt tác! Một trong những tiểu thuyết hay nhất từng đọc!', 12, 14, NOW()),
(18, 1, 'quyển', 5, 'Siêu kì diệu! Tôi không thể đặt nó xuống!', 22, 15, NOW()),
(19, 2, 'quyển', NULL, NULL, 32, 16, NOW()),
(20, 1, 'quyển', NULL, NULL, 42, 17, NOW()),
-- Thêm 5 đánh giá cho sách book_id = 1
(21, 1, 'quyển', 5, 'Một cuốn sách kinh điển, càng đọc càng thấm. Rất đáng tiền!', 1, 7, NOW()),
(22, 1, 'quyển', 4, 'Nội dung hay, hơi nặng đô nhưng rất cuốn. Sẽ giới thiệu cho bạn bè.', 1, 8, NOW()),
(23, 2, 'quyển', 4, 'Bản dịch ổn, câu chuyện hấp dẫn, có vài đoạn hơi chậm nhưng vẫn rất tốt.', 1, 9, NOW()),
(24, 1, 'quyển', 3, 'Đọc ổn, ý tưởng hay nhưng cần tập trung mới theo kịp.', 1, 10, NOW()),
(25, 1, 'quyển', 2, 'Không hợp gu của tôi, hơi khó đọc và u ám, nhưng vẫn có giá trị.', 1, 15, NOW());

-- =====================================================
-- INTERACT_EVENTS (SỰ KIỆN TƯƠNG TÁC)
-- INTERACT_WEIGHTS: VIEW=1, ADD_CART=3, PURCHASE=8
-- =====================================================
INSERT INTO `interact_events` (`interact_event_id`, `event_type`, `value`, `book_id`, `user_id`, `created_at`) VALUES
(1, 'VIEW', 1, 1, 12, NOW()),
(2, 'ADD_CART', 3, 1, 12, NOW()),
(3, 'VIEW', 1, 15, 12, NOW()),
(4, 'PURCHASE', 8, 1, 12, NOW()),
(5, 'VIEW', 1, 25, 13, NOW()),
(6, 'ADD_CART', 3, 25, 13, NOW()),
(7, 'PURCHASE', 8, 25, 13, NOW()),
(8, 'VIEW', 1, 5, 14, NOW()),
(9, 'VIEW', 1, 10, 14, NOW()),
(10, 'PURCHASE', 8, 5, 14, NOW()),
(11, 'VIEW', 1, 20, 15, NOW()),
(12, 'PURCHASE', 8, 20, 15, NOW()),
(13, 'VIEW', 1, 30, 16, NOW()),
(14, 'ADD_CART', 3, 30, 16, NOW()),
(15, 'PURCHASE', 8, 30, 16, NOW()),
(16, 'VIEW', 1, 40, 17, NOW()),
(17, 'PURCHASE', 8, 40, 17, NOW()),
(18, 'VIEW', 1, 45, 18, NOW()),
(19, 'ADD_CART', 3, 45, 18, NOW()),
(20, 'PURCHASE', 8, 45, 18, NOW()),
(21, 'VIEW', 1, 7, 19, NOW()),
(22, 'PURCHASE', 8, 7, 19, NOW()),
(23, 'VIEW', 1, 17, 20, NOW()),
(24, 'PURCHASE', 8, 17, 20, NOW()),
(25, 'VIEW', 1, 27, 21, NOW()),
(26, 'ADD_CART', 3, 27, 21, NOW()),
(27, 'PURCHASE', 8, 27, 21, NOW()),
(28, 'VIEW', 1, 37, 22, NOW()),
(29, 'PURCHASE', 8, 37, 22, NOW()),
(30, 'VIEW', 1, 47, 23, NOW()),
(31, 'ADD_CART', 3, 47, 23, NOW()),
(32, 'PURCHASE', 8, 47, 23, NOW());

SET FOREIGN_KEY_CHECKS=1;

-- =====================================================
-- VERIFICATION QUERIES (Bỏ comment để kiểm tra dữ liệu)
-- =====================================================
-- SELECT COUNT(*) as tong_users FROM users;
-- SELECT COUNT(*) as tong_sach FROM books;
-- SELECT COUNT(*) as tong_don_hang FROM orders;
-- SELECT COUNT(*) as tong_chi_tiet_don FROM book_order;
-- SELECT * FROM book_order WHERE rate IS NOT NULL;
-- SELECT * FROM orders WHERE status IN ('CONFIRMED', 'PENDING', 'SHIPPING');
-- SELECT * FROM users WHERE role_id = 3; -- STAFF
-- SELECT * FROM users WHERE role_id = 2; -- CUSTOMER

