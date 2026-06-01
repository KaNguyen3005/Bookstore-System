package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
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
public class UpdateVoucherRequest {

    @Size(max = 255, message = "VALIDATION_ERROR")
    String title;

    @Size(max = 1000, message = "INVALID_NOTE")
    String description;

    VoucherType type;

    @DecimalMin(value = "0.0", inclusive = false, message = "VALIDATION_ERROR")
    @Digits(integer = 10, fraction = 2, message = "VALIDATION_ERROR")
    BigDecimal discountValue;

    @DecimalMin(value = "0.0", inclusive = false, message = "VALIDATION_ERROR")
    @Digits(integer = 10, fraction = 2, message = "VALIDATION_ERROR")
    BigDecimal maxDiscountAmount;

    @DecimalMin(value = "0.0", inclusive = true, message = "VALIDATION_ERROR")
    @Digits(integer = 10, fraction = 2, message = "VALIDATION_ERROR")
    BigDecimal minOrderValue;

    @Min(value = 1, message = "VALIDATION_ERROR")
    Integer totalLimit;

    @Min(value = 1, message = "VALIDATION_ERROR")
    Integer limitPerUser;

    @Min(value = 0, message = "VALIDATION_ERROR")
    Long minPoint;

    LocalDateTime startDate;

    LocalDateTime endDate;

    Boolean isActive;
}

