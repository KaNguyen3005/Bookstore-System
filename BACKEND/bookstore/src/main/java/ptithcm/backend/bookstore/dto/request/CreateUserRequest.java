package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonFormat;
import ptithcm.backend.bookstore.validator.ValidAge;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateUserRequest {

    @NotBlank(message = "INVALID_EMAIL")
    @Email(message = "INVALID_EMAIL")
    String email;

    @NotBlank(message = "INVALID_PASSWORD")
    @Size(min = 6, max = 50, message = "INVALID_PASSWORD")
    String password;

    @NotBlank(message = "INVALID_USERNAME")
    @Size(min = 3, max = 255, message = "INVALID_USERNAME")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "INVALID_USERNAME")
    String username;

    @NotBlank(message = "INVALID_NAME")
    @Size(min = 6, max = 100, message = "INVALID_NAME")
    String name;

    @NotBlank(message = "INVALID_PHONE")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "INVALID_PHONE")
    String phone;

    @NotBlank(message = "INVALID_GENDER")
    @Pattern(regexp = "MALE|FEMALE|OTHER", message = "INVALID_GENDER")
    String gender;

    @NotNull(message = "INVALID_DOB")
    @ValidAge(min = 18, message = "INVALID_AGE")
    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate dob;

    @NotBlank(message = "INVALID_ROLE_ID")
    String roleName;
}
