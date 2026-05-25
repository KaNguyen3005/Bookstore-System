package ptithcm.backend.bookstore.service;


import ptithcm.backend.bookstore.utils.AppTime;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class OtpStoreService {

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    public LocalDateTime saveOtp(String email, String otp) {
        LocalDateTime expiryTime = AppTime.now().plusMinutes(5);
        otpStorage.put(email, new OtpData(otp, expiryTime));
        return expiryTime; // Trả về thời gian hết hạn
    }

    public Boolean verifyOtp(String email, String otp) {
        OtpData data = otpStorage.get(email);

        if (data == null) {
            throw new AppException(ErrorCode.OTP_INVALID);
        }

        if (AppTime.now().isAfter(data.expiredAt())) {
            otpStorage.remove(email);
            throw new AppException(ErrorCode.OTP_EXPIRED);
        }

        if (!data.otp().equals(otp)) {
            throw new AppException(ErrorCode.OTP_INVALID);
        }

        // đúng OTP → xóa
        otpStorage.remove(email);
        return true;
    }

    public record OtpData(String otp, LocalDateTime expiredAt) {}
}
