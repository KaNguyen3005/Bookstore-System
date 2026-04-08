package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import ptithcm.backend.bookstore.enums.OrderStatus;

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
    List<OrderItemResponse> items;
    String staffName;
    String customerName;
    OrderStatus status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    LocalDateTime deletedAt;
}
