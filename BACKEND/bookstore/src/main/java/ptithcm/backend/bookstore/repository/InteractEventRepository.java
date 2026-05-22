package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.InteractEvent;
import ptithcm.backend.bookstore.entity.Voucher;

import java.math.BigInteger;
import java.time.LocalDateTime;

@Repository
public interface InteractEventRepository extends JpaRepository<InteractEvent, Long> {
    boolean existsByCustomer_UserIdAndBook_BookIdAndEventTypeAndEventTimeAfter(
            Long userId,
            Integer bookId,
            String eventType,
            LocalDateTime after
    );
}
