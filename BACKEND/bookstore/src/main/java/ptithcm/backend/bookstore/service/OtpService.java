package ptithcm.backend.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.utils.OtpUtil;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    EmailService emailService;
    OtpStoreService otpStoreService;

    public void sendOtp(String email) {
        String otp = OtpUtil.generateOtp();
        otpStoreService.saveOtp(email, otp);
        emailService.sendOtpEmail(email, otp);
    }

    public boolean verifyOtp(String email, String otp) {
        return otpStoreService.verifyOtp(email, otp);
    }
}
