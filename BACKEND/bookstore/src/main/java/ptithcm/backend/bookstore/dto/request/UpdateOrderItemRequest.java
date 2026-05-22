package ptithcm.backend.bookstore.dto.request;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateOrderItemRequest {
    @Min(value = 1, message = "INVALID_RATING")
    @Max(value = 5, message = "INVALID_RATING")
    Integer rating;

    @Size(max = 1000, message = "INVALID_COMMENT")
    String content;
}
