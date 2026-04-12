package ptithcm.backend.bookstore.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCategoryRequest {
    @NotBlank(message = "INVALID_CATEGORY_NAME")
    @Size(min = 2, max = 100, message = "INVALID_CATEGORY_NAME")
    String categoryName;

    /**
     * Parent category ID (Optional)
     * Nếu không có hoặc null → tạo category cha
     * Nếu có → tạo category con
     */
    Integer parentId;
}
