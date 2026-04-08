package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.Cart;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser_UserId(Long userId);
}
