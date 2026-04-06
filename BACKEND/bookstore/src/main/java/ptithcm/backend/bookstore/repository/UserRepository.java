package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ptithcm.backend.bookstore.entity.Role;
import ptithcm.backend.bookstore.entity.User;

import java.math.BigInteger;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
