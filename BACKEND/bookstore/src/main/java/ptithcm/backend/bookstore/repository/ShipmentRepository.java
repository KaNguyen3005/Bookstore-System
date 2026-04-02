package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ptithcm.backend.bookstore.entity.Permission;
import ptithcm.backend.bookstore.entity.Shipment;

import java.math.BigInteger;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
}
