package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VNPayPaymentRequest {

    @NotBlank(message = "INVALID_ORDER_ID")
    String orderId;
    @NotBlank(message = "INVALID_BANK_CODE")
    String bankCode;      // Ngân hàng muốn thanh toán: NCB, VCB, TCB... để trống thì VNPay tự chọn
    String orderInfo;     // Mô tả đơn hàng — nếu null sẽ dùng default
    @NotBlank(message = "INVALID_LANGUAGE")
    String language = "vn";  // vn hoặc en
}
