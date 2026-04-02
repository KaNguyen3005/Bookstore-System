package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ptithcm.backend.bookstore.entity.Payment;


public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
