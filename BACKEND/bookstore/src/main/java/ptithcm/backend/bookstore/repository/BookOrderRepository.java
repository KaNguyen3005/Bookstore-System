package ptithcm.backend.bookstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.BookOrder;

import java.util.Optional;

@Repository
public interface BookOrderRepository extends JpaRepository<BookOrder, Long> {
    // Get all BookOrder entries with reviews for a specific book
    @Query("SELECT bo FROM BookOrder bo WHERE bo.book.bookId = :bookId")
    Page<BookOrder> findAllByBook_BookId(@Param("bookId") Integer bookId, Pageable pageable);
    Optional<BookOrder> findByBookOrderIdAndOrder_OrderId(Long itemId, Long orderId);
}
