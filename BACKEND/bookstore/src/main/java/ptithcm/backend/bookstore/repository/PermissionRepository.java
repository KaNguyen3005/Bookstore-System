package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ptithcm.backend.bookstore.entity.Permission;

public interface PermissionRepository extends JpaRepository<Permission, Integer> {
}
