package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCartItemRequest {
    @Min(value = 1, message = "INVALID_QUANTITY")
    @Max(value = 999, message = "INVALID_QUANTITY")
    Integer quantity;
}
