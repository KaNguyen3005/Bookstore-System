package ptithcm.backend.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.utils.OtpUtil;

import java.time.LocalDateTime;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    EmailService emailService;
    OtpStoreService otpStoreService;

    public LocalDateTime sendOtp(String email) {
        String otp = OtpUtil.generateOtp();

        // Lưu và nhận lại thời gian hết hạn
        LocalDateTime expiryTime = otpStoreService.saveOtp(email, otp);

        // Gửi email (vẫn tiếp tục xử lý)
        emailService.sendOtpEmail(email, otp);
        log.warn("OTP sent to {}: {} (expires at {})", email, otp, expiryTime);
        // Trả về thời gian kết thúc cho Controller hoặc Service lớp trên
        return expiryTime;
    }

    public boolean verifyOtp(String email, String otp) {
        return otpStoreService.verifyOtp(email, otp);
    }


}
