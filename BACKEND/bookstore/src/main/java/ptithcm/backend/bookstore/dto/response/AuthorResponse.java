package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorResponse {
    String authorId;
    String authorName;
    String alias;
}
