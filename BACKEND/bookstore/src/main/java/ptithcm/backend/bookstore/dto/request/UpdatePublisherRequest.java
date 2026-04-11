package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdatePublisherRequest {
    @NotBlank(message = "INVALID_NAME")
    @Size(min = 6, max = 100, message = "INVALID_NAME")
    String publisherName;
}
