package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.dto.response.RevenueResponse;
import ptithcm.backend.bookstore.entity.Order;
import ptithcm.backend.bookstore.enums.OrderStatus;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    //TODO: Cần hiểu query này
    @Query(value = """
    SELECT DATE(o.created_at) AS period, COALESCE(SUM(o.total_amount), 0) AS revenue
    FROM orders o
    WHERE o.status = :status
      AND o.created_at BETWEEN :from AND :to
    GROUP BY DATE(o.created_at)
    ORDER BY DATE(o.created_at)
    """, nativeQuery = true)
    List<Object[]> getRevenueByDay(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("status") Integer status
    );

    @Query(value = """
    SELECT DATE_FORMAT(o.created_at, '%Y-%m') AS period, COALESCE(SUM(o.total_amount), 0) AS revenue
    FROM orders o
    WHERE o.status = :status
      AND o.created_at BETWEEN :from AND :to
    GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
    ORDER BY DATE_FORMAT(o.created_at, '%Y-%m')
    """, nativeQuery = true)
    List<Object[]> getRevenueByMonth(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("status") Integer status
    );

    @Query(value = """
    SELECT YEAR(o.created_at) AS period, COALESCE(SUM(o.total_amount), 0) AS revenue
    FROM orders o
    WHERE o.status = :status
      AND o.created_at BETWEEN :from AND :to
    GROUP BY YEAR(o.created_at)
    ORDER BY YEAR(o.created_at)
    """, nativeQuery = true)
    List<Object[]> getRevenueByYear(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("status") Integer status
    );

    @Query("""
        SELECT o
        FROM Order o
        WHERE o.rewardPointApplied = false
          AND o.rewardEligibleAt IS NOT NULL
          AND o.rewardEligibleAt <= :now
    """)
    List<Order> findEligibleOrdersForReward(@Param("now") LocalDateTime now);

    /**
     * Lấy danh sách các sách bán chạy nhất trong khoảng thời gian
     * Truy vấn theo ngày (groupBy=day), tháng (groupBy=month) hoặc năm (groupBy=year)
     */
    @Query(value = """
        SELECT b.book_id, b.title, SUM(bo.quantity) as total_quantity_sold
        FROM books b
        INNER JOIN book_order bo ON b.book_id = bo.book_id
        INNER JOIN orders o ON bo.order_id = o.order_id
        WHERE o.status = :status
          AND o.created_at BETWEEN :from AND :to
        GROUP BY b.book_id, b.title
        ORDER BY total_quantity_sold DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> getTopSellingBooks(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("status") Integer status,
            @Param("limit") Integer limit
    );

    /**
     * Lấy sách bán chạy nhất (top 1) trong khoảng thời gian
     */
    @Query(value = """
        SELECT b.book_id, b.title, SUM(bo.quantity) as total_quantity_sold
        FROM books b
        INNER JOIN book_order bo ON b.book_id = bo.book_id
        INNER JOIN orders o ON bo.order_id = o.order_id
        WHERE o.status = :status
          AND o.created_at BETWEEN :from AND :to
        GROUP BY b.book_id, b.title
        ORDER BY total_quantity_sold DESC
        LIMIT 1
        """, nativeQuery = true)
    List<Object[]> getTopSellingBook(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("status") Integer status
    );

    /**
     * Thống kê số lượng đơn hàng theo trạng thái
     */
    @Query(value = """
        SELECT o.status, COUNT(o.order_id) as count
        FROM orders o
        GROUP BY o.status
        ORDER BY o.status
        """, nativeQuery = true)
    List<Object[]> getOrderStatusStatistics();

    /**
     * Lấy số lượng đơn hàng theo từng trạng thái cụ thể
     */
    @Query(value = """
        SELECT COUNT(o.order_id)
        FROM orders o
        WHERE o.status = :status
        """, nativeQuery = true)
    Long countByStatus(@Param("status") Integer status);

    /**
     * Lấy tổng số đơn hàng
     */
    @Query(value = """
        SELECT COUNT(o.order_id)
        FROM orders o
        """, nativeQuery = true)
    Long countTotalOrders();
}
