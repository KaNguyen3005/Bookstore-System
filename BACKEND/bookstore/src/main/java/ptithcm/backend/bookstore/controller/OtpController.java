package ptithcm.backend.bookstore.controller;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ptithcm.backend.bookstore.dto.request.SendOtpRequest;
import ptithcm.backend.bookstore.dto.request.VerifyOtpRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.service.OtpService;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/otp")
public class OtpController {
    OtpService otpService;

    @PostMapping("/send")
    public ApiResponse<Void> sendOtp(@RequestBody SendOtpRequest request) {
        otpService.sendOtp(request.getEmail());
        return ApiResponse.<Void>builder()
                .message("OTP đã được gửi đến email của bạn")
                .build();
    }

    @PostMapping("/verify")
    public ApiResponse<Void> verifyOtp(@RequestBody VerifyOtpRequest request) {
        boolean valid = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (valid) {
            return ApiResponse.<Void>builder()
                    .message("OTP hợp lệ")
                    .build();
        }

        return ApiResponse.<Void>builder()
                .message("OTP không hợp lệ hoặc đã hết hạn")
                .build();
    }
}
