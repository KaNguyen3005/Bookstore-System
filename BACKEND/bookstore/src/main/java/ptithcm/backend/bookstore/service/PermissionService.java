package ptithcm.backend.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.response.AuthorResponse;
import ptithcm.backend.bookstore.dto.response.PermissionResponse;
import ptithcm.backend.bookstore.entity.Author;
import ptithcm.backend.bookstore.entity.Permission;
import ptithcm.backend.bookstore.mapper.PermissionMapper;
import ptithcm.backend.bookstore.repository.PermissionRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;
    public List<PermissionResponse> getAll(){
        List<PermissionResponse> permissions = new ArrayList<>();
        for(Permission permission : permissionRepository.findAll()){
            permissions.add(permissionMapper.toResponse(permission));
        }
        return permissions;
    }
}
