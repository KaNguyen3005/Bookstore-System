package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GHNItemRequest {

    @NotBlank(message = "INVALID_NAME")
    @Size(max = 255, message = "INVALID_NAME")
    String name;

    @NotNull(message = "INVALID_QUANTITY")
    @Min(value = 1, message = "INVALID_QUANTITY")
    @Max(value = 999, message = "INVALID_QUANTITY")
    Integer quantity;

    @NotNull(message = "INVALID_PRICE")
    @Min(value = 1, message = "INVALID_PRICE")
    Integer price;

    @Min(value = 1, message = "VALIDATION_ERROR")
    Integer weight;

    @Size(max = 500, message = "VALIDATION_ERROR")
    String image_url;
}
