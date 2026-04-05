    package ptithcm.backend.bookstore.mapper;

    import org.mapstruct.Mapper;
    import ptithcm.backend.bookstore.dto.request.CreateAuthorRequest;
    import ptithcm.backend.bookstore.dto.request.CreateRoleRequest;
    import ptithcm.backend.bookstore.dto.response.AuthorResponse;
    import ptithcm.backend.bookstore.dto.response.RoleResponse;
    import ptithcm.backend.bookstore.entity.Author;
    import ptithcm.backend.bookstore.entity.Permission;
    import ptithcm.backend.bookstore.entity.Role;

    // componentModel = "spring" giúp @Autowired mapper này ở Service
    @Mapper(componentModel = "spring")
    public interface RoleMapper {
        Role toEntity(CreateRoleRequest request);

        RoleResponse toResponse(Role role);
        default String map(Permission permission) {
            return permission.getPermissionName();
        }
    }
