package ptithcm.backend.bookstore.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.CreateCategoryRequest;
import ptithcm.backend.bookstore.dto.request.CreateRoleRequest;
import ptithcm.backend.bookstore.dto.request.UpdateCategoryRequest;
import ptithcm.backend.bookstore.dto.request.UpdateRoleRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.CategoryResponse;
import ptithcm.backend.bookstore.dto.response.RoleResponse;
import ptithcm.backend.bookstore.service.CategoryService;
import ptithcm.backend.bookstore.service.RoleService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/roles")
public class RoleController {

    RoleService roleService;

    @PostMapping()
    ApiResponse<RoleResponse> create(@RequestBody @Valid CreateRoleRequest request){
        ApiResponse<RoleResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(roleService.create(request));
        return apiResponse;
    }

    @GetMapping()
    ApiResponse<List<RoleResponse>> getAll(){
        return ApiResponse.<List<RoleResponse>>builder().result(roleService.getAll()).build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> delete(@PathVariable("id") Integer id){

        roleService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Delete success")
                .build();
    }
    
    @PatchMapping("/{id}")
    ApiResponse<RoleResponse> update(@PathVariable("id") Integer id, @RequestBody UpdateRoleRequest request){
        ApiResponse<RoleResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(roleService.update(id, request));

        return apiResponse;
    }

}
