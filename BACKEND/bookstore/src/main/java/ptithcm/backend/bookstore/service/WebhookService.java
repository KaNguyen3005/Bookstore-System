package ptithcm.backend.bookstore.service;


import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.utils.AppTime;
import ptithcm.backend.bookstore.entity.Order;
import ptithcm.backend.bookstore.entity.Payment;
import ptithcm.backend.bookstore.entity.Shipment;
import ptithcm.backend.bookstore.enums.OrderStatus;
import ptithcm.backend.bookstore.enums.PaymentMethod;
import ptithcm.backend.bookstore.enums.PaymentStatus;
import ptithcm.backend.bookstore.enums.ShippingStatus;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.repository.OrderRepository;
import ptithcm.backend.bookstore.repository.PaymentRepository;
import ptithcm.backend.bookstore.repository.ShipmentRepository;

import java.util.Map;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class WebhookService {

    ShipmentRepository shipmentRepository;
    OrderRepository orderRepository;
    PaymentRepository paymentRepository;

    @Transactional
    public void handleGHNWebhook(Map<String, Object> payload) {
        String orderCode = getString(payload, "OrderCode");
        String status = getString(payload, "Status");
        String clientOrderCode = getString(payload, "ClientOrderCode");

        if (orderCode == null || status == null) {
            log.warn("Webhook thiếu OrderCode hoặc Status: {}", payload);
            return;
        }

        Shipment shipment = shipmentRepository.findByTrackingNumber(orderCode)
                .orElseThrow(() -> new AppException(ErrorCode.SHIPMENT_NOT_FOUND));

        ShippingStatus newShippingStatus = mapGHNStatus(status);

        if (newShippingStatus != null && shipment.getStatus() != newShippingStatus) {
            shipment.setStatus(newShippingStatus);
        }

        Order order = shipment.getOrder();
        if (order != null) {
            if ("delivered".equals(status)) {
                order.setStatus(OrderStatus.DELIVERED);
                order.setDeliveredAt(AppTime.now());
                order.setRewardEligibleAt(AppTime.now().plusDays(3));
                markCodPayment(order, PaymentStatus.SUCCESS);
            } else if ("cancel".equals(status) || "returned".equals(status)) {
                order.setStatus(OrderStatus.CANCELLED);
                markCodPayment(order, PaymentStatus.CANCELLED);
            } else if ("delivery_fail".equals(status)) {
                markCodPayment(order, PaymentStatus.FAILED);
            } else if (
                    newShippingStatus == ShippingStatus.PICKING_UP
                            || newShippingStatus == ShippingStatus.IN_TRANSIT
                            || newShippingStatus == ShippingStatus.OUT_FOR_DELIVERY
            ) {
                order.setStatus(OrderStatus.SHIPPING);
            }
            orderRepository.save(order);
        }

        shipmentRepository.save(shipment);

        log.info("Cập nhật GHN webhook thành công. orderCode={}, clientOrderCode={}, status={}",
                orderCode, clientOrderCode, status);
    }

    private ShippingStatus mapGHNStatus(String status) {
        return switch (status) {
            case "ready_to_pick" -> ShippingStatus.READY_TO_SHIP;
            case "picking", "picked" -> ShippingStatus.PICKING_UP;
            case "storing", "transporting", "sorting" -> ShippingStatus.IN_TRANSIT;
            case "delivering", "money_collect_delivering" -> ShippingStatus.OUT_FOR_DELIVERY;
            case "delivered" -> ShippingStatus.DELIVERED;
            case "delivery_fail" -> ShippingStatus.DELIVERY_FAILED;
            case "cancel" -> ShippingStatus.CANCELLED;
            case "return", "return_transporting", "return_sorting", "returning", "returned" ->
                    ShippingStatus.RETURNING;
            default -> {
                log.warn("GHN status chưa được map: {}", status);
                yield null;
            }
        };
    }

    private String getString(Map<String, Object> payload, String key) {
        Object value = payload.get(key);
        return value == null ? null : value.toString();
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
}

