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
}
