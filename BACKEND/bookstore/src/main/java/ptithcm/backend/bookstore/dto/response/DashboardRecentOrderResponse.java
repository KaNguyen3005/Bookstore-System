package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import ptithcm.backend.bookstore.enums.OrderStatus;
import ptithcm.backend.bookstore.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardRecentOrderResponse {
    Long orderId;
    String customerName;
    OrderStatus status;
    PaymentStatus paymentStatus;
    BigDecimal totalAmount;
    LocalDateTime createdAt;
}
