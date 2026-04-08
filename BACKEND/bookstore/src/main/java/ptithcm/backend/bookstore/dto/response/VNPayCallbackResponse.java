package ptithcm.backend.bookstore.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VNPayCallbackResponse implements Serializable {

    /**
     * Mã giao dịch của VNPay
     * VNPay gửi: vnp_TransactionNo
     */
    @JsonProperty("transaction_no")
    String transactionNo;

    /**
     * Tham chiếu giao dịch (Order ID)
     * VNPay gửi: vnp_TxnRef
     */
    @JsonProperty("transaction_ref")
    String transactionRef;

    /**
     * Số tiền thanh toán (tính theo VND)
     * VNPay gửi: vnp_Amount (đơn vị: 1/100 VND, cần chia cho 100)
     */
    @JsonProperty("amount")
    Long amount;

    /**
     * Mã phản hồi từ VNPay
     * vnp_ResponseCode = "00" => Giao dịch thành công
     * Các mã khác => Giao dịch thất bại
     */
    @JsonProperty("response_code")
    String responseCode;

    /**
     * Trạng thái giao dịch
     * Có thể là: SUCCESS, FAILED, PENDING, CANCELLED
     */
    @JsonProperty("status")
    String status;

    /**
     * Thông báo từ VNPay
     */
    @JsonProperty("message")
    String message;

    /**
     * Mô tả lỗi (nếu có)
     */
    @JsonProperty("description")
    String description;

    /**
     * Order ID từ cơ sở dữ liệu
     */
    @JsonProperty("order_id")
    Long orderId;

    /**
     * Payment ID từ cơ sở dữ liệu
     */
    @JsonProperty("payment_id")
    Long paymentId;

    /**
     * Thời gian thanh toán
     * VNPay gửi: vnp_PayDate (định dạng: yyyyMMddHHmmss)
     */
    @JsonProperty("pay_date")
    String payDate;

    /**
     * Thời gian giao dịch tại VNPay
     */
    @JsonProperty("transaction_date")
    String transactionDate;

    /**
     * Loại ngân hàng
     */
    @JsonProperty("bank_code")
    String bankCode;

    /**
     * Tên ngân hàng
     */
    @JsonProperty("bank_name")
    String bankName;

    /**
     * Thông tin đơn hàng
     */
    @JsonProperty("order_info")
    String orderInfo;
}

