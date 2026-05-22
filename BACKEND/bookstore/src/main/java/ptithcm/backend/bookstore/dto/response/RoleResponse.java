package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import ptithcm.backend.bookstore.enums.Permission;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponse {
    Integer roleId;
    String roleName;
    List<String> permissions;
}
