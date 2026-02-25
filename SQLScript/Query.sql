-- 1. Lấy danh sách sản phẩm theo danh mục (phân trang):
SELECT p.*, c.category_name
FROM products p
INNER JOIN categories c ON p.category_id = c.category_id
WHERE p.status = 'active' 
  AND c.category_id = ?
ORDER BY p.sold_count DESC
LIMIT 20 OFFSET 0;

-- 2. Tìm kiếm sản phẩm (Full-text search):

SELECT p.*, MATCH(product_name, description) AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance
FROM products p
WHERE MATCH(product_name, description) AGAINST(? IN NATURAL LANGUAGE MODE)
  AND p.status = 'active'
ORDER BY relevance DESC, p.average_rating DESC
LIMIT 20;

-- 3. Chi tiết sản phẩm với tác giả, ảnh, đánh giá:

-- Sử dụng multiple queries thay vì JOIN lớn
-- Query 1: Product info
SELECT * FROM products WHERE product_id = ?;

-- Query 2: Authors
SELECT a.* FROM authors a
INNER JOIN product_authors pa ON a.author_id = pa.author_id
WHERE pa.product_id = ?;

-- Query 3: Images
SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order;

-- Query 4: Reviews (paginated)
SELECT r.*, u.full_name FROM reviews r
INNER JOIN users u ON r.user_id = u.user_id
WHERE r.product_id = ? AND r.status = 'approved'
ORDER BY r.created_at DESC LIMIT 10;

-- Checkout - Tính tổng giỏ hàng:

SELECT 
    ci.cart_item_id,
    p.product_id,
    p.product_name,
    p.selling_price,
    ci.quantity,
    (p.selling_price * ci.quantity) AS subtotal
FROM cart_items ci
INNER JOIN products p ON ci.product_id = p.product_id
WHERE ci.cart_id = ?;

-- 5. Dashboard - Tổng quan đơn hàng theo ngày:

SELECT 
    DATE(created_at) AS order_date,
    COUNT(*) AS total_orders,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS avg_order_value
FROM orders
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND order_status NOT IN ('cancelled', 'returned')
GROUP BY DATE(created_at)
ORDER BY order_date DESC;


-- 6. Cập nhật rating sản phẩm (trigger):

DELIMITER //
CREATE TRIGGER update_product_rating_after_review
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE products
    SET 
        average_rating = (
            SELECT AVG(rating) 
            FROM reviews 
            WHERE product_id = NEW.product_id AND status = 'approved'
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE product_id = NEW.product_id AND status = 'approved'
        )
    WHERE product_id = NEW.product_id;
END//
DELIMITER ;


-- 7. Kiểm tra tồn kho trước khi đặt hàng:
SELECT 
    p.product_id,
    p.product_name,
    COALESCE(SUM(i.quantity - i.reserved_quantity), 0) AS available_stock
FROM products p
LEFT JOIN inventory i ON p.product_id = i.product_id
WHERE p.product_id IN (?, ?, ?)
GROUP BY p.product_id;