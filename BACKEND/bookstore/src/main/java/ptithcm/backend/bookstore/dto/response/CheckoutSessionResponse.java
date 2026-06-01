package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutSessionResponse {
    Long paymentId;
    String paymentMethod;
    String redirectUrl; // URL để redirect (chỉ có với online payment)
    String message; // Thông báo (để trống nếu là online, "Thanh toán COD" nếu COD)
}
