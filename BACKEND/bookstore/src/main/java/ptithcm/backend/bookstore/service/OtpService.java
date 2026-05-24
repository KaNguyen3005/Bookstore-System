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
        return sendOtp(email, "Ma OTP xac thuc", "Xac thuc tai khoan");
    }

    public LocalDateTime sendPasswordResetOtp(String email) {
        return sendOtp(email, "Ma xac thuc doi mat khau", "Doi mat khau");
    }

    private LocalDateTime sendOtp(String email, String subject, String title) {
        String otp = OtpUtil.generateOtp();
        LocalDateTime expiryTime = otpStoreService.saveOtp(email, otp);

        emailService.sendOtpEmail(email, otp, subject, title);
        log.info("OTP sent to {} (expires at {})", email, expiryTime);

        return expiryTime;
    }

    public boolean verifyOtp(String email, String otp) {
        return otpStoreService.verifyOtp(email, otp);
    }
}
