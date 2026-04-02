package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ptithcm.backend.bookstore.entity.Role;
import ptithcm.backend.bookstore.entity.User;

import java.math.BigInteger;

public interface UserRepository extends JpaRepository<User, Long> {
}
