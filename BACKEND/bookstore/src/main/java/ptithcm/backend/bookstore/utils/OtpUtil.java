package ptithcm.backend.bookstore.utils;

import java.security.SecureRandom;

public class OtpUtil {
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateOtp() {
        int number = 100000 + RANDOM.nextInt(900000);
        return String.valueOf(number);
    }
}