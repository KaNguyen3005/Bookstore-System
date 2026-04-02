package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.Address;
import ptithcm.backend.bookstore.entity.Review;

import java.math.BigInteger;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
}
