package ptithcm.backend.bookstore.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryResponse {
    Integer categoryId;
    String categoryName;
    String description;
    Integer parentId;
    List<CategoryResponse> children;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    

}
