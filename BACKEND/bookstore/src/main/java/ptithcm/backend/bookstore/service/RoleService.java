package ptithcm.backend.bookstore.service;


import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreateRoleRequest;
import ptithcm.backend.bookstore.dto.request.UpdateRoleRequest;
import ptithcm.backend.bookstore.dto.response.RoleResponse;
import ptithcm.backend.bookstore.entity.Permission;
import ptithcm.backend.bookstore.entity.Role;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.RoleMapper;
import ptithcm.backend.bookstore.repository.PermissionRepository;
import ptithcm.backend.bookstore.repository.RoleRepository;
import ptithcm.backend.bookstore.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class RoleService {
    private static final Set<String> SYSTEM_ROLE_NAMES = Set.of("ADMIN", "CUSTOMER", "STAFF");
    private static final Set<String> PERMISSION_PROTECTED_ROLE_NAMES = Set.of("ADMIN", "CUSTOMER");

    PermissionRepository permissionRepository;
    RoleRepository roleRepository;
    UserRepository userRepository;

    RoleMapper roleMapper;

    public RoleResponse create(CreateRoleRequest request){
        if (isSystemRole(request.getRoleName())) {
            throw new AppException(ErrorCode.SYSTEM_ROLE_PROTECTED);
        }

        List<Permission> permissions = permissionRepository.findAllById(request.getPermissionIds());

        Role role = Role.builder()
                .roleName(request.getRoleName())
                .permissions(permissions)
                .build();

        return toResponseWithUserCount(roleRepository.save(role));
    }

    private RoleResponse toResponseWithUserCount(Role role) {
        RoleResponse roleResponse = roleMapper.toResponse(role);
        roleResponse.setUserCount(userRepository.countByRole_RoleNameAndDeletedAtIsNull(role.getRoleName()));
        return roleResponse;
    }

    public List<RoleResponse> getAll(){
        List<RoleResponse> roles = new ArrayList<>();
        for(Role role : roleRepository.findAll()){
            roles.add(toResponseWithUserCount(role));
        }
        return roles;
    }

    public boolean delete(Integer id){
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        if (isSystemRole(role.getRoleName())) {
            throw new AppException(ErrorCode.SYSTEM_ROLE_PROTECTED);
        }

        roleRepository.delete(role);
        return true;
    }

    public RoleResponse update(Integer id, UpdateRoleRequest request){
        Role role  = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        if (isPermissionProtectedRole(role.getRoleName())) {
            throw new AppException(ErrorCode.SYSTEM_ROLE_PROTECTED);
        }

        if (request.getRoleName() != null
                && !normalizeRoleName(request.getRoleName()).equals(normalizeRoleName(role.getRoleName()))) {
            if (isSystemRole(request.getRoleName())) {
                throw new AppException(ErrorCode.SYSTEM_ROLE_PROTECTED);
            }
            role.setRoleName(request.getRoleName().trim());
        }

        if (request.getPermissionIds() != null) {
            List<Permission> permissions = request.getPermissionIds().stream()
                            .map(permissionId -> permissionRepository.findById(permissionId)
                                    .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND)))
                    .toList();
            role.setPermissions(permissions);
        }

        return toResponseWithUserCount(roleRepository.save(role));
    }

    private boolean isSystemRole(String roleName) {
        return SYSTEM_ROLE_NAMES.contains(normalizeRoleName(roleName));
    }

    private boolean isPermissionProtectedRole(String roleName) {
        return PERMISSION_PROTECTED_ROLE_NAMES.contains(normalizeRoleName(roleName));
    }

    private String normalizeRoleName(String roleName) {
        return roleName == null ? "" : roleName.trim().toUpperCase();
    }
}
