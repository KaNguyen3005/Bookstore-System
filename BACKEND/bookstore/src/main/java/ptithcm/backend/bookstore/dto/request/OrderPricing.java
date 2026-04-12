package ptithcm.backend.bookstore.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderPricing {
    BigDecimal vatRate;
    BigDecimal vatAmount;
    BigDecimal totalAmount;
    BigDecimal fixedDiscountAmount;
    BigDecimal voucherPercentRate;
    BigDecimal tierRate;
    BigDecimal percentDiscountAmount;
}
