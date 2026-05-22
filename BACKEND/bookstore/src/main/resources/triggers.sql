-- =====================================================
-- FILE: Triggers cho Database
-- Lưu ý: File này phải chạy riêng qua MySQL client
-- Không chạy qua Spring initialization scripts (không hỗ trợ DELIMITER)
--
-- Cách chạy:
-- mysql -u root -p db_bookstore < triggers.sql
-- =====================================================

-- =====================================================
-- TRIGGER: check_order_not_empty
-- Mục đích: Không cho phép xóa chi tiết đơn hàng cuối cùng
--          Bảo đảm mỗi đơn hàng phải có ít nhất 1 sách
--
-- Cập nhật: 22/05/2026
-- =====================================================
DELIMITER $$

CREATE TRIGGER check_order_not_empty BEFORE DELETE ON book_order
FOR EACH ROW
BEGIN
    DECLARE book_count INT;

    -- Đếm số chi tiết đơn hàng khác hiện tại
    SELECT COUNT(*) INTO book_count FROM book_order
    WHERE order_id = OLD.order_id
      AND book_order_id != OLD.book_order_id
      AND deleted_at IS NULL;

    -- Nếu đây là chi tiết cuối cùng, từ chối xóa
    IF book_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể xóa chi tiết đơn hàng cuối cùng. Đơn hàng phải có ít nhất 1 sách.';
    END IF;
END$$

DELIMITER ;

-- =====================================================
-- TRIGGER: prevent_empty_order
-- Mục đích: Prevent inserting order_id mà không có items
-- Cách hoạt động: Trigger on INSERT order để check có items không
-- =====================================================
-- Note: Trigger này có thể gây complexity, nên xem xét dùng application logic thay thế

-- =====================================================
-- Xác minh triggers đã được tạo
-- =====================================================
SHOW TRIGGERS IN db_bookstore;

