package ptithcm.backend.bookstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    /**
     * Tìm review của một cuốn sách với phân trang
     */
    Page<Review> findByBook_BookId(Integer bookId, Pageable pageable);
}
