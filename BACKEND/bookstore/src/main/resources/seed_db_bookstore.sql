-- Seed data for BookStore Database
-- Date: April 26, 2026

SET FOREIGN_KEY_CHECKS=0;

-- =====================================================
-- ROLES & PERMISSIONS
-- =====================================================
INSERT INTO `roles` (`role_id`, `role_name`, `created_at`) VALUES
(1, 'ADMIN', NOW()),
(2, 'USER', NOW());

INSERT INTO `permissions` (`permission_id`, `permission_name`, `description`) VALUES
(1, 'CREATE_USER', 'Tạo người dùng mới'),
(2, 'READ_USER', 'Xem thông tin người dùng'),
(3, 'UPDATE_USER', 'Cập nhật thông tin người dùng'),
(4, 'DELETE_USER', 'Xóa người dùng'),
(5, 'CREATE_BOOK', 'Tạo sách mới'),
(6, 'READ_BOOK', 'Xem thông tin sách'),
(7, 'UPDATE_BOOK', 'Cập nhật thông tin sách'),
(8, 'DELETE_BOOK', 'Xóa sách');

INSERT INTO `role_permission` (`role_id`, `permission_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),  -- ADMIN has all permissions
(2, 2), (2, 6);  -- USER can read users and books

-- =====================================================
-- USERS
-- =====================================================
INSERT INTO `users` (`user_id`, `username`, `password`, `name`, `email`, `phone`, `status`, `gender`, `tier`, `point`, `role_id`, `created_at`) VALUES
(1, 'admin', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Admin User', 'admin@bookstore.com', '0901234567', 1, 'Male', 'PLATINUM', 10000, 1, NOW()),
(2, 'user1', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'John Doe', 'user1@bookstore.com', '0901234568', 1, 'Male', 'SILVER', 2500, 2, NOW()),
(3, 'user2', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Jane Smith', 'user2@bookstore.com', '0901234569', 1, 'Female', 'GOLD', 5500, 2, NOW()),
(4, 'user3', '$2a$10$nyVFCwRC3/AjlDLfQvG4O.1omVzKT8kZWHRN8rAtfoCj.oIYYKL9S', 'Bob Johnson', 'user3@bookstore.com', '0901234570', 1, 'Male', 'BRONZE', 500, 2, NOW());

-- =====================================================
-- ADDRESSES
-- =====================================================
INSERT INTO `addresses` (`address_id`, `customer_name`, `customer_phone`, `detail_address`, `ward`, `district`, `province`, `is_default`, `user_id`, `created_at`) VALUES
(1, 'John Doe', '0901234567', '123 Nguyen Hue Boulevard', 'Ben Thanh', 'District 1', 'Ho Chi Minh', 1, 2, NOW()),
(2, 'Jane Smith', '0901234569', '456 Le Loi Street', 'Da Kao', 'District 1', 'Ho Chi Minh', 1, 3, NOW()),
(3, 'Bob Johnson', '0901234570', '789 Tran Hung Dao', 'Nguyen Cu Trinh', 'District 1', 'Ho Chi Minh', 1, 4, NOW());

-- =====================================================
-- AUTHORS
-- =====================================================
INSERT INTO `authors` (`author_id`, `alias`, `author_name`, `created_at`) VALUES
(1, 'George Orwell', 'George Orwell', NOW()),
(2, 'J.K. Rowling', 'Joanne Kathleen Rowling', NOW()),
(3, 'Stephen King', 'Stephen King', NOW());

-- =====================================================
-- PUBLISHERS
-- =====================================================
INSERT INTO `publishers` (`publisher_id`, `publisher_name`, `created_at`) VALUES
(1, 'Penguin Books', NOW()),
(2, 'Bloomsbury', NOW());

-- =====================================================
-- CATEGORIES
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
-- BOOKS
-- =====================================================
INSERT INTO `books` (`book_id`, `title`, `isbn`, `language`, `description`, `page_count`, `cover_type`, `stock_quantity`, `price`, `avg_rating`, `sale_percent`, `is_active`, `publisher_id`, `created_at`) VALUES
(1, '1984', '978-0451524935', 'English', 'A dystopian social science fiction novel', 328, 'Hardcover', 50, 15.99, 4.5, 10, 1, 1, NOW()),
(2, 'Harry Potter and the Sorcerers Stone', '978-0439708180', 'English', 'A young wizard begins his magical journey', 309, 'Hardcover', 100, 14.99, 4.8, 5, 1, 2, NOW()),
(3, 'The Shining', '978-0385121675', 'English', 'A psychological horror novel', 447, 'Paperback', 40, 12.99, 4.3, 15, 1, 1, NOW()),
(4, 'Brave New World', '978-0060085260', 'English', 'A dystopian novel about a futuristic world', 288, 'Paperback', 60, 13.99, 4.2, 20, 1, 1, NOW()),
(5, 'The Fellowship of the Ring', '978-0544003415', 'English', 'The first book in the Lord of the Rings series', 423, 'Hardcover', 75, 18.99, 4.7, 0, 1, 1, NOW());

-- =====================================================
-- BOOK_AUTHOR
-- =====================================================
INSERT INTO `book_author` (`book_id`, `author_id`) VALUES
(1, 1),  -- 1984 by George Orwell
(2, 2),  -- Harry Potter by J.K. Rowling
(3, 3),  -- The Shining by Stephen King
(4, 1),  -- Brave New World by George Orwell
(5, 1);  -- The Fellowship of the Ring (assuming same publisher)

-- =====================================================
-- BOOK_CATEGORY
-- =====================================================
INSERT INTO `book_category` (`book_id`, `category_id`) VALUES
(1, 1), (1, 2),    -- 1984: Fiction, Science Fiction
(2, 3), (2, 10),   -- Harry Potter: Fantasy, Children
(3, 4),            -- The Shining: Mystery
(4, 1), (4, 2),    -- Brave New World: Fiction, Science Fiction
(5, 3);            -- Fellowship: Fantasy

-- =====================================================
-- CARTS
-- =====================================================
INSERT INTO `carts` (`cart_id`, `user_id`, `created_at`) VALUES
(1, 2, NOW()),
(2, 3, NOW()),
(3, 4, NOW());

-- =====================================================
-- BOOK_CART
-- =====================================================
INSERT INTO `book_cart` (`book_cart_id`, `quantity`, `book_id`, `cart_id`, `created_at`) VALUES
(1, 2, 1, 1, NOW()),
(2, 1, 2, 1, NOW()),
(3, 3, 3, 2, NOW()),
(4, 1, 5, 3, NOW());

-- =====================================================
-- VOUCHERS
-- =====================================================
INSERT INTO `vouchers` (`voucher_id`, `voucher_code`, `title`, `description`, `type`, `discount_value`, `min_order_value`, `start_date`, `end_date`, `total_limit`, `limit_per_user`, `is_active`, `created_at`) VALUES
(1, 'DISCOUNT10', 'Discount 10%', 'Get 10% off on all books', 'PERCENTAGE', 10, 50.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 100, 1, 1, NOW());

-- =====================================================
-- ORDERS (without shipments and payments)
-- =====================================================
INSERT INTO `orders` (`order_id`, `status`, `vat_rate`, `customer_id`, `created_at`) VALUES
(1, '0', 0.05, 2, NOW()),
(2, '0', 0.05, 3, NOW());

-- =====================================================
-- BOOK_ORDER (with reviews/ratings)
-- =====================================================
INSERT INTO `book_order` (`book_order_id`, `quantity`, `unit`, `rate`, `content`, `book_id`, `order_id`, `created_at`) VALUES
(1, 2, 'pcs', 5, 'Excellent book! Highly recommended.', 1, 1, NOW()),
(2, 1, 'pcs', 4, 'Great story, interesting characters.', 2, 1, NOW()),
(3, 3, 'pcs', 5, 'One of the best horror novels ever written!', 3, 2, NOW());

-- =====================================================
-- INTERACT_EVENTS
-- =====================================================
INSERT INTO `interact_events` (`interact_event_id`, `event_type`, `value`, `book_id`, `user_id`, `created_at`) VALUES
(1, 'VIEW', 1, 1, 2, NOW()),
(2, 'ADD_CART', 1, 1, 2, NOW()),
(3, 'VIEW', 1, 2, 2, NOW()),
(4, 'PURCHASE', 1, 1, 2, NOW()),
(5, 'VIEW', 1, 3, 3, NOW()),
(6, 'ADD_CART', 1, 3, 3, NOW()),
(7, 'PURCHASE', 1, 3, 3, NOW());

SET FOREIGN_KEY_CHECKS=1;

-- =====================================================
-- VERIFICATION QUERIES (uncomment to check data)
-- =====================================================
-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_books FROM books;
-- SELECT COUNT(*) as total_orders FROM orders;
-- SELECT COUNT(*) as total_book_orders FROM book_order;
-- SELECT * FROM book_order WHERE rate IS NOT NULL;
-- SELECT * FROM orders WHERE status IN ('CONFIRMED', 'PENDING');

