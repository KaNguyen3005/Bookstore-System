-- Products: Tìm kiếm, lọc, sắp xếp
CREATE INDEX idx_products_search ON products(status, category_id, selling_price);
CREATE INDEX idx_products_bestseller ON products(sold_count DESC);
CREATE INDEX idx_products_featured ON products(is_featured, created_at DESC);

-- Orders: Dashboard, báo cáo
CREATE INDEX idx_orders_user_status ON orders(user_id, order_status);
CREATE INDEX idx_orders_date_status ON orders(created_at, order_status);
CREATE INDEX idx_orders_total ON orders(total_amount);

-- Reviews: Hiển thị theo sản phẩm
CREATE INDEX idx_reviews_product_status ON reviews(product_id, status, created_at DESC);

-- Inventory: Kiểm tra tồn kho
CREATE INDEX idx_inventory_product ON inventory(product_id, quantity);

-- Flash Sales: Active campaigns
CREATE INDEX idx_flash_active ON flash_sales(is_active, start_time, end_time);

-- Composite index cho queries phổ biến
CREATE INDEX idx_cart_user_updated ON carts(user_id, updated_at);
CREATE INDEX idx_voucher_code_active ON vouchers(voucher_code, is_active, start_date, end_date);