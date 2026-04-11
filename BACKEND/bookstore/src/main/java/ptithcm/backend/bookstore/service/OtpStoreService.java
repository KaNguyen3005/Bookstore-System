package ptithcm.backend.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);
        otpStorage.put(email, new OtpData(otp, expiryTime));
        return expiryTime; // Trả về thời gian hết hạn
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData data = otpStorage.get(email);

        if (data == null) return false;
        if (LocalDateTime.now().isAfter(data.expiredAt())) {
            otpStorage.remove(email);
            return false;
        }

        boolean matched = data.otp().equals(otp);
        if (matched) {
            otpStorage.remove(email);
        }

        return matched;
    }

    public record OtpData(String otp, LocalDateTime expiredAt) {}
}
