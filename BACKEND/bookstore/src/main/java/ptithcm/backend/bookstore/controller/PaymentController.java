package ptithcm.backend.bookstore.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ptithcm.backend.bookstore.dto.request.VNPayPaymentRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.service.PaymentService;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/payments")
public class PaymentController {

    PaymentService paymentService;

    @PostMapping("/vnpay")
    public ApiResponse<String> createPayment(
            @Valid @RequestBody VNPayPaymentRequest request,
            HttpServletRequest httpRequest) throws Exception {
        String paymentUrl = paymentService.createVNPayPayment(request, httpRequest);
        return ApiResponse.<String>builder()
                .result(paymentUrl)
                .build();
    }
}
