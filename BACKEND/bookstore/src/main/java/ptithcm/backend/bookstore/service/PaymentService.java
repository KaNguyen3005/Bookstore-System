package ptithcm.backend.bookstore.service;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.VNPayPaymentRequest;
import ptithcm.backend.bookstore.entity.Order;
import ptithcm.backend.bookstore.entity.Payment;
import ptithcm.backend.bookstore.enums.OrderStatus;
import ptithcm.backend.bookstore.enums.PaymentMethod;
import ptithcm.backend.bookstore.enums.PaymentStatus;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.repository.OrderRepository;
import ptithcm.backend.bookstore.repository.PaymentRepository;
import ptithcm.backend.bookstore.utils.VNPayUtil;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final VNPayUtil vnPayUtil;

    // Tạo URL thanh toán VNPay
    public String createVNPayPayment(VNPayPaymentRequest request, HttpServletRequest httpRequest) throws Exception {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Kiểm tra order đã thanh toán chưa
        paymentRepository.findByOrderId(request.getOrderId())
                .ifPresent(p -> {
                    if (p.getStatus() == PaymentStatus.SUCCESS)
                        throw new AppException(ErrorCode.PAYMENT_ALREADY_SUCCESS);
                });

        Payment payment = Payment.builder()
                .order(order)
                .method(PaymentMethod.VNPAY)
                .status(PaymentStatus.PENDING)
                .amount(order.getTotalAmount())
                .build();
        paymentRepository.save(payment);

        String orderInfo = request.getOrderInfo() != null
                ? request.getOrderInfo()
                : "Thanh toan don hang " + request.getOrderId();

        return vnPayUtil.buildPaymentUrl(
                request.getOrderId(),
                order.getTotalAmount(),
                orderInfo,
                request.getBankCode(),
                request.getLanguage(),
                httpRequest
        );
    }

    // Xử lý callback từ VNPay
    @Transactional
    public void handleVNPayCallback(Map<String, String> params) throws Exception {
        // 1. Xác thực chữ ký
        if (!vnPayUtil.verifyCallback(params)) {
            throw new AppException(ErrorCode.INVALID_SIGNATURE);
        }

        String orderId = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode"); // "00" là thành công
        String transactionId = params.get("vnp_TransactionNo");
        String bankCode = params.get("vnp_BankCode");

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        Order order = payment.getOrder();

        if ("00".equals(responseCode)) {
            // Thanh toán thành công
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId(transactionId);
            payment.setBankCode(bankCode);
            payment.setPaidAt(LocalDateTime.now());
            order.setStatus(OrderStatus.CONFIRMED);
        } else {
            // Thanh toán thất bại
            payment.setStatus(PaymentStatus.FAILED);
            order.setStatus(OrderStatus.CANCELLED);
        }

        paymentRepository.save(payment);
        orderRepository.save(order);
        log.info("VNPay callback xử lý xong - orderId: {}, status: {}", orderId, payment.getStatus());
    }
}
