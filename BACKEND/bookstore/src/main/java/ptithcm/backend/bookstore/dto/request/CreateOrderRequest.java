package ptithcm.backend.bookstore.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import ptithcm.backend.bookstore.entity.Book;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {
    String source;
    Long addressId;
    List<OrderItemRequest> orderItemRequests;
    String paymentMethod;
    String voucherCode;
}
