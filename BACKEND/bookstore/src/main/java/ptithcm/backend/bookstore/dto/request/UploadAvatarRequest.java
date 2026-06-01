package ptithcm.backend.bookstore.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;
import ptithcm.backend.bookstore.validator.ValidImageFile;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadAvatarRequest {
    @ValidImageFile(required = true)
    MultipartFile avatar;
}
