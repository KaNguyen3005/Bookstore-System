package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAuthorRequest {

    @NotBlank(message = "INVALID_NAME")
    @Size(max = 100, message = "INVALID_NAME")
    String authorName;

    @NotBlank(message = "INVALID_NAME")
    @Size(min = 6, max = 100, message = "INVALID_NAME")
    String alias;
}
