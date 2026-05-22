package ptithcm.backend.bookstore.dto.request;


import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateAddressRequest {

    @Size(max = 100, message = "INVALID_PROVINCE")
    String province;

    @Size(max = 100, message = "INVALID_DISTRICT")
    String district;

    @Size(max = 100, message = "INVALID_WARD")
    String ward;

    @Size(max = 255, message = "INVALID_DETAIL_ADDRESS")
    String detailAddress;

    @Size(max = 100, message = "INVALID_NAME")
    String customerName;

    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "INVALID_PHONE")
    String customerPhone;
}
