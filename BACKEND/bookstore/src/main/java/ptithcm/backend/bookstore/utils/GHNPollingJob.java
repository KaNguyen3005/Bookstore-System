package ptithcm.backend.bookstore.utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ptithcm.backend.bookstore.entity.Shipment;
import ptithcm.backend.bookstore.enums.ShippingStatus;
import ptithcm.backend.bookstore.repository.ShipmentRepository;
import ptithcm.backend.bookstore.service.GHNService;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class GHNPollingJob {

    private final ShipmentRepository shipmentRepository;
    private final GHNService ghnService;

    @Scheduled(fixedDelay = 5000) // mỗi 5 giây
    public void syncShippingStatus() {

//        log.info("=== GHN POLLING START ===");

        List<Shipment> shipments = shipmentRepository.findByStatusIn(List.of(
                ShippingStatus.READY_TO_SHIP,
                ShippingStatus.PICKING_UP,
                ShippingStatus.IN_TRANSIT
        ));

        for (Shipment shipment : shipments) {
            try {
                String orderCode = shipment.getTrackingNumber();

                if (orderCode == null || orderCode.isBlank()) continue;

                String ghnStatus = ghnService.getOrderStatus(orderCode);
                log.info("Polled shipment {}: GHN status = {}", shipment.getShipmentId(), ghnStatus);
                ghnService.updateShipment(shipment, ghnStatus);

            } catch (Exception e) {
                log.error("Error polling shipment {}: {}", shipment.getShipmentId(), e.getMessage());
            }
        }

        shipmentRepository.saveAll(shipments);

//        log.info("=== GHN POLLING DONE ===");
    }
}
