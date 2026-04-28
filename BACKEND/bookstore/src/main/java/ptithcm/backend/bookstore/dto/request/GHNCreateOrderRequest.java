package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GHNCreateOrderRequest {
    Integer payment_type_id; // bỏ qua validate ID

    @Size(max = 500, message = "INVALID_NOTE")
    String note;

    @NotBlank(message = "VALIDATION_ERROR")
    @Size(max = 100, message = "VALIDATION_ERROR")
    String required_note;

    @NotBlank(message = "INVALID_NAME")
    @Size(min = 1, max = 100, message = "INVALID_NAME")
    String from_name;

    @NotBlank(message = "INVALID_PHONE")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "INVALID_PHONE")
    String from_phone;

    @NotBlank(message = "INVALID_DETAIL_ADDRESS")
    @Size(max = 255, message = "INVALID_DETAIL_ADDRESS")
    String from_address;

    @NotBlank(message = "INVALID_WARD")
    @Size(max = 100, message = "INVALID_WARD")
    String from_ward_name;

    @NotBlank(message = "INVALID_DISTRICT")
    @Size(max = 100, message = "INVALID_DISTRICT")
    String from_district_name;

    @NotBlank(message = "INVALID_PROVINCE")
    @Size(max = 100, message = "INVALID_PROVINCE")
    String from_province_name;

    @NotBlank(message = "INVALID_NAME")
    @Size(min = 1, max = 100, message = "INVALID_NAME")
    String to_name;

    @NotBlank(message = "INVALID_PHONE")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "INVALID_PHONE")
    String to_phone;

    @NotBlank(message = "INVALID_DETAIL_ADDRESS")
    @Size(max = 255, message = "INVALID_DETAIL_ADDRESS")
    String to_address;

    @NotBlank(message = "INVALID_WARD")
    @Size(max = 100, message = "INVALID_WARD")
    String to_ward_name;

    @NotBlank(message = "INVALID_DISTRICT")
    @Size(max = 100, message = "INVALID_DISTRICT")
    String to_district_name;

    @NotBlank(message = "INVALID_PROVINCE")
    @Size(max = 100, message = "INVALID_PROVINCE")
    String to_province_name;

    @NotNull(message = "VALIDATION_ERROR")
    @Min(value = 1, message = "VALIDATION_ERROR")
    Double weight;

    @NotNull(message = "VALIDATION_ERROR")
    @Min(value = 1, message = "VALIDATION_ERROR")
    Integer length;

    @NotNull(message = "VALIDATION_ERROR")
    @Min(value = 1, message = "VALIDATION_ERROR")
    Integer width;

    @NotNull(message = "VALIDATION_ERROR")
    @Min(value = 1, message = "VALIDATION_ERROR")
    Integer height;

    Integer service_type_id; // bỏ qua validate ID

    @NotEmpty(message = "VALIDATION_ERROR")
    @Valid
    List<GHNItemRequest> items;
}