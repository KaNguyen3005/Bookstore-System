package ptithcm.backend.bookstore.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateRoleRequest {
    @NotBlank(message = "VALIDATION_ERROR")
    @Size(max = 50, message = "VALIDATION_ERROR")
    String roleName;
    List<Integer> permissionIds;
}
