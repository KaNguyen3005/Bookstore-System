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
    
    /**
     * Parent category info (để tránh infinite loop, chỉ lấy id + name)
     */
    ParentCategoryInfo parentCategory;
    
    /**
     * Danh sách category con
     */
    List<ChildCategoryInfo> childCategories;
    
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    
    /**
     * Parent category info (nested)
     */
    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ParentCategoryInfo {
        Integer categoryId;
        String categoryName;
    }
    
    /**
     * Child category info (nested)
     */
    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChildCategoryInfo {
        Integer categoryId;
        String categoryName;
    }
}
