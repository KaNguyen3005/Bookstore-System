package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateCategoryRequest {
    /**
     * Category name (Optional - nếu không cập nhật thì không cần)
     */
    @Size(min = 2, max = 100, message = "INVALID_CATEGORY_NAME")
    String categoryName;

    /**
     * Parent category ID (Optional)
     * - Nếu = 0 hoặc null → set category này thành root (unset parent)
     * - Nếu > 0 → set category này thành child của parentId
     */
    Integer parentId;
}
