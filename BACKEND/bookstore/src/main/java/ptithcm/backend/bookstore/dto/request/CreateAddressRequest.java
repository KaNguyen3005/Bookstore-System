package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAddressRequest {
    @NotBlank(message = "INVALID_PROVINCE")
    @Size(max = 100, message = "INVALID_PROVINCE")
    String province;

    @NotBlank(message = "INVALID_DISTRICT")
    @Size(max = 100, message = "INVALID_DISTRICT")
    String district;

    @NotBlank(message = "INVALID_WARD")
    @Size(max = 100, message = "INVALID_WARD")
    String ward;

    @NotBlank(message = "INVALID_DETAIL_ADDRESS")
    @Size(max = 255, message = "INVALID_DETAIL_ADDRESS")
    String detailAddress;

    @NotBlank(message = "INVALID_NAME")
    @Size(max = 100, message = "INVALID_NAME")
    String customerName;

    @NotBlank(message = "INVALID_PHONE")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "INVALID_PHONE")
    String customerPhone;
}
