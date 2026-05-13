package ptithcm.backend.bookstore.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import ptithcm.backend.bookstore.dto.request.CheckoutSessionRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.CheckoutSessionResponse;
import ptithcm.backend.bookstore.dto.response.VNPayCallbackResponse;
import ptithcm.backend.bookstore.service.PaymentService;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/payments")
public class PaymentController {

    PaymentService paymentService;

    /**
     * API 1: Tạo session thanh toán
     * POST /api/v1/payments/checkout
     * Trả về URL redirect nếu là online payment
     * Hoặc thông báo nếu là COD
     */
    @PostMapping("/checkout")
    ApiResponse<CheckoutSessionResponse> createCheckoutSession(
            @RequestBody CheckoutSessionRequest request,
            HttpServletRequest httpRequest) throws Exception {
        CheckoutSessionResponse result = paymentService.createCheckoutSession(request, httpRequest);
        return ApiResponse.<CheckoutSessionResponse>builder()
                .result(result)
                .message("Checkout session created successfully")
                .build();
    }

    /**
     * API 2: Callback từ VNPay khi thanh toán hoàn thành
     * GET /api/v1/payments/callback
     * 
     * VNPay sẽ redirect user đến URL này với các tham số query
     * Ví dụ: vnp_TxnRef, vnp_Amount, vnp_TransactionNo, vnp_ResponseCode, vnp_SecureHash, etc.
     */
    @GetMapping("/callback")
    public Object handleVNPayCallback(HttpServletRequest request) {
        log.info("=== START VNPAY CALLBACK ===");
        log.info("Request URL: {}", request.getRequestURL());
        log.info("Query String: {}", request.getQueryString());

        try {
            // Lấy tất cả parameters từ request
            Map<String, String> params = paymentService.extractVNPayParams(request);
            log.info("Extracted params: {}", params);

            // Xác thực callback từ VNPay
            boolean isValid = paymentService.verifyVNPayCallback(params);

            if (!isValid) {
                log.error("VNPAY callback signature verification failed!");

                return new RedirectView(
                        "http://localhost:3000/payment-failed?message=invalid_signature"
                );
            }

            // Xử lý callback
            VNPayCallbackResponse response =
                    paymentService.processVNPayCallback(params);

            log.info("=== END VNPAY CALLBACK - SUCCESS ===");

            String frontendUrl;

            if ("00".equals(response.getResponseCode())) {

                frontendUrl =
                        "http://localhost:5173/payment/success"
                                + "?orderId=" + response.getOrderId()
                                + "&amount=" + response.getAmount();

            } else {

                frontendUrl =
                        "http://localhost:5173/payment/fail"
                                + "?message=" + response.getMessage();
            }

            return new RedirectView(frontendUrl);

        } catch (Exception e) {
            log.error("Error processing VNPAY callback: ", e);

            return new RedirectView(
                    "http://localhost:3000/payment-failed?message=server_error"
            );
        }
    }

    /**
     * API 3: Check trạng thái thanh toán
     * GET /api/v1/payments/{paymentId}/status
     */
    @GetMapping("/{paymentId}/status")
    ApiResponse<Object> getPaymentStatus(@PathVariable Long paymentId) {
        Object paymentStatus = paymentService.getPaymentStatus(paymentId);
        return ApiResponse.builder()
                .result(paymentStatus)
                .message("Payment status retrieved successfully")
                .build();
    }

    // Helper methods để tạo response
    private Object buildSuccessResponse(VNPayCallbackResponse response) {
        // Có thể redirect đến frontend hoặc trả về JSON
        // Ở đây trả về JSON cho tiện test
        return ApiResponse.builder()
                .result(response)
                .message("Payment processed successfully")
                .build();
    }

    private Object buildErrorResponse(String message) {
        return ApiResponse.builder()
                .code(999) // Error code
                .message(message)
                .build();
    }
}
