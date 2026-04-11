package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutSessionRequest {
    Long orderId;
    @NotBlank(message = "INVALID_PAYMENT_METHOD")
    @Pattern(regexp = "VNPAY|COD", message = "INVALID_PAYMENT_METHOD")
    String paymentMethod; // VNPAY, COD
}
