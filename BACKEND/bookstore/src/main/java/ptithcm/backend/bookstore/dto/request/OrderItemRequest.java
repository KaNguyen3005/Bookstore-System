package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemRequest {
    Integer bookId;

    @Min(value = 1, message = "INVALID_QUANTITY")
    @Max(value = 999, message = "INVALID_QUANTITY")
    Integer quantity;

    @Size(max = 255, message = "INVALID_NOTE")
    String note; // ghi chú
}
