package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ptithcm.backend.bookstore.entity.Permission;
import ptithcm.backend.bookstore.entity.Shipment;
import ptithcm.backend.bookstore.enums.ShippingStatus;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByOrder_OrderId(Long orderId);
    Optional<Shipment> findByTrackingNumber(String trackingNumber);
    List<Shipment> findByStatusIn(List<ShippingStatus> statuses);
    @Query("""
        select s from Shipment s
        where s.order.orderId in :orderIds
    """)
    List<Shipment> findByOrderIds(List<Long> orderIds);
}
