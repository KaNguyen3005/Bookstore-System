package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import ptithcm.backend.bookstore.entity.Payment;
import ptithcm.backend.bookstore.entity.Shipment;

import java.util.List;


public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByOrder_OrderId(Long orderId);

    @Query("""
        select p from Payment p
        where p.order.orderId in :orderIds
    """)
    List<Payment> findByOrderIds(List<Long> orderIds);
}
