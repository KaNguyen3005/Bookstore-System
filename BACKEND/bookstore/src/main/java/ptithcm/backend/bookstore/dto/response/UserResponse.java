package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.mapping.Set;
import ptithcm.backend.bookstore.enums.Tier;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long userId;
    String username;
    String name;
    String gender;
    String phone;
    String dob;
    String role;
    Integer roleId;
    String avatarUrl;
    String tier;
    Long point;
    String email;
    Boolean status;
}
