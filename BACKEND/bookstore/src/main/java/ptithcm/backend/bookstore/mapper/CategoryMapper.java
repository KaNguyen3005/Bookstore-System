package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ptithcm.backend.bookstore.dto.request.CreateCategoryRequest;
import ptithcm.backend.bookstore.dto.response.CategoryResponse;
import ptithcm.backend.bookstore.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    
    Category toEntity(CreateCategoryRequest createCategoriesRequest);

    @Mapping(target = "children", ignore = true)
    @Mapping(source = "parentCategory.categoryId", target = "parentId")
    CategoryResponse toResponse(Category category);

}
