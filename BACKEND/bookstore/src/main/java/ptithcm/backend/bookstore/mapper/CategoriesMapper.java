    package ptithcm.backend.bookstore.mapper;

    import org.mapstruct.Mapper;
    import ptithcm.backend.bookstore.dto.request.CreateCategoriesRequest;
    import ptithcm.backend.bookstore.dto.response.CategoriesResponse;
    import ptithcm.backend.bookstore.entity.Category;

    // componentModel = "spring" giúp @Autowired mapper này ở Service
    @Mapper(componentModel = "spring")
    public interface CategoriesMapper {
        Category toEntity(CreateCategoriesRequest createCategoriesRequest);
        CategoriesResponse toResponse(Category category);
    }
