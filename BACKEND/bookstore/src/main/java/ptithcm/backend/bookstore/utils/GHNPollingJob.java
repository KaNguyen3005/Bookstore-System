package ptithcm.backend.bookstore.utils;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ptithcm.backend.bookstore.entity.Order;
import ptithcm.backend.bookstore.entity.Payment;
import ptithcm.backend.bookstore.entity.Shipment;
import ptithcm.backend.bookstore.entity.User;
import ptithcm.backend.bookstore.enums.OrderStatus;
import ptithcm.backend.bookstore.enums.PaymentMethod;
import ptithcm.backend.bookstore.enums.PaymentStatus;
import ptithcm.backend.bookstore.enums.ShippingStatus;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.repository.OrderRepository;
import ptithcm.backend.bookstore.repository.PaymentRepository;
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
    OrderRepository orderRepository;
    ShipmentRepository shipmentRepository;
    PaymentRepository paymentRepository;
    GHNService ghnService;
    OrderService orderService;
    UserService userService;

    @Scheduled(fixedDelay = 5000)
    @Transactional
    public void syncShippingStatus() {
        List<Shipment> shipments = shipmentRepository.findByStatusIn(List.of(
                ShippingStatus.READY_TO_SHIP,
                ShippingStatus.PICKING_UP,
                ShippingStatus.IN_TRANSIT,
                ShippingStatus.OUT_FOR_DELIVERY
        ));

        for (Shipment shipment : shipments) {
            try {
                String orderCode = shipment.getTrackingNumber();
                if (orderCode == null || orderCode.isBlank()) continue;

                ShippingStatus oldStatus = shipment.getStatus();
                String ghnStatus = ghnService.getOrderStatus(orderCode);
                ShippingStatus newStatus = ghnService.mapStatus(ghnStatus);

                if (newStatus == null || newStatus == oldStatus) continue;

                ghnService.updateShipment(shipment, ghnStatus);
                syncOrderAndPaymentStatus(shipment, oldStatus, newStatus);
            } catch (Exception e) {
                log.warn("Error polling shipment {}: {}", shipment.getShipmentId(), e.getMessage());
            }
        }

        shipmentRepository.saveAll(shipments);
    }

    private void syncOrderAndPaymentStatus(
            Shipment shipment,
            ShippingStatus oldStatus,
            ShippingStatus newStatus
    ) {
        Order order = shipment.getOrder();
        if (order == null) return;

        if (oldStatus != ShippingStatus.DELIVERED && newStatus == ShippingStatus.DELIVERED) {
            LocalDateTime now = AppTime.now();
            order.setStatus(OrderStatus.DELIVERED);
            order.setDeliveredAt(now);
            order.setRewardEligibleAt(now.plusDays(3));
            markCodPayment(order, PaymentStatus.SUCCESS);
            return;
        }

        if (
                newStatus == ShippingStatus.PICKING_UP
                        || newStatus == ShippingStatus.IN_TRANSIT
                        || newStatus == ShippingStatus.OUT_FOR_DELIVERY
        ) {
            if (order.getStatus() != OrderStatus.DELIVERED) {
                order.setStatus(OrderStatus.SHIPPING);
            }
            return;
        }

        if (newStatus == ShippingStatus.CANCELLED || newStatus == ShippingStatus.RETURNING) {
            order.setStatus(OrderStatus.CANCELLED);
            markCodPayment(order, PaymentStatus.CANCELLED);
            return;
        }

        if (newStatus == ShippingStatus.DELIVERY_FAILED) {
            markCodPayment(order, PaymentStatus.FAILED);
        }
    }

    private void markCodPayment(Order order, PaymentStatus status) {
        Payment payment = order.getPayment();

        if (payment == null || payment.getMethod() != PaymentMethod.COD) {
            return;
        }

        if (payment.getStatus() == status) {
            return;
        }

        payment.setStatus(status);
        if (status == PaymentStatus.SUCCESS) {
            payment.setPaidAt(AppTime.now());
        }
        paymentRepository.save(payment);
    }

    @Scheduled(fixedDelay = 2000)
    @Transactional
    public void awardRewardPointsForEligibleOrders() {
        List<Order> orders = orderRepository.findEligibleOrdersForReward(AppTime.now());

        for (Order order : orders) {
            if (Boolean.TRUE.equals(order.getRewardPointApplied())) {
                continue;
            }

            Shipment shipment = shipmentRepository.findByOrder_OrderId(order.getOrderId())
                    .orElseThrow(() -> new AppException(ErrorCode.SHIPMENT_NOT_FOUND));
            if (shipment == null) continue;

            if (shipment.getStatus() != ShippingStatus.DELIVERED) {
                continue;
            }

            Long points = orderService.calculateOrderTotalAmount(order).longValue() / 10000;

            User user = order.getCustomer();
            if (user == null) continue;

            user.setPoint(user.getPoint() + points);
            userService.pointToTier(user);
            order.setRewardPointApplied(true);
        }
    }
}
