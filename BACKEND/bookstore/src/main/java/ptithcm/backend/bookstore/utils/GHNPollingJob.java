package ptithcm.backend.bookstore.utils;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ptithcm.backend.bookstore.entity.Order;
import ptithcm.backend.bookstore.entity.Shipment;
import ptithcm.backend.bookstore.entity.User;
import ptithcm.backend.bookstore.enums.ShippingStatus;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.repository.OrderRepository;
import ptithcm.backend.bookstore.repository.ShipmentRepository;
import ptithcm.backend.bookstore.service.GHNService;
import ptithcm.backend.bookstore.service.OrderService;
import ptithcm.backend.bookstore.service.UserService;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class GHNPollingJob {
    private final OrderRepository orderRepository;

    ShipmentRepository shipmentRepository;
    GHNService ghnService;
    OrderService orderService;
    UserService userService;

    @Scheduled(fixedDelay = 5000) // mỗi 5 giây
    @Transactional
    public void syncShippingStatus() {
        List<Shipment> shipments = shipmentRepository.findByStatusIn(List.of(
                ShippingStatus.READY_TO_SHIP,
                ShippingStatus.PICKING_UP,
                ShippingStatus.IN_TRANSIT
        ));

        for (Shipment shipment : shipments) {
            try {
                String orderCode = shipment.getTrackingNumber();
                if (orderCode == null || orderCode.isBlank()) continue;

                ShippingStatus oldStatus = shipment.getStatus();

                String ghnStatus = ghnService.getOrderStatus(orderCode);
                ShippingStatus newStatus = ghnService.mapStatus(ghnStatus);

                if (newStatus == oldStatus) continue;

                ghnService.updateShipment(shipment, ghnStatus);

                if (oldStatus != ShippingStatus.DELIVERED && newStatus == ShippingStatus.DELIVERED) {
                    Order order = shipment.getOrder();

                    if (order != null) {
                        LocalDateTime now = LocalDateTime.now();
                        order.setDeliveredAt(now);
                        order.setRewardEligibleAt(now.plusDays(3)); // chờ 3 ngày
                    }
                }

            } catch (Exception e) {
                log.error("Error polling shipment {}: {}", shipment.getShipmentId(), e.getMessage());
            }
        }

        shipmentRepository.saveAll(shipments);
    }

    @Scheduled(fixedDelay = 2000) // mỗi 2 giây
    @Transactional
    public void awardRewardPointsForEligibleOrders() {
        List<Order> orders = orderRepository.findEligibleOrdersForReward(LocalDateTime.now());

        for (Order order : orders) {
            if (Boolean.TRUE.equals(order.getRewardPointApplied())) {
                continue;
            }

            Shipment shipment = shipmentRepository.findByOrder_OrderId(order.getOrderId())
                    .orElseThrow(() -> new AppException(ErrorCode.SHIPMENT_NOT_FOUND));
            if (shipment == null) continue;

            // chỉ cộng nếu hiện tại vẫn là DELIVERED
            if (shipment.getStatus() != ShippingStatus.DELIVERED) {
                continue;
            }

            Long points = order.getTotalAmount().longValue() / 10000;

            User user = order.getCustomer();
            if (user == null) continue;

            user.setPoint(user.getPoint() + points);
            userService.pointToTier(user);
            order.setRewardPointApplied(true);
        }
    }
}
