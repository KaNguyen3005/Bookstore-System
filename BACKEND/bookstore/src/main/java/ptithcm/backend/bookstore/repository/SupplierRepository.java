package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.Supplier;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, String> {
}
