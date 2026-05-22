package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateAuthorRequest {
    @Size(min = 6, max = 100, message = "INVALID_NAME")
    String authorName;

    @Size(min = 6, max = 100, message = "VALIDATION_ERROR")
    String alias;
}
