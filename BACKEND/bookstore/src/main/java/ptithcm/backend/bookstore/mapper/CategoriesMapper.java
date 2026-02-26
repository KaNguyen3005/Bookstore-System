    package ptithcm.backend.bookstore.mapper;

    import org.mapstruct.Mapper;
    import ptithcm.backend.bookstore.dto.request.CreateAuthorRequest;
    import ptithcm.backend.bookstore.dto.request.CreateCategoriesRequest;
    import ptithcm.backend.bookstore.dto.response.AuthorResponse;
    import ptithcm.backend.bookstore.dto.response.CategoriesResponse;
    import ptithcm.backend.bookstore.entity.Author;
    import ptithcm.backend.bookstore.entity.Categories;

    // componentModel = "spring" giúp @Autowired mapper này ở Service
    @Mapper(componentModel = "spring")
    public interface CategoriesMapper {
        Categories toEntity(CreateCategoriesRequest createCategoriesRequest);
        CategoriesResponse toResponse(Categories categories);
    }
