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

    @Mapping(target = "children", ignore = true)
    CategoryResponse toResponse(Category category);

}
