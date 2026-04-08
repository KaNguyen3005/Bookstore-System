package ptithcm.backend.bookstore.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConfirmPaymentRequest {
    Long paymentId;
    String transactionId; // Transaction ID từ payment gateway
    String status; // SUCCESS, FAILED
    String raw; // JSON response từ gateway (tùy chọn)
}
