package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.Voucher;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {
}
