-- 1. View sản phẩm với thông tin đầy đủ:
 
CREATE VIEW v_products_full AS
SELECT 
    p.*,
    c.category_name,
    pub.publisher_name,
    GROUP_CONCAT(DISTINCT a.author_name SEPARATOR ', ') AS authors,
    (SELECT image_url FROM product_images WHERE product_id = p.product_id AND is_primary = TRUE LIMIT 1) AS primary_image
FROM products p
LEFT JOIN categories c ON p.category_id = c.category_id
LEFT JOIN publishers pub ON p.publisher_id = pub.publisher_id
LEFT JOIN product_authors pa ON p.product_id = pa.product_id
LEFT JOIN authors a ON pa.author_id = a.author_id
GROUP BY p.product_id;

-- 2. View đơn hàng với thông tin khách hàng:

CREATE VIEW v_orders_summary AS
SELECT 
    o.*,
    u.full_name AS customer_name,
    u.email AS customer_email,
    u.phone AS customer_phone,
    COUNT(oi.order_item_id) AS total_items
FROM orders o
INNER JOIN users u ON o.user_id = u.user_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id;