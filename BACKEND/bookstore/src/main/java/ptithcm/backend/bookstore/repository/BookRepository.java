package ptithcm.backend.bookstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.Book;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    /**
     * Tìm tất cả sách chưa bị xóa (soft delete)
     */
    Page<Book> findAllByDeletedAtIsNull(Pageable pageable);

    /**
     * Tìm kiếm sách theo keyword, category, giá cả và sort
     * ✅ FIXED: Thêm check deletedAt
     */
    @Query(value = """
        SELECT DISTINCT b
        FROM Book b
        LEFT JOIN b.categories c
        WHERE b.deletedAt IS NULL
          AND (:keyword IS NULL OR
               LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:categoryId IS NULL OR c.categoryId = :categoryId)
          AND (:minPrice IS NULL OR b.price >= :minPrice)
          AND (:maxPrice IS NULL OR b.price <= :maxPrice)
        ORDER BY
          CASE WHEN :sort = 'asc' THEN b.price END ASC,
          CASE WHEN :sort = 'desc' THEN b.price END DESC,
          b.createdAt DESC
        """,
            countQuery = """
        SELECT COUNT(DISTINCT b)
        FROM Book b
        LEFT JOIN b.categories c
        WHERE b.deletedAt IS NULL
          AND (:keyword IS NULL OR
               LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:categoryId IS NULL OR c.categoryId = :categoryId)
          AND (:minPrice IS NULL OR b.price >= :minPrice)
          AND (:maxPrice IS NULL OR b.price <= :maxPrice)
        """)
    Page<Book> searchBooks(@Param("keyword") String keyword,
                           @Param("categoryId") Integer categoryId,
                           @Param("minPrice") BigDecimal minPrice,
                           @Param("maxPrice") BigDecimal maxPrice,
                           @Param("sort") String sort,
                           Pageable pageable);
}
