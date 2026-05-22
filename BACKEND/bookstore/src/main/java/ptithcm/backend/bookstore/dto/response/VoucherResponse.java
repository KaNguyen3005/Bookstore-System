package ptithcm.backend.bookstore.dto.response;

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
public class VoucherResponse {
    Long voucherId;
    String voucherCode;
    String title;
    String description;
    VoucherType type;
    BigDecimal discountValue;
    BigDecimal maxDiscountAmount;
    BigDecimal minOrderValue;
    Integer totalLimit;
    Integer usedCount;
    Integer limitPerUser;
    Long minPoint;
    LocalDateTime startDate;
    LocalDateTime endDate;
    Boolean isActive;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    LocalDateTime deletedAt;
}

