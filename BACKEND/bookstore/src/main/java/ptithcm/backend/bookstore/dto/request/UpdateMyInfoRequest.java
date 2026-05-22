package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateMyInfoRequest {


    @Size(min = 6, max = 100, message = "INVALID_NAME")
    String name;

    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "INVALID_PHONE")
    String phone;

    Boolean status;

    @Pattern(regexp = "MALE|FEMALE|OTHER", message = "INVALID_GENDER")
    String gender;

    @Pattern(
            regexp = "^\\d{4}-\\d{2}-\\d{2}$",
            message = "INVALID_DOB"
    )
    String dob;

    @NotBlank(message = "INVALID_USERNAME")
    @Size(min = 3, max = 255, message = "INVALID_USERNAME")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "INVALID_USERNAME")
    String username;
}
