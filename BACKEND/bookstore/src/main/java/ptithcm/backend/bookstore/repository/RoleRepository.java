package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ptithcm.backend.bookstore.entity.Role;

import java.math.BigInteger;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}
