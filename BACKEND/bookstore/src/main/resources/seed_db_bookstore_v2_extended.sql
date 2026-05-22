-- Seed data for BookStore Database - Extended Version
-- Date: May 6, 2026
-- Contents: 50 books, 25 users (1 admin, 10 staff, 14 customers), complete demo data

SET FOREIGN_KEY_CHECKS=0;

-- =====================================================
-- ROLES & PERMISSIONS
-- =====================================================
INSERT INTO `roles` (`role_id`, `role_name`, `created_at`) VALUES
(1, 'ADMIN', NOW()),
(2, 'STAFF', NOW()),
(3, 'CUSTOMER', NOW());

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
(1, 1), (1, 2), (1, 3), (1, 4),
(1, 5), (1, 6), (1, 7), (1, 8),
(1, 9), (1, 10), (1, 11), (1, 12),
(1, 13), (1, 14), (1, 15), (1, 16),
(1, 17), (1, 18), (1, 19),
(1, 20), (1, 21), (1, 22), (1, 23),
(1, 24), (1, 25),
(1, 26), (1, 27), (1, 28),
(1, 29), (1, 30), (1, 31),
(1, 32), (1, 33), (1, 34),
-- STAFF: Order + Book Management + Report
(2, 5), (2, 6), (2, 7), (2, 8),    -- Book Management
(2, 24), (2, 25),                  -- Order Management
(2, 33), (2, 34),                  -- Dashboard & Report
-- CUSTOMER: Basic permissions
(3, 6),                            -- READ_BOOK
(3, 20), (3, 21), (3, 22), (3, 23),-- Address Management
(3, 24), (3, 25);                  -- Order Management

