package ptithcm.backend.bookstore.mapper;

import jdk.jfr.Name;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import ptithcm.backend.bookstore.dto.request.CreateCategoryRequest;
import ptithcm.backend.bookstore.dto.response.CategoryResponse;
import ptithcm.backend.bookstore.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    
    Category toEntity(CreateCategoryRequest createCategoriesRequest);
    
    /**
     * Map Category entity to response
     * Tránh infinite loop bằng cách:
     * - Chỉ map parent info (id + name), không map full parent
     * - Chỉ map child info (id + name), không map full children
     */
    @Mapping(target = "parentCategory", source = "parentCategory", qualifiedByName = "mapParentCategory")
    @Mapping(target = "childCategories", source = "childCategories", qualifiedByName = "mapChildCategories")
    CategoryResponse toResponse(Category category);
    
    /**
     * Helper: Map parent category thành ParentCategoryInfo
     */
    @Named("mapParentCategory")
    default CategoryResponse.ParentCategoryInfo mapParentCategory(Category parent) {
        if (parent == null) {
            return null;
        }
        return CategoryResponse.ParentCategoryInfo.builder()
                .categoryId(parent.getCategoryId().intValue())
                .categoryName(parent.getCategoryName())
                .build();
    }
    
    /**
     * Helper: Map child categories thành List<ChildCategoryInfo>
     */
    @Named("mapChildCategories")
    default java.util.List<CategoryResponse.ChildCategoryInfo> mapChildCategories(java.util.List<Category> children) {
        if (children == null) {
            return null;
        }
        return children.stream()
                .map(child -> CategoryResponse.ChildCategoryInfo.builder()
                        .categoryId(child.getCategoryId().intValue())
                        .categoryName(child.getCategoryName())
                        .build())
                .toList();
    }
}
