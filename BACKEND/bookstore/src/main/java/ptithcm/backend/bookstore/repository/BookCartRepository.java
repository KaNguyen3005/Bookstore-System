package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.BookCart;

import java.util.Optional;

@Repository
public interface BookCartRepository extends JpaRepository<BookCart, Long> {
    Optional<BookCart> findByCart_CartIdAndBook_BookId(Long cartId, Integer bookId);
}
