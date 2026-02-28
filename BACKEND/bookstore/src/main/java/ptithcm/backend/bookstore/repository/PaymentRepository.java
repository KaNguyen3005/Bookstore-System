package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ptithcm.backend.bookstore.entity.Payment;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    @Query("SELECT p FROM Payment p WHERE p.order.id = :orderId")
    Optional<Payment> findByOrderId(@Param("orderId") String orderId);}
