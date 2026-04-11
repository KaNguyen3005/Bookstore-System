package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import ptithcm.backend.bookstore.enums.OrderStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateOrderStatusRequest {
    @NotNull(message = "VALIDATION_ERROR")
    OrderStatus status;
}
