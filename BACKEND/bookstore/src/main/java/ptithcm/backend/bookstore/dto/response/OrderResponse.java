package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import ptithcm.backend.bookstore.enums.OrderStatus;
import ptithcm.backend.bookstore.enums.PaymentMethod;
import ptithcm.backend.bookstore.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    Long orderId;
    BigDecimal vatRate;
    BigDecimal vatAmount;
    VoucherResponse voucher;
    BigDecimal totalAmount;
    BigDecimal subtotal;
    BigDecimal discountAmount;
    BigDecimal amountAfterDiscount;
    BigDecimal tierRate;
    List<OrderItemResponse> items;
    ShipmentResponse shipment;
    String staffName;
    String customerName;
    OrderStatus status;
    PaymentMethod paymentMethod;
    PaymentStatus paymentStatus;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    LocalDateTime deletedAt;
}
