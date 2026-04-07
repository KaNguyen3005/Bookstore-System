package ptithcm.backend.bookstore.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateAddressRequest {
    String province;
    String district;
    String ward;
    String detailAddress;
    String customerName;
    String customerPhone;
}
