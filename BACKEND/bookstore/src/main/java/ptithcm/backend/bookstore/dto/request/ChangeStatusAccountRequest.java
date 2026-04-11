package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;
import ptithcm.backend.bookstore.validator.ValidImageFile;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangeStatusAccountRequest {
    @NotNull(message = "INVALID_ACCOUNT_STATUS")
    Boolean status;
}
