package ptithcm.backend.bookstore.utils;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ptithcm.backend.bookstore.entity.Order;
import ptithcm.backend.bookstore.enums.OrderStatus;
import ptithcm.backend.bookstore.enums.PaymentMethod;
import ptithcm.backend.bookstore.enums.PaymentStatus;
import ptithcm.backend.bookstore.repository.OrderRepository;
import ptithcm.backend.bookstore.service.OrderService;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PendingPaymentCleanupJob {
    private static final int VNPAY_PAYMENT_TIMEOUT_MINUTES = 30;

    OrderRepository orderRepository;
    OrderService orderService;

    @Scheduled(fixedDelay = 60_000)
    @Transactional
    public void cancelExpiredVnpayOrders() {
        LocalDateTime createdBefore = AppTime.now().minusMinutes(VNPAY_PAYMENT_TIMEOUT_MINUTES);
        List<Order> expiredOrders = orderRepository.findExpiredPendingVnpayOrders(
                OrderStatus.PENDING_PAYMENT,
                PaymentMethod.VNPAY,
                PaymentStatus.PENDING,
                createdBefore
        );

        for (Order order : expiredOrders) {
            orderService.cancelUnpaidVnpayOrder(order, order.getPayment(), PaymentStatus.CANCELLED);
            log.info("Cancelled expired VNPay order: orderId={}", order.getOrderId());
        }
    }
}
