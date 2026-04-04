    package ptithcm.backend.bookstore.mapper;

    import org.mapstruct.Mapper;
    import ptithcm.backend.bookstore.dto.request.CreateCategoryRequest;
    import ptithcm.backend.bookstore.dto.response.CategoryResponse;
    import ptithcm.backend.bookstore.entity.Category;

    // componentModel = "spring" giúp @Autowired mapper này ở Service
    @Mapper(componentModel = "spring")
    public interface CategoryMapper {
        Category toEntity(CreateCategoryRequest createCategoriesRequest);
        CategoryResponse toResponse(Category category);
    }
