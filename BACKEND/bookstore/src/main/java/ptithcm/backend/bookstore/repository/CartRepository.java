package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.Book;
import ptithcm.backend.bookstore.entity.Cart;

import java.math.BigInteger;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
}
