package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ptithcm.backend.bookstore.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByUsernameAndUserIdNot(String username, Long userId);

    boolean existsByEmailAndUserIdNot(String email, Long userId);

    boolean existsByPhoneAndUserIdNot(String phone, Long userId);

    Optional<User> findByEmail(String email);

    Optional<User> findByProviderId(String providerId);

    boolean existsByEmail(String email);

    Page<User> findByDeletedAtIsNull(Pageable pageable);

    Long countByRole_RoleNameAndDeletedAtIsNull(String roleName);
}
