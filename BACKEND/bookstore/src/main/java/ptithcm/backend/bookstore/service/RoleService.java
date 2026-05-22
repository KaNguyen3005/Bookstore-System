package ptithcm.backend.bookstore.service;


import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreateCategoryRequest;
import ptithcm.backend.bookstore.dto.request.CreateRoleRequest;
import ptithcm.backend.bookstore.dto.request.UpdateCategoryRequest;
import ptithcm.backend.bookstore.dto.request.UpdateRoleRequest;
import ptithcm.backend.bookstore.dto.response.RoleResponse;
import ptithcm.backend.bookstore.entity.Category;
import ptithcm.backend.bookstore.entity.Permission;
import ptithcm.backend.bookstore.entity.Role;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.CategoryMapper;
import ptithcm.backend.bookstore.mapper.RoleMapper;
import ptithcm.backend.bookstore.repository.CategoryRepository;
import ptithcm.backend.bookstore.repository.PermissionRepository;
import ptithcm.backend.bookstore.repository.RoleRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class RoleService {
    PermissionRepository permissionRepository;
    RoleRepository roleRepository;

    RoleMapper roleMapper;

    public RoleResponse create(CreateRoleRequest request){
        List<Permission> permissions = permissionRepository.findAllById(request.getPermissionIds());

        Role role = Role.builder()
                .roleName(request.getRoleName())
                .permissions(permissions)
                .build();

        return roleMapper.toResponse(roleRepository.save(role));
    }

    public List<RoleResponse> getAll(){
        List<RoleResponse> roles = new ArrayList<>();
        for(Role role : roleRepository.findAll()){
            roles.add(roleMapper.toResponse(role));
        }
        return roles;
    }

    public boolean delete(Integer id){
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        roleRepository.delete(role);
        return true;
    }

    public RoleResponse update(Integer id, UpdateRoleRequest request){
        Role role  = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        if (request.getRoleName() != null) {
            role.setRoleName(request.getRoleName());
        }

        if (request.getPermissionIds() != null) {
            List<Permission> permissions = request.getPermissionIds().stream()
                            .map(permissionId -> permissionRepository.findById(permissionId)
                                    .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND)))
                    .toList();
            role.setPermissions(permissions);
        }

        return roleMapper.toResponse(roleRepository.save(role));
    }
}
