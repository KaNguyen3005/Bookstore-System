package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import ptithcm.backend.bookstore.enums.VoucherType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateVoucherRequest {

    @NotBlank(message = "INVALID_VOUCHER_CODE")
    @Size(min = 3, max = 50, message = "INVALID_VOUCHER_CODE")
    String voucherCode;

    @NotBlank(message = "VALIDATION_ERROR")
    @Size(max = 255, message = "VALIDATION_ERROR")
    String title;

    @Size(max = 1000, message = "INVALID_NOTE")
    String description;

    @NotNull(message = "VALIDATION_ERROR")
    VoucherType type;

    @NotNull(message = "VALIDATION_ERROR")
    @DecimalMin(value = "0.0", inclusive = false, message = "VALIDATION_ERROR")
    @Digits(integer = 10, fraction = 2, message = "VALIDATION_ERROR")
    BigDecimal discountValue;

    @DecimalMin(value = "0.0", inclusive = false, message = "VALIDATION_ERROR")
    @Digits(integer = 10, fraction = 2, message = "VALIDATION_ERROR")
    BigDecimal maxDiscountAmount;

    @DecimalMin(value = "0.0", inclusive = true, message = "VALIDATION_ERROR")
    @Digits(integer = 10, fraction = 2, message = "VALIDATION_ERROR")
    BigDecimal minOrderValue;

    @NotNull(message = "VALIDATION_ERROR")
    @Min(value = 1, message = "VALIDATION_ERROR")
    Integer totalLimit;

    @NotNull(message = "VALIDATION_ERROR")
    @Min(value = 1, message = "VALIDATION_ERROR")
    Integer limitPerUser;

    @Min(value = 0, message = "VALIDATION_ERROR")
    Long minPoint;

    @NotNull(message = "VALIDATION_ERROR")
    LocalDateTime startDate;

    @NotNull(message = "VALIDATION_ERROR")
    LocalDateTime endDate;
}

