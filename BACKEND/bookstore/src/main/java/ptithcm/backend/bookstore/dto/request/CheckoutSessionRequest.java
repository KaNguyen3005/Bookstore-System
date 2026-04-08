package ptithcm.backend.bookstore.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutSessionRequest {
    Long orderId;
    String paymentMethod; // VNPAY, MOMO, ZALOPAY, COD
    String bankCode; // Mã ngân hàng (tùy chọn)
    String language; // Ngôn ngữ (VN, EN)
    String returnUrl; // URL trở về sau thanh toán
    String cancelUrl; // URL khi hủy
}
