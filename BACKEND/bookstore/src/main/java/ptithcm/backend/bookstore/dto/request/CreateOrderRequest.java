package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
    Long addressId;

    @NotEmpty(message = "INVALID_ORDER_ITEMS")
    @Valid
    List<OrderItemRequest> items;

    @NotBlank(message = "INVALID_PAYMENT_METHOD")
    @Pattern(regexp = "VNPAY|COD", message = "INVALID_PAYMENT_METHOD")
    String paymentMethod;

    @Size(max = 50, message = "INVALID_VOUCHER_CODE")
    String voucherCode;
}
