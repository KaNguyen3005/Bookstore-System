package ptithcm.backend.bookstore.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CheckoutSessionRequest;
import ptithcm.backend.bookstore.dto.response.CheckoutSessionResponse;
import ptithcm.backend.bookstore.dto.response.VNPayCallbackResponse;
import ptithcm.backend.bookstore.entity.Order;
import ptithcm.backend.bookstore.entity.Payment;
import ptithcm.backend.bookstore.enums.OrderStatus;
import ptithcm.backend.bookstore.enums.PaymentMethod;
import ptithcm.backend.bookstore.enums.PaymentStatus;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.repository.BookCartRepository;
import ptithcm.backend.bookstore.repository.CartRepository;
import ptithcm.backend.bookstore.repository.OrderRepository;
import ptithcm.backend.bookstore.repository.PaymentRepository;
import ptithcm.backend.bookstore.utils.VNPayUtil;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentService {
    PaymentRepository paymentRepository;
    OrderRepository orderRepository;
    VNPayUtil vnPayUtil;
    CartRepository cartRepository;
    BookCartRepository bookCartRepository;

    /**
     * Tạo session thanh toán
     * Trả về URL redirect cho online payment (VNPAY, MOMO, ZALOPAY)
     * Hoặc thông báo cho COD
     */
    @Transactional
    public CheckoutSessionResponse createCheckoutSession(CheckoutSessionRequest request, HttpServletRequest httpRequest) throws Exception {
        log.info("=== START CREATE CHECKOUT SESSION ===");
        log.info("Request: orderId={}, paymentMethod='{}'", request.getOrderId(), request.getPaymentMethod());

        // 1. Tìm order
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        log.info("Order found: id={}, status={}, totalAmount={}", 
                order.getOrderId(), order.getStatus(), order.getTotalAmount());

        // 2. Kiểm tra order có thể thanh toán không
        if (order.getStatus() != OrderStatus.PENDING) {
            log.warn("Order status is not PENDING: {}", order.getStatus());
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        // 3. Validate payment method
        PaymentMethod paymentMethod = PaymentMethod.COD;
        log.info("Requested payment method: '{}'", request.getPaymentMethod());
        
        if (request.getPaymentMethod() != null && !request.getPaymentMethod().trim().isEmpty()) {
            try {
                // Convert to uppercase and validate
                String methodStr = request.getPaymentMethod().toUpperCase().trim();
                log.info("Converting to uppercase: '{}' -> '{}'", request.getPaymentMethod(), methodStr);
                paymentMethod = PaymentMethod.valueOf(methodStr);
                log.info("Payment method validated successfully: {}", paymentMethod);
            } catch (IllegalArgumentException e) {
                log.error("Invalid payment method: '{}'. Valid values: VNPAY, MOMO, ZALOPAY, COD", request.getPaymentMethod());
                throw new AppException(ErrorCode.VALIDATION_ERROR);
            }
        } else {
            log.info("No payment method specified, using default: COD");
        }

        // 4. Lấy (hoặc tạo) Payment record
        // NOTE: OrderService.create() thường đã tạo payment, nhưng để an toàn vẫn xử lý trường hợp null
        Payment payment = paymentRepository.findByOrder_OrderId(order.getOrderId());
        if (payment == null) {
            payment = Payment.builder()
                    .order(order)
                    .method(paymentMethod)
                    .status(PaymentStatus.PENDING)
                    .amount(order.getTotalAmount())
                    .build();
            payment = paymentRepository.save(payment);
        } else {
            // Cập nhật method theo request hiện tại (VD: user chọn COD/VNPAY ở bước checkout)
            payment.setMethod(paymentMethod);
            payment = paymentRepository.save(payment);
        }
        // 5. Tạo response
        CheckoutSessionResponse response = CheckoutSessionResponse.builder()
                .paymentId(payment.getPaymentId())
                .paymentMethod(paymentMethod.name())
                .build();

         // 6. Tạo URL redirect nếu là online payment


        switch (paymentMethod) {
             case VNPAY:
                 log.error("Đã vào");
                 String vnpayUrl = generateVNPayUrl(order, httpRequest);
                 response.setRedirectUrl(vnpayUrl);
                 log.info("Generated VNPAY URL: {}", vnpayUrl);
                 break;
            case COD:
                response.setMessage("Thanh toán khi nhận hàng - COD");
                log.info("COD payment selected");

                // Với COD không có callback online để biết "thành công".
                // Thực tế nghiệp vụ: khi user đã xác nhận đặt hàng COD thì nên clear cart ngay.
                cleanCartAfterPaymentSuccess(order);
                break;
            default:
                log.error("Unexpected payment method: {}", paymentMethod);
                throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        log.info("=== END CREATE CHECKOUT SESSION ===");
        return response;
    }

    /**
     * Lấy tất cả parameters từ HttpServletRequest
     * VNPay gửi callback dưới dạng GET request với query parameters
     */
    public Map<String, String> extractVNPayParams(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        Enumeration<String> parameterNames = request.getParameterNames();

        while (parameterNames.hasMoreElements()) {
            String paramName = parameterNames.nextElement();
            String paramValue = request.getParameter(paramName);
            params.put(paramName, paramValue);
            log.debug("Param: {} = {}", paramName, paramValue);
        }

        return params;
    }

    /**
     * Xác thực chữ ký callback từ VNPay
     */
    public boolean verifyVNPayCallback(Map<String, String> params) throws Exception {
        log.info("=== VERIFY VNPAY SIGNATURE ===");
        boolean isValid = vnPayUtil.verifyCallback(params);
        log.info("Signature verification result: {}", isValid ? "VALID" : "INVALID");
        return isValid;
    }

    /**
     * Xử lý callback từ VNPay
     * 
     * Các tham số chính VNPay gửi về:
     * - vnp_TxnRef: Tham chiếu giao dịch (Order ID)
     * - vnp_Amount: Số tiền thanh toán (tính bằng 1/100 VND)
     * - vnp_BankCode: Mã ngân hàng
     * - vnp_BankTranNo: Mã giao dịch tại ngân hàng
     * - vnp_CardType: Loại thẻ
     * - vnp_OrderInfo: Thông tin đơn hàng
     * - vnp_PayDate: Ngày thanh toán (yyyyMMddHHmmss)
     * - vnp_ResponseCode: Mã phản hồi
     *   "00" = Giao dịch thành công
     *   "01" = Giao dịch lỗi
     *   "02" = Giao dịch bị từ chối
     *   "04" = Giao dịch hoàn lại
     *   "05" = Giao dịch nghi ngờ
     * - vnp_SecureHash: Chữ ký
     * - vnp_TransactionNo: Mã giao dịch tại VNPay
     * - vnp_TransactionStatus: Trạng thái giao dịch (0 = thành công)
     */
    @Transactional
    public VNPayCallbackResponse processVNPayCallback(Map<String, String> params) {
        log.info("=== PROCESS VNPAY CALLBACK ===");

        // 1. Lấy dữ liệu callback
        String txnRef = params.get("vnp_TxnRef");
        String vnpAmount = params.get("vnp_Amount");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");
        String payDate = params.get("vnp_PayDate");
        String orderInfo = params.get("vnp_OrderInfo");
        String bankCode = params.get("vnp_BankCode");
        String transactionStatus = params.get("vnp_TransactionStatus");

        log.info(
                "VNPay callback received - txnRef={}, responseCode={}, transactionStatus={}, transactionNo={}, amount={}",
                txnRef, responseCode, transactionStatus, transactionNo, vnpAmount
        );

        try {
            // 2. Validate dữ liệu đầu vào cơ bản
            if (txnRef == null || txnRef.isBlank()) {
                throw new AppException(ErrorCode.VALIDATION_ERROR);
            }

            if (vnpAmount == null || vnpAmount.isBlank()) {
                throw new AppException(ErrorCode.VALIDATION_ERROR);
            }

            Long orderId = Long.parseLong(txnRef);
            long amountVND = Long.parseLong(vnpAmount) / 100;

            // 3. Tìm order
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

            // 4. Tìm payment
            Payment payment = paymentRepository.findByOrder_OrderId(orderId);
            if (payment == null) {
                log.error("Payment not found for orderId={}", orderId);
                throw new AppException(ErrorCode.PAYMENT_NOT_FOUND);
            }

            log.info("Order found: orderId={}, orderStatus={}, totalAmount={}",
                    order.getOrderId(), order.getStatus(), order.getTotalAmount());

            log.info("Payment found: paymentId={}, paymentStatus={}",
                    payment.getPaymentId(), payment.getStatus());

            // 5. Chống xử lý lặp
            if (PaymentStatus.SUCCESS.equals(payment.getStatus())) {
                log.warn("Payment already marked SUCCESS, skip updating. orderId={}", orderId);

                return VNPayCallbackResponse.builder()
                        .transactionNo(transactionNo)
                        .transactionRef(txnRef)
                        .amount(amountVND)
                        .responseCode(responseCode)
                        .status("SUCCESS")
                        .message("Thanh toán đã được xử lý trước đó")
                        .description("Giao dịch đã được xác nhận trước đó")
                        .orderId(orderId)
                        .paymentId(payment.getPaymentId())
                        .payDate(payDate)
                        .bankCode(bankCode)
                        .orderInfo(orderInfo)
                        .build();
            }

            // 6. Validate số tiền
            BigDecimal expectedAmount = order.getTotalAmount();
            if (expectedAmount == null || expectedAmount.longValue() != amountVND) {
                log.error("Amount mismatch! orderId={}, expected={}, received={}",
                        orderId, expectedAmount, amountVND);

                payment.setStatus(PaymentStatus.FAILED);
                payment.setTransactionId(transactionNo);

                // Tuỳ business: có thể để PENDING thay vì CANCELLED
                order.setStatus(OrderStatus.CANCELLED);

                paymentRepository.save(payment);
                orderRepository.save(order);

                return VNPayCallbackResponse.builder()
                        .transactionNo(transactionNo)
                        .transactionRef(txnRef)
                        .amount(amountVND)
                        .responseCode(responseCode)
                        .status("FAILED")
                        .message("Thanh toán thất bại")
                        .description("Số tiền thanh toán không khớp")
                        .orderId(orderId)
                        .paymentId(payment.getPaymentId())
                        .payDate(payDate)
                        .bankCode(bankCode)
                        .orderInfo(orderInfo)
                        .build();
            }

            // 7. Check trạng thái thành công
            boolean isSuccess = "00".equals(responseCode) && "00".equals(transactionStatus);

            if (isSuccess) {
                log.info("Payment success for orderId={}", orderId);

                payment.setStatus(PaymentStatus.SUCCESS);
                payment.setMethod(PaymentMethod.VNPAY);
                payment.setTransactionId(transactionNo);
                payment.setAmount(BigDecimal.valueOf(amountVND));
                payment.setPaidAt(parseVNPayPayDate(payDate));

                order.setStatus(OrderStatus.CONFIRMED);

                // 9. Clean cart sau khi thanh toán thành công
                cleanCartAfterPaymentSuccess(order);
            } else {
                log.warn("Payment failed for orderId={}, responseCode={}, transactionStatus={}",
                        orderId, responseCode, transactionStatus);

                payment.setStatus(PaymentStatus.FAILED);
                payment.setMethod(PaymentMethod.VNPAY);
                payment.setTransactionId(transactionNo);

                // Tuỳ business
                order.setStatus(OrderStatus.CANCELLED);
            }

            // 8. Save DB
            Payment savedPayment = paymentRepository.save(payment);
            Order savedOrder = orderRepository.save(order);

            log.info("Saved paymentId={}, paymentStatus={}", savedPayment.getPaymentId(), savedPayment.getStatus());
            log.info("Saved orderId={}, orderStatus={}", savedOrder.getOrderId(), savedOrder.getStatus());

            // 9. Build response
            String status = isSuccess ? "SUCCESS" : "FAILED";
            String message = isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại";
            String description = isSuccess
                    ? "Giao dịch đã được xác nhận"
                    : getVNPayErrorMessage(responseCode);

            return VNPayCallbackResponse.builder()
                    .transactionNo(transactionNo)
                    .transactionRef(txnRef)
                    .amount(amountVND)
                    .responseCode(responseCode)
                    .status(status)
                    .message(message)
                    .description(description)
                    .orderId(orderId)
                    .paymentId(savedPayment.getPaymentId())
                    .payDate(payDate)
                    .bankCode(bankCode)
                    .orderInfo(orderInfo)
                    .build();

        } catch (AppException e) {
            log.error("Business error when processing VNPay callback", e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error when processing VNPay callback", e);
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        } finally {
            log.info("=== END PROCESS VNPAY CALLBACK ===");
        }
    }

    private LocalDateTime parseVNPayPayDate(String payDate) {
        try {
            if (payDate == null || payDate.isBlank()) {
                return LocalDateTime.now();
            }
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            return LocalDateTime.parse(payDate, formatter);
        } catch (Exception e) {
            log.warn("Cannot parse vnp_PayDate={}, fallback to now()", payDate);
            return LocalDateTime.now();
        }
    }

    /**
     * Xóa / giảm số lượng các item trong giỏ sau khi thanh toán thành công.
     * - Nếu trong cart có số lượng > số lượng mua -> giảm quantity
     * - Nếu <= số lượng mua -> xóa item khỏi cart
     */
    private void cleanCartAfterPaymentSuccess(Order order) {
        try {
            if (order == null || order.getCustomer() == null || order.getCustomer().getUserId() == null) {
                return;
            }

            var cartOpt = cartRepository.findByUser_UserId(order.getCustomer().getUserId());
            if (cartOpt.isEmpty()) {
                log.info("Cart not found for userId={}, skip clean cart", order.getCustomer().getUserId());
                return;
            }

            var cart = cartOpt.get();
            if (order.getBookOrders() == null || order.getBookOrders().isEmpty()) {
                return;
            }

            // Gom số lượng mua theo bookId (đề phòng đơn có nhiều dòng trùng book)
            Map<Integer, Integer> purchasedQtyByBookId = order.getBookOrders().stream()
                    .filter(bo -> bo != null && bo.getBook() != null && bo.getBook().getBookId() != null)
                    .collect(Collectors.toMap(
                            bo -> bo.getBook().getBookId(),
                            bo -> bo.getQuantity() == null ? 0 : bo.getQuantity(),
                            Integer::sum
                    ));

            for (Map.Entry<Integer, Integer> entry : purchasedQtyByBookId.entrySet()) {
                Integer bookId = entry.getKey();
                int purchasedQty = entry.getValue() == null ? 0 : entry.getValue();
                if (purchasedQty <= 0) continue;

                var bookCartOpt = bookCartRepository.findByCart_CartIdAndBook_BookId(cart.getCartId(), bookId);
                if (bookCartOpt.isEmpty()) continue;

                var bookCart = bookCartOpt.get();
                int remaining = bookCart.getQuantity() - purchasedQty;
                if (remaining > 0) {
                    bookCart.setQuantity(remaining);
                    bookCartRepository.save(bookCart);
                } else {
                    bookCartRepository.delete(bookCart);
                }
            }
        } catch (Exception e) {
            // Không để clean cart làm fail flow thanh toán
            log.warn("Clean cart failed for orderId={}, reason={}", order != null ? order.getOrderId() : null, e.getMessage());
        }
    }

    /**
     * Lấy trạng thái thanh toán
     */
    public Object getPaymentStatus(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        return Map.of(
            "paymentId", payment.getPaymentId(),
            "orderId", payment.getOrder().getOrderId(),
            "method", payment.getMethod().name(),
            "status", payment.getStatus().name(),
            "amount", payment.getAmount(),
            "transactionId", payment.getTransactionId(),
            "paidAt", payment.getPaidAt(),
            "createdAt", payment.getCreatedAt()
        );
    }

    /**
     * Map mã lỗi từ VNPay sang thông báo tiếng Việt
     */
    private String getVNPayErrorMessage(String responseCode) {
        return switch (responseCode) {
            case "01" -> "Giao dịch bị từ chối bởi NGÂN HÀNG";
            case "02" -> "Giao dịch bị từ chối bởi VNPay";
            case "03" -> "Giao dịch thất bại - Sai chữ ký";
            case "04" -> "Giao dịch hoàn lại";
            case "05" -> "Giao dịch nghi ngờ";
            case "06" -> "Tài khoản của Quý khách hàng bị khóa thanh toán";
            case "07" -> "Đơn vị phát hành thẻ từ chối giao dịch";
            case "08" -> "Thẻ/Tài khoản chưa được đăng ký dịch vụ InternetBanking";
            case "09" -> "Thẻ/Tài khoản bị tạm khóa";
            case "10" -> "Thẻ/Tài khoản bị khóa";
            case "11" -> "Thẻ/Tài khoản hết hạn";
            case "12" -> "Thẻ/Tài khoản chưa đủ điều kiện sử dụng";
            case "13" -> "Giao dịch không được phép từ khó năng của thẻ";
            case "14" -> "Hạn mức thanh toán đã vượt quá";
            case "15" -> "Thẻ/Tài khoản không đủ số dư để thực hiện giao dịch";
            case "16" -> "Thẻ/Tài khoản chưa được cấu hình mã PIN";
            case "17" -> "Sai mã PIN";
            case "18" -> "Giao dịch bị hủy bởi người dùng";
            case "19" -> "Giao dịch bị timeout";
            case "20" -> "Giao dịch bị lỗi, vui lòng thử lại";
            default -> "Giao dịch thất bại (Mã lỗi: " + responseCode + ")";
        };
    }

     /**
      * Sinh URL thanh toán VNPAY
      */
    private String generateVNPayUrl(Order order, HttpServletRequest httpRequest) throws Exception {
        return vnPayUtil.buildPaymentUrl(
                order.getOrderId().toString(),
                order.getTotalAmount(),
                "Thanh toán đơn hàng #" + order.getOrderId(),
                null, // bankCode để trống để VNPay hiển thị trang chọn ngân hàng
                "vn",
                httpRequest
        );
    }
}