-- =====================================================
-- USERS (1 Admin + 10 Staff + 14 Customers)
-- =====================================================
INSERT INTO `users` (`user_id`, `username`, `password`, `name`, `email`, `phone`, `status`, `gender`, `tier`, `point`, `avatar_url`, `public_id_avatar`, `is_change_account`, `role_id`, `created_at`) VALUES
-- Admin
(1, 'admin', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Admin User', 'admin@bookstore.com', '0901234567', 1, 'Male', 'PLATINUM', 10000, 'https://cloudinary.com/admin', 'users/admin_avatar', 0, 1, NOW()),
-- Staff Users
(2, 'staff1', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Staff One', 'staff1@bookstore.com', '0901234568', 1, 'Male', 'GOLD', 5000, 'https://cloudinary.com/default', 'users/staff1_avatar', 0, 2, NOW()),
(3, 'staff2', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Staff Two', 'staff2@bookstore.com', '0901234569', 1, 'Female', 'GOLD', 4800, 'https://cloudinary.com/default', 'users/staff2_avatar', 0, 2, NOW()),
(4, 'staff3', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Staff Three', 'staff3@bookstore.com', '0901234570', 1, 'Male', 'GOLD', 4600, 'https://cloudinary.com/default', 'users/staff3_avatar', 0, 2, NOW()),
(5, 'staff4', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Staff Four', 'staff4@bookstore.com', '0901234571', 1, 'Female', 'GOLD', 5100, 'https://cloudinary.com/default', 'users/staff4_avatar', 0, 2, NOW()),
(6, 'staff5', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Staff Five', 'staff5@bookstore.com', '0901234572', 1, 'Male', 'GOLD', 4900, 'https://cloudinary.com/default', 'users/staff5_avatar', 0, 2, NOW()),
(7, 'staff6', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Staff Six', 'staff6@bookstore.com', '0901234573', 1, 'Female', 'GOLD', 5200, 'https://cloudinary.com/default', 'users/staff6_avatar', 0, 2, NOW()),
(8, 'staff7', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Staff Seven', 'staff7@bookstore.com', '0901234574', 1, 'Male', 'GOLD', 4700, 'https://cloudinary.com/default', 'users/staff7_avatar', 0, 2, NOW()),
(9, 'staff8', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Staff Eight', 'staff8@bookstore.com', '0901234575', 1, 'Female', 'GOLD', 5000, 'https://cloudinary.com/default', 'users/staff8_avatar', 0, 2, NOW()),
(10, 'staff9', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Staff Nine', 'staff9@bookstore.com', '0901234576', 1, 'Male', 'GOLD', 5100, 'https://cloudinary.com/default', 'users/staff9_avatar', 0, 2, NOW()),
(11, 'staff10', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Staff Ten', 'staff10@bookstore.com', '0901234577', 1, 'Female', 'GOLD', 4800, 'https://cloudinary.com/default', 'users/staff10_avatar', 0, 2, NOW()),
-- Customer Users
(12, 'customer1', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'John Doe', 'customer1@bookstore.com', '0901234578', 1, 'Male', 'SILVER', 2500, 'https://cloudinary.com/default', 'users/customer1_avatar', 0, 3, NOW()),
(13, 'customer2', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Jane Smith', 'customer2@bookstore.com', '0901234579', 1, 'Female', 'GOLD', 5500, 'https://cloudinary.com/default', 'users/customer2_avatar', 0, 3, NOW()),
(14, 'customer3', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Bob Johnson', 'customer3@bookstore.com', '0901234580', 1, 'Male', 'BRONZE', 500, 'https://cloudinary.com/default', 'users/customer3_avatar', 0, 3, NOW()),
(15, 'customer4', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Alice Brown', 'customer4@bookstore.com', '0901234581', 1, 'Female', 'SILVER', 3000, 'https://cloudinary.com/default', 'users/customer4_avatar', 0, 3, NOW()),
(16, 'customer5', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Charlie Davis', 'customer5@bookstore.com', '0901234582', 1, 'Male', 'PLATINUM', 12000, 'https://cloudinary.com/default', 'users/customer5_avatar', 0, 3, NOW()),
(17, 'customer6', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Emma Wilson', 'customer6@bookstore.com', '0901234583', 1, 'Female', 'GOLD', 6000, 'https://cloudinary.com/default', 'users/customer6_avatar', 0, 3, NOW()),
(18, 'customer7', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Frank Miller', 'customer7@bookstore.com', '0901234584', 1, 'Male', 'SILVER', 2800, 'https://cloudinary.com/default', 'users/customer7_avatar', 0, 3, NOW()),
(19, 'customer8', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Grace Taylor', 'customer8@bookstore.com', '0901234585', 1, 'Female', 'BRONZE', 800, 'https://cloudinary.com/default', 'users/customer8_avatar', 0, 3, NOW()),
(20, 'customer9', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Henry Martinez', 'customer9@bookstore.com', '0901234586', 1, 'Male', 'GOLD', 7500, 'https://cloudinary.com/default', 'users/customer9_avatar', 0, 3, NOW()),
(21, 'customer10', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Ivy Garcia', 'customer10@bookstore.com', '0901234587', 1, 'Female', 'SILVER', 3500, 'https://cloudinary.com/default', 'users/customer10_avatar', 0, 3, NOW()),
(22, 'customer11', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Jack Rodriguez', 'customer11@bookstore.com', '0901234588', 1, 'Male', 'PLATINUM', 11000, 'https://cloudinary.com/default', 'users/customer11_avatar', 0, 3, NOW()),
(23, 'customer12', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Karen Lee', 'customer12@bookstore.com', '0901234589', 1, 'Female', 'GOLD', 5800, 'https://cloudinary.com/default', 'users/customer12_avatar', 0, 3, NOW()),
(24, 'customer13', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Leo Anderson', 'customer13@bookstore.com', '0901234590', 1, 'Male', 'SILVER', 2200, 'https://cloudinary.com/default', 'users/customer13_avatar', 0, 3, NOW()),
(25, 'customer14', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Mia Thompson', 'customer14@bookstore.com', '0901234591', 1, 'Female', 'BRONZE', 1000, 'https://cloudinary.com/default', 'users/customer14_avatar', 0, 3, NOW());

-- =====================================================
-- ADDRESSES
-- =====================================================
INSERT INTO `addresses` (`address_id`, `customer_name`, `customer_phone`, `detail_address`, `ward`, `district`, `province`, `is_default`, `user_id`, `created_at`) VALUES
-- Staff addresses
(1, 'Staff One', '0901234568', '123 Tran Hung Dao', 'Ben Thanh', 'District 1', 'Ho Chi Minh', 1, 2, NOW()),
(2, 'Staff Two', '0901234569', '456 Nguyen Hue', 'Da Kao', 'District 1', 'Ho Chi Minh', 1, 3, NOW()),
(3, 'Staff Three', '0901234570', '789 Le Loi', 'Nguyen Cu Trinh', 'District 1', 'Ho Chi Minh', 1, 4, NOW()),
(4, 'Staff Four', '0901234571', '321 Dong Khoi', 'Ben Thanh', 'District 1', 'Ho Chi Minh', 1, 5, NOW()),
(5, 'Staff Five', '0901234572', '654 Cach Mang Thang Tam', 'Da Kao', 'District 1', 'Ho Chi Minh', 1, 6, NOW()),
(6, 'Staff Six', '0901234573', '987 Pham Ngu Lao', 'Nguyen Cu Trinh', 'District 1', 'Ho Chi Minh', 1, 7, NOW()),
(7, 'Staff Seven', '0901234574', '111 Tran Cao Van', 'Ben Thanh', 'District 1', 'Ho Chi Minh', 1, 8, NOW()),
(8, 'Staff Eight', '0901234575', '222 Vo Van Tan', 'Da Kao', 'District 1', 'Ho Chi Minh', 1, 9, NOW()),
(9, 'Staff Nine', '0901234576', '333 Hoang Sa', 'Nguyen Cu Trinh', 'District 1', 'Ho Chi Minh', 1, 10, NOW()),
(10, 'Staff Ten', '0901234577', '444 Mac Dinh Chi', 'Ben Thanh', 'District 1', 'Ho Chi Minh', 1, 11, NOW()),
-- Customer addresses
(11, 'John Doe', '0901234578', '555 Pasteur', 'Da Kao', 'District 1', 'Ho Chi Minh', 1, 12, NOW()),
(12, 'Jane Smith', '0901234579', '666 Ton That Tung', 'Nguyen Cu Trinh', 'District 1', 'Ho Chi Minh', 1, 13, NOW()),
(13, 'Bob Johnson', '0901234580', '777 Gia Long', 'Ben Thanh', 'District 1', 'Ho Chi Minh', 1, 14, NOW()),
(14, 'Alice Brown', '0901234581', '888 Ton Duc Thang', 'Da Kao', 'District 1', 'Ho Chi Minh', 1, 15, NOW()),
(15, 'Charlie Davis', '0901234582', '999 Vo Thi Sau', 'Nguyen Cu Trinh', 'District 1', 'Ho Chi Minh', 1, 16, NOW()),
(16, 'Emma Wilson', '0901234583', '1010 Ngo Duc Ke', 'Ben Thanh', 'District 1', 'Ho Chi Minh', 1, 17, NOW()),
(17, 'Frank Miller', '0901234584', '1111 Quang Trung', 'Da Kao', 'District 1', 'Ho Chi Minh', 1, 18, NOW()),
(18, 'Grace Taylor', '0901234585', '1212 Ly Tu Trong', 'Nguyen Cu Trinh', 'District 1', 'Ho Chi Minh', 1, 19, NOW()),
(19, 'Henry Martinez', '0901234586', '1313 Nguyen Trai', 'Ben Thanh', 'District 1', 'Ho Chi Minh', 1, 20, NOW()),
(20, 'Ivy Garcia', '0901234587', '1414 Ha Ba Trung', 'Da Kao', 'District 1', 'Ho Chi Minh', 1, 21, NOW()),
(21, 'Jack Rodriguez', '0901234588', '1515 Dien Bien Phu', 'Nguyen Cu Trinh', 'District 3', 'Ho Chi Minh', 1, 22, NOW()),
(22, 'Karen Lee', '0901234589', '1616 Tran Binh Trong', 'Ben Thanh', 'District 1', 'Ho Chi Minh', 1, 23, NOW()),
(23, 'Leo Anderson', '0901234590', '1717 Truong Dinh', 'Da Kao', 'District 1', 'Ho Chi Minh', 1, 24, NOW()),
(24, 'Mia Thompson', '0901234591', '1818 Phan Boi Chau', 'Nguyen Cu Trinh', 'District 1', 'Ho Chi Minh', 1, 25, NOW());

-- =====================================================
-- AUTHORS (15 authors)
-- =====================================================
INSERT INTO `authors` (`author_id`, `alias`, `author_name`, `created_at`) VALUES
(1, 'george-orwell', 'George Orwell', NOW()),
(2, 'jk-rowling', 'Joanne Kathleen Rowling', NOW()),
(3, 'stephen-king', 'Stephen King', NOW()),
(4, 'jrr-tolkien', 'John Ronald Reuel Tolkien', NOW()),
(5, 'jane-austen', 'Jane Austen', NOW()),
(6, 'mark-twain', 'Mark Twain', NOW()),
(7, 'leo-tolstoy', 'Leo Tolstoy', NOW()),
(8, 'charles-dickens', 'Charles Dickens', NOW()),
(9, 'victor-hugo', 'Victor Hugo', NOW()),
(10, 'alexandre-dumas', 'Alexandre Dumas', NOW()),
(11, 'emily-bronte', 'Emily Brontë', NOW()),
(12, 'charlotte-bronte', 'Charlotte Brontë', NOW()),
(13, 'haruki-murakami', 'Haruki Murakami', NOW()),
(14, 'paulo-coelho', 'Paulo Coelho', NOW()),
(15, 'colleen-hoover', 'Colleen Hoover', NOW());

-- =====================================================
-- PUBLISHERS (8 publishers)
-- =====================================================
INSERT INTO `publishers` (`publisher_id`, `publisher_name`, `created_at`) VALUES
(1, 'Penguin Books', NOW()),
(2, 'Bloomsbury', NOW()),
(3, 'Simon & Schuster', NOW()),
(4, 'HarperCollins', NOW()),
(5, 'Random House', NOW()),
(6, 'Macmillan', NOW()),
(7, 'Hachette', NOW()),
(8, 'Oxford University Press', NOW());

-- =====================================================
-- CATEGORIES (Keep existing 10)
-- =====================================================
INSERT INTO `categories` (`category_id`, `category_name`, `parent_id`, `created_at`) VALUES
(1, 'Fiction', NULL, NOW()),
(2, 'Science Fiction', 1, NOW()),
(3, 'Fantasy', 1, NOW()),
(4, 'Mystery', 1, NOW()),
(5, 'Romance', 1, NOW()),
(6, 'Non-Fiction', NULL, NOW()),
(7, 'Biography', 6, NOW()),
(8, 'History', 6, NOW()),
(9, 'Self-Help', 6, NOW()),
(10, 'Children', NULL, NOW());

-- =====================================================
-- BOOKS (50 books)
-- =====================================================
INSERT INTO `books` (`book_id`, `title`, `isbn`, `language`, `description`, `page_count`, `cover_type`, `stock_quantity`, `price`, `avg_rating`, `sale_percent`, `is_active`, `weight`, `length`, `width`, `height`, `cover_image_url`, `public_id_cover_image`, `publisher_id`, `created_at`) VALUES
(1, '1984', '978-0451524935', 'English', 'A dystopian social science fiction novel', 328, 'Hardcover', 50, 15.99, 4.5, 10, 1, 0.5, 25, 18, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 1, NOW()),
(2, 'Harry Potter and the Sorcerer''s Stone', '978-0439708180', 'English', 'A young wizard begins his magical journey', 309, 'Hardcover', 100, 14.99, 4.8, 5, 1, 0.7, 23, 16, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 2, NOW()),
(3, 'The Shining', '978-0385121675', 'English', 'A psychological horror novel', 447, 'Paperback', 40, 12.99, 4.3, 15, 1, 0.8, 24, 17, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 1, NOW()),
(4, 'Brave New World', '978-0060085260', 'English', 'A dystopian novel about a futuristic world', 288, 'Paperback', 60, 13.99, 4.2, 20, 1, 0.6, 22, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 1, NOW()),
(5, 'The Fellowship of the Ring', '978-0544003415', 'English', 'The first book in the Lord of the Rings series', 423, 'Hardcover', 75, 18.99, 4.7, 0, 1, 1.0, 26, 19, 6, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 3, NOW()),
(6, 'The Two Towers', '978-0544003422', 'English', 'The second book in the Lord of the Rings series', 352, 'Hardcover', 70, 18.99, 4.7, 0, 1, 0.95, 26, 19, 6, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 3, NOW()),
(7, 'The Return of the King', '978-0544003439', 'English', 'The third book in the Lord of the Rings series', 416, 'Hardcover', 80, 19.99, 4.8, 0, 1, 1.05, 26, 19, 6, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 3, NOW()),
(8, 'Pride and Prejudice', '978-0141439518', 'English', 'A romantic novel by Jane Austen', 279, 'Paperback', 85, 9.99, 4.6, 5, 1, 0.4, 20, 14, 2, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 8, NOW()),
(9, 'The Great Gatsby', '978-0743273565', 'English', 'A classic American novel', 180, 'Paperback', 95, 11.99, 4.4, 10, 1, 0.35, 19, 13, 2, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 4, NOW()),
(10, 'Wuthering Heights', '978-0141439556', 'English', 'A gothic novel by Emily Brontë', 323, 'Paperback', 45, 10.99, 4.3, 15, 1, 0.45, 21, 14, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 8, NOW()),
(11, 'Jane Eyre', '978-0141441146', 'English', 'A classic novel by Charlotte Brontë', 447, 'Paperback', 55, 11.99, 4.5, 10, 1, 0.5, 22, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 8, NOW()),
(12, 'The Catcher in the Rye', '978-0316769174', 'English', 'A coming-of-age novel', 214, 'Paperback', 70, 13.99, 4.2, 15, 1, 0.38, 20, 13, 2, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 5, NOW()),
(13, 'To Kill a Mockingbird', '978-0061120084', 'English', 'A gripping tale of racial injustice', 324, 'Paperback', 90, 14.99, 4.7, 5, 1, 0.45, 21, 14, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 4, NOW()),
(14, 'The Hobbit', '978-0547928227', 'English', 'A fantasy adventure by Tolkien', 310, 'Hardcover', 110, 16.99, 4.7, 5, 1, 0.72, 24, 17, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 3, NOW()),
(15, 'Harry Potter and the Chamber of Secrets', '978-0439064873', 'English', 'The second book of the series', 341, 'Hardcover', 95, 14.99, 4.8, 5, 1, 0.72, 23, 16, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 2, NOW()),
(16, 'Harry Potter and the Prisoner of Azkaban', '978-0439136365', 'English', 'The third book of the series', 435, 'Hardcover', 88, 16.99, 4.8, 0, 1, 0.8, 24, 17, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 2, NOW()),
(17, 'Harry Potter and the Goblet of Fire', '978-0439139601', 'English', 'The fourth book of the series', 636, 'Hardcover', 75, 18.99, 4.8, 0, 1, 1.0, 25, 18, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 2, NOW()),
(18, 'Harry Potter and the Order of the Phoenix', '978-0439139595', 'English', 'The fifth book of the series', 870, 'Hardcover', 60, 21.99, 4.7, 10, 1, 1.15, 26, 19, 6, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 2, NOW()),
(19, 'The Stand', '978-0385333665', 'English', 'An epic post-apocalyptic novel', 1152, 'Hardcover', 35, 22.99, 4.6, 15, 1, 1.4, 27, 20, 6, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 6, NOW()),
(20, 'It', '978-0451191143', 'English', 'A massive horror novel by King', 1138, 'Paperback', 40, 18.99, 4.5, 20, 1, 1.35, 27, 20, 6, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 1, NOW()),
(21, 'Misery', '978-0451176912', 'English', 'A psychological thriller', 310, 'Paperback', 65, 12.99, 4.4, 10, 1, 0.5, 22, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 1, NOW()),
(22, 'The Green Mile', '978-0451197979', 'English', 'A prison drama novel', 452, 'Paperback', 70, 14.99, 4.6, 10, 1, 0.6, 23, 16, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 1, NOW()),
(23, 'Norwegian Wood', '978-0099457473', 'English', 'A Japanese romance novel', 608, 'Paperback', 55, 15.99, 4.3, 15, 1, 0.75, 24, 17, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 7, NOW()),
(24, 'The Alchemist', '978-0062412515', 'English', 'A philosophical adventure', 197, 'Paperback', 120, 14.99, 4.5, 10, 1, 0.4, 20, 14, 2, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 5, NOW()),
(25, 'It Ends with Us', '978-1501110368', 'English', 'A contemporary romance', 356, 'Paperback', 100, 16.99, 4.6, 10, 1, 0.5, 22, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 4, NOW()),
(26, 'Confess', '978-1492206194', 'English', 'A romantic drama', 320, 'Paperback', 85, 15.99, 4.4, 15, 1, 0.48, 21, 14, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 3, NOW()),
(27, 'Maybe Someday', '978-1492220795', 'English', 'A love story', 384, 'Paperback', 75, 15.99, 4.5, 10, 1, 0.5, 22, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 3, NOW()),
(28, 'The Notebook', '978-0446676205', 'English', 'A romantic novel', 201, 'Paperback', 130, 15.99, 4.4, 15, 1, 0.38, 20, 14, 2, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 6, NOW()),
(29, 'Outlander', '978-0385333666', 'English', 'A time-travel romance', 642, 'Hardcover', 50, 18.99, 4.7, 5, 1, 0.85, 25, 18, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 6, NOW()),
(30, 'The Book of Lost Things', '978-1590199695', 'English', 'A fantasy novel', 368, 'Hardcover', 60, 17.99, 4.5, 10, 1, 0.65, 24, 17, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 7, NOW()),
(31, 'A Darker Shade of Magic', '978-0765376458', 'English', 'A dark fantasy', 400, 'Hardcover', 70, 18.99, 4.6, 5, 1, 0.7, 24, 17, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 4, NOW()),
(32, 'The Name of the Wind', '978-0756404741', 'English', 'An epic fantasy', 660, 'Hardcover', 55, 19.99, 4.7, 0, 1, 0.9, 25, 18, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 5, NOW()),
(33, 'Sapiens', '978-0062316097', 'English', 'A history of humankind', 542, 'Paperback', 110, 20.99, 4.5, 15, 1, 0.75, 24, 17, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 2, NOW()),
(34, 'Educated', '978-0399590504', 'English', 'A memoir', 352, 'Paperback', 105, 18.99, 4.6, 10, 1, 0.55, 23, 16, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 1, NOW()),
(35, 'Dune', '978-0441172719', 'English', 'A sci-fi epic', 688, 'Paperback', 75, 17.99, 4.7, 10, 1, 0.85, 25, 18, 5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 5, NOW()),
(36, 'Neuromancer', '978-0441569595', 'English', 'A cyberpunk novel', 271, 'Paperback', 50, 13.99, 4.3, 15, 1, 0.42, 21, 14, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 3, NOW()),
(37, 'The Martian', '978-0553418026', 'English', 'A survival sci-fi story', 369, 'Paperback', 95, 14.99, 4.7, 10, 1, 0.55, 22, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 8, NOW()),
(38, 'Ender''s Game', '978-0812550702', 'English', 'A sci-fi classic', 324, 'Paperback', 80, 15.99, 4.6, 10, 1, 0.5, 22, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 7, NOW()),
(39, 'The Left Hand of Darkness', '978-0441478522', 'English', 'A groundbreaking sci-fi', 304, 'Paperback', 60, 14.99, 4.5, 15, 1, 0.48, 21, 14, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 4, NOW()),
(40, 'Foundation', '978-0553293357', 'English', 'The start of a great series', 255, 'Paperback', 70, 14.99, 4.4, 10, 1, 0.42, 21, 14, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 5, NOW()),
(41, 'The Count of Monte Cristo', '978-0140449266', 'English', 'A classic adventure', 462, 'Paperback', 65, 15.99, 4.6, 10, 1, 0.6, 23, 16, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 8, NOW()),
(42, 'Les Misérables', '978-0451419439', 'English', 'A masterwork by Victor Hugo', 545, 'Paperback', 55, 16.99, 4.5, 15, 1, 0.7, 24, 17, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 1, NOW()),
(43, 'The Hunchback of Notre Dame', '978-0451532718', 'English', 'A gothic novel', 443, 'Paperback', 50, 14.99, 4.3, 15, 1, 0.55, 22, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 1, NOW()),
(44, 'A Tale of Two Cities', '978-0141439600', 'English', 'A novel of the French Revolution', 374, 'Paperback', 75, 12.99, 4.4, 20, 1, 0.48, 21, 14, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 8, NOW()),
(45, 'Great Expectations', '978-0141439563', 'English', 'A coming-of-age story', 505, 'Paperback', 60, 13.99, 4.3, 15, 1, 0.58, 23, 16, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 8, NOW()),
(46, 'Oliver Twist', '978-0141439662', 'English', 'A social novel', 587, 'Paperback', 50, 13.99, 4.2, 20, 1, 0.65, 23, 16, 4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 8, NOW()),
(47, 'The Monk', '978-0192834416', 'English', 'A gothic horror', 443, 'Paperback', 40, 12.99, 3.9, 20, 1, 0.55, 22, 15, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 8, NOW()),
(48, 'Frankenstein', '978-0141439471', 'English', 'A classic horror', 280, 'Paperback', 90, 11.99, 4.4, 15, 1, 0.4, 20, 14, 2, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 8, NOW()),
(49, 'The Picture of Dorian Gray', '978-0141442556', 'English', 'A philosophical novel', 304, 'Paperback', 85, 10.99, 4.3, 10, 1, 0.42, 21, 14, 3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 8, NOW()),
(50, 'Sherlock Holmes: A Study in Scarlet', '978-0486404288', 'English', 'A classic detective story', 160, 'Paperback', 120, 9.99, 4.4, 20, 1, 0.32, 19, 13, 2, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', 'book_default', 8, NOW());

-- =====================================================
-- BOOK_AUTHOR
-- =====================================================
INSERT INTO `book_author` (`book_id`, `author_id`) VALUES
(1, 1), (2, 2), (3, 3), (4, 1), (5, 4), (6, 4), (7, 4), (8, 5), (9, 6), (10, 11),
(11, 12), (12, 5), (13, 6), (14, 4), (15, 2), (16, 2), (17, 2), (18, 2), (19, 3), (20, 3),
(21, 3), (22, 3), (23, 13), (24, 14), (25, 15), (26, 15), (27, 15), (28, 6), (29, 6), (30, 6),
(31, 6), (32, 6), (33, 6), (34, 6), (35, 6), (36, 6), (37, 6), (38, 6), (39, 6), (40, 6),
(41, 10), (42, 9), (43, 9), (44, 8), (45, 8), (46, 8), (47, 8), (48, 5), (49, 6), (50, 6);

-- =====================================================
-- BOOK_CATEGORY
-- =====================================================
INSERT INTO `book_category` (`book_id`, `category_id`) VALUES
(1, 1), (1, 2), (2, 3), (2, 10), (3, 4), (4, 1), (4, 2), (5, 1), (5, 3), (6, 1), (6, 3),
(7, 1), (7, 3), (8, 1), (8, 5), (9, 1), (9, 5), (10, 1), (10, 4), (11, 1), (11, 5),
(12, 1), (12, 4), (13, 1), (13, 4), (14, 3), (14, 10), (15, 3), (15, 10), (16, 3), (16, 10),
(17, 3), (17, 10), (18, 3), (18, 10), (19, 2), (19, 1), (20, 1), (20, 4), (21, 4), (22, 1),
(23, 5), (24, 9), (25, 5), (26, 5), (27, 5), (28, 5), (29, 5), (30, 3), (31, 3), (32, 3),
(33, 6), (33, 8), (34, 6), (34, 7), (35, 2), (36, 2), (37, 2), (38, 2), (39, 2), (40, 2),
(41, 1), (42, 1), (43, 1), (44, 1), (45, 1), (46, 1), (47, 1), (47, 4), (48, 1), (48, 4),
(49, 1), (50, 4);

-- =====================================================
-- BOOK_IMGS (50 sách, mỗi cái 1 ảnh)
-- =====================================================
INSERT INTO `book_imgs` (`book_img_id`, `img_url`, `public_id`,`book_id`, `created_at`) VALUES
(1, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 1, NOW()),
(2, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 2, NOW()),
(3, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 3, NOW()),
(4, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 4, NOW()),
(5, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 5, NOW()),
(6, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 6, NOW()),
(7, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 7, NOW()),
(8, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 8, NOW()),
(9, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 9, NOW()),
(10, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 10, NOW()),
(11, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 11, NOW()),
(12, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 12, NOW()),
(13, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 13, NOW()),
(14, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 14, NOW()),
(15, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 15, NOW()),
(16, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 16, NOW()),
(17, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 17, NOW()),
(18, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 18, NOW()),
(19, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 19, NOW()),
(20, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 20, NOW()),
(21, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 21, NOW()),
(22, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 22, NOW()),
(23, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 23, NOW()),
(24, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 24, NOW()),
(25, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 25, NOW()),
(26, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 26, NOW()),
(27, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 27, NOW()),
(28, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 28, NOW()),
(29, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 29, NOW()),
(30, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 30, NOW()),
(31, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 31, NOW()),
(32, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 32, NOW()),
(33, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 33, NOW()),
(34, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 34, NOW()),
(35, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 35, NOW()),
(36, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 36, NOW()),
(37, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 37, NOW()),
(38, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 38, NOW()),
(39, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 39, NOW()),
(40, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 40, NOW()),
(41, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 41, NOW()),
(42, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 42, NOW()),
(43, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 43, NOW()),
(44, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 44, NOW()),
(45, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 45, NOW()),
(46, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 46, NOW()),
(47, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 47, NOW()),
(48, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 48, NOW()),
(49, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 49, NOW()),
(50, 'https://res.cloudinary.com/duqhdj1ff/image/upload/v1778055119/7c27baf5-2948-4275-8e02-fb472cee8195_cmfbjx.jpg', '7c27baf5-2948-4275-8e02-fb472cee8195', 50, NOW());

-- =====================================================
-- CARTS
-- =====================================================
INSERT INTO `carts` (`cart_id`, `user_id`, `created_at`) VALUES
(1, 12, NOW()), (2, 13, NOW()), (3, 14, NOW()), (4, 15, NOW()), (5, 16, NOW()),
(6, 17, NOW()), (7, 18, NOW()), (8, 19, NOW()), (9, 20, NOW()), (10, 21, NOW()),
(11, 22, NOW()), (12, 23, NOW()), (13, 24, NOW()), (14, 25, NOW());

-- =====================================================
-- BOOK_CART
-- =====================================================
INSERT INTO `book_cart` (`book_cart_id`, `quantity`, `book_id`, `cart_id`, `created_at`) VALUES
(1, 2, 1, 1, NOW()), (2, 1, 5, 1, NOW()), (3, 3, 2, 2, NOW()), (4, 1, 14, 2, NOW()),
(5, 2, 3, 3, NOW()), (6, 1, 32, 3, NOW()), (7, 4, 8, 4, NOW()), (8, 2, 25, 4, NOW()),
(9, 1, 35, 5, NOW()), (10, 3, 42, 5, NOW()), (11, 2, 9, 6, NOW()), (12, 1, 31, 6, NOW()),
(13, 1, 28, 7, NOW()), (14, 2, 48, 7, NOW()), (15, 3, 13, 8, NOW()), (16, 1, 37, 8, NOW()),
(17, 2, 19, 9, NOW()), (18, 1, 24, 9, NOW()), (19, 1, 7, 10, NOW()), (20, 2, 50, 10, NOW());

-- =====================================================
-- VOUCHERS
-- =====================================================
INSERT INTO `vouchers` (`voucher_id`, `voucher_code`, `title`, `description`, `type`, `discount_value`, `min_order_value`, `start_date`, `end_date`, `total_limit`, `limit_per_user`, `is_active`, `created_at`) VALUES
(1, 'DISCOUNT10', 'Discount 10%', 'Get 10% off on all books', 'PERCENTAGE', 10, 50.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 100, 1, 1, NOW()),
(2, 'SAVE50', 'Save $50', 'Get $50 off on orders over $200', 'FIXED', 50, 200.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 50, 1, 1, NOW()),
(3, 'WELCOME15', 'Welcome 15%', 'New customer discount', 'PERCENTAGE', 15, 30.00, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 200, 1, 1, NOW()),
(4, 'SUMMER20', 'Summer Sale 20%', 'Summer special offer', 'PERCENTAGE', 20, 100.00, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 150, 2, 1, NOW()),
(5, 'LOYALTY5', 'Loyalty 5%', 'Loyalty reward', 'PERCENTAGE', 5, 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 500, 10, 1, NOW());

-- =====================================================
-- ORDERS
-- =====================================================
INSERT INTO `orders` (`order_id`, `status`, `vat_rate`, `customer_id`, `created_at`) VALUES
(1, 'PENDING', 0.05, 12, NOW()),
(2, 'PENDING', 0.05, 13, NOW()),
(3, 'CONFIRMED', 0.05, 14, NOW()),
(4, 'CONFIRMED', 0.05, 15, NOW()),
(5, 'SHIPPING', 0.05, 16, NOW()),
(6, 'SHIPPING', 0.05, 17, NOW()),
(7, 'DELIVERED', 0.05, 18, NOW()),
(8, 'DELIVERED', 0.05, 19, NOW()),
(9, 'COMPLETED', 0.05, 20, NOW()),
(10, 'COMPLETED', 0.05, 21, NOW()),
(11, 'PENDING', 0.05, 22, NOW()),
(12, 'CONFIRMED', 0.05, 23, NOW()),
(13, 'SHIPPING', 0.05, 24, NOW()),
(14, 'DELIVERED', 0.05, 25, NOW()),
(15, 'COMPLETED', 0.05, 12, NOW()),
(16, 'PENDING', 0.05, 13, NOW()),
(17, 'CONFIRMED', 0.05, 14, NOW()),
(18, 'SHIPPING', 0.05, 15, NOW()),
(19, 'DELIVERED', 0.05, 16, NOW()),
(20, 'COMPLETED', 0.05, 17, NOW());

-- =====================================================
-- BOOK_ORDER (with reviews)
-- =====================================================
INSERT INTO `book_order` (`book_order_id`, `quantity`, `unit`, `rate`, `content`, `book_id`, `order_id`, `created_at`) VALUES
(1, 2, 'pcs', 5, 'Excellent book! Highly recommended.', 1, 1, NOW()),
(2, 1, 'pcs', 4, 'Great story, interesting characters.', 5, 1, NOW()),
(3, 3, 'pcs', 5, 'One of the best horror novels!', 3, 2, NOW()),
(4, 1, 'pcs', 4, 'Amazing fantasy world.', 14, 2, NOW()),
(5, 2, 'pcs', 5, 'Must-read classic.', 8, 3, NOW()),
(6, 1, 'pcs', 5, 'Perfect gift!', 25, 3, NOW()),
(7, 1, 'pcs', 4, 'Good adventure story.', 7, 4, NOW()),
(8, 2, 'pcs', 5, 'Best book ever!', 2, 4, NOW()),
(9, 1, 'pcs', 5, 'Couldn''t put it down.', 32, 5, NOW()),
(10, 2, 'pcs', 4, 'Very informative.', 33, 5, NOW()),
(11, 1, 'pcs', 5, 'Outstanding narrative.', 42, 6, NOW()),
(12, 3, 'pcs', 4, 'Fantastic characters.', 9, 6, NOW()),
(13, 1, 'pcs', 5, 'Life-changing book.', 24, 7, NOW()),
(14, 2, 'pcs', 4, 'Great read.', 28, 7, NOW()),
(15, 1, 'pcs', 5, 'Highly entertaining.', 35, 8, NOW()),
(16, 2, 'pcs', 4, 'Well written.', 13, 8, NOW()),
(17, 1, 'pcs', 5, 'Masterpiece!', 39, 9, NOW()),
(18, 3, 'pcs', 5, 'Absolutely brilliant.', 41, 9, NOW()),
(19, 1, 'pcs', 4, 'Great storytelling.', 31, 10, NOW()),
(20, 2, 'pcs', 5, 'Unforgettable experience.', 48, 10, NOW());

-- =====================================================
-- INTERACT_EVENTS
-- =====================================================
INSERT INTO `interact_events` (`interact_event_id`, `event_type`, `value`, `book_id`, `user_id`, `created_at`) VALUES
(1, 'VIEW', 1, 1, 12, NOW()),
(2, 'ADD_CART', 1, 1, 12, NOW()),
(3, 'PURCHASE', 1, 1, 12, NOW()),
(4, 'VIEW', 1, 5, 12, NOW()),
(5, 'PURCHASE', 1, 5, 12, NOW()),
(6, 'VIEW', 2, 2, 13, NOW()),
(7, 'VIEW', 1, 2, 13, NOW()),
(8, 'ADD_CART', 1, 2, 13, NOW()),
(9, 'PURCHASE', 1, 2, 13, NOW()),
(10, 'VIEW', 3, 3, 14, NOW()),
(11, 'ADD_CART', 1, 3, 14, NOW()),
(12, 'PURCHASE', 1, 3, 14, NOW()),
(13, 'VIEW', 1, 14, 14, NOW()),
(14, 'PURCHASE', 1, 14, 14, NOW()),
(15, 'VIEW', 4, 8, 15, NOW()),
(16, 'ADD_CART', 1, 8, 15, NOW()),
(17, 'PURCHASE', 1, 8, 15, NOW()),
(18, 'VIEW', 2, 25, 15, NOW()),
(19, 'PURCHASE', 1, 25, 15, NOW()),
(20, 'VIEW', 5, 7, 16, NOW()),
(21, 'ADD_CART', 1, 7, 16, NOW()),
(22, 'PURCHASE', 1, 7, 16, NOW()),
(23, 'VIEW', 3, 2, 16, NOW()),
(24, 'PURCHASE', 1, 2, 16, NOW()),
(25, 'VIEW', 1, 32, 17, NOW()),
(26, 'ADD_CART', 1, 32, 17, NOW()),
(27, 'PURCHASE', 1, 32, 17, NOW()),
(28, 'VIEW', 2, 33, 17, NOW()),
(29, 'PURCHASE', 1, 33, 17, NOW()),
(30, 'VIEW', 3, 42, 18, NOW()),
(31, 'ADD_CART', 1, 42, 18, NOW()),
(32, 'PURCHASE', 1, 42, 18, NOW());

SET FOREIGN_KEY_CHECKS=1;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_books FROM books;
-- SELECT COUNT(*) as total_authors FROM authors;
-- SELECT COUNT(*) as total_publishers FROM publishers;
-- SELECT COUNT(*) as total_orders FROM orders;
-- SELECT COUNT(*) as total_book_orders FROM book_order;
-- SELECT * FROM book_order WHERE rate IS NOT NULL;
-- SELECT COUNT(*) as total_interact_events FROM interact_events;
-- SELECT role_id, COUNT(*) FROM users GROUP BY role_id;

