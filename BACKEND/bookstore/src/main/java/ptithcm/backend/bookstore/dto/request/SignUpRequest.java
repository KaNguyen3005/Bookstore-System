package ptithcm.backend.bookstore.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SignUpRequest {
    String email;
    String username;
    String password;
    String firstName;
    String lastName;
    LocalDateTime dob;
}
