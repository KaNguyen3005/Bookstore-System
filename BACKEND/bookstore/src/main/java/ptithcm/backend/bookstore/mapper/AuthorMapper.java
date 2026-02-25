    package ptithcm.backend.bookstore.mapper;

    import org.mapstruct.Mapper;
    import ptithcm.backend.bookstore.dto.request.CreateAuthorRequest;
    import ptithcm.backend.bookstore.dto.response.AuthorResponse;
    import ptithcm.backend.bookstore.entity.Author;

    // componentModel = "spring" giúp @Autowired mapper này ở Service
    @Mapper(componentModel = "spring")
    public interface AuthorMapper {
        Author toEntity(CreateAuthorRequest createAuthorRequest);
        AuthorResponse toResponse(Author author);
    }
