package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerifyOtpRequest {
    @Email(message = "INVALID_EMAIL")
    String email;
    @Size(min = 6, max = 6, message = "INVALID_OTP")
    String otp;
}
