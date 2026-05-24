package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerifyCurrentUserOtpRequest {
    @Size(min = 6, max = 6, message = "INVALID_OTP")
    String otp;
}
