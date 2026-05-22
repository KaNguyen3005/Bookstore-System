    package ptithcm.backend.bookstore.mapper;

    import org.mapstruct.Mapper;
    import org.mapstruct.Mapping;
    import ptithcm.backend.bookstore.dto.request.CreateAuthorRequest;
    import ptithcm.backend.bookstore.dto.request.CreateUserRequest;
    import ptithcm.backend.bookstore.dto.request.RegisterRequest;
    import ptithcm.backend.bookstore.dto.response.AuthorResponse;
    import ptithcm.backend.bookstore.dto.response.UserResponse;
    import ptithcm.backend.bookstore.entity.Author;
    import ptithcm.backend.bookstore.entity.Permission;
    import ptithcm.backend.bookstore.entity.Role;
    import ptithcm.backend.bookstore.entity.User;

    import java.time.LocalDateTime;

    // componentModel = "spring" giúp @Autowired mapper này ở Service
    @Mapper(componentModel = "spring")
    public interface UserMapper {
        User toEntity(CreateUserRequest request);
        User toEntity(RegisterRequest request);
        @Mapping(source = "userId", target="userId")
        @Mapping(source = "dob", target="dob", qualifiedByName = "localDateTimeToString")
        UserResponse toResponse(User user);
        default String map(Role role) {
            return role.getRoleName();
        }

        @org.mapstruct.Named("localDateTimeToString")
        default String localDateTimeToString(LocalDateTime dob) {
            return dob != null ? dob.toString() : null;
        }
    }
