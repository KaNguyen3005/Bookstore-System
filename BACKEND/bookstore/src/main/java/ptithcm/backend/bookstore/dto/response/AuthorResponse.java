package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorResponse {
    Integer authorId;
    String authorName;
    String alias;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
