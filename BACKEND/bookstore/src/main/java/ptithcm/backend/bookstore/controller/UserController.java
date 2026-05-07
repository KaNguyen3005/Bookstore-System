package ptithcm.backend.bookstore.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.*;
import ptithcm.backend.bookstore.dto.response.*;
import ptithcm.backend.bookstore.service.CloudinaryService;
import ptithcm.backend.bookstore.service.UserService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/users")
public class UserController {

    UserService userService;
    CloudinaryService cloudinaryService;


    @PreAuthorize("hasAuthority('CREATE_USER')")
    @PostMapping()
    ApiResponse<UserResponse> create(@RequestBody @Valid CreateUserRequest request){
        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(userService.create(request));
        return apiResponse;
    }

    @PreAuthorize("hasAuthority('READ_USER')")
    @GetMapping()
    ApiResponse<List<UserResponse>> getAll(){
        return ApiResponse.<List<UserResponse>>builder().result(userService.getAll()).build();
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PatchMapping("/{id}")
    ApiResponse<UserResponse> update(@PathVariable("id") Long id, @RequestBody @Valid UpdateUserRequest request){
        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(userService.update(id, request));

        return apiResponse;
    }

    @PreAuthorize("hasAuthority('DELETE_USER')")
    @DeleteMapping("/{id}")
    ApiResponse<Void> delete(@PathVariable("id") Long id){

        userService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Delete success")
                .build();
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PutMapping("/{id}/status")
    ApiResponse<Void> changeStatusAccount(@PathVariable("id") Long id, @RequestBody @Valid ChangeStatusAccountRequest request){
        ApiResponse<Void> apiResponse = new ApiResponse<>();
        userService.changeStatusAccount(id, request);
        return apiResponse;
    }

    @GetMapping("/me")
    ApiResponse<UserResponse> getMyInfo(){
        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(userService.getMyInfo());
        return apiResponse;
    }

    @PatchMapping("/me")
    ApiResponse<UserResponse> updateMyInfo(@RequestBody @Valid UpdateMyInfoRequest request){
        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();

        userService.updateMyInfo(request);
        apiResponse.setResult(userService.updateMyInfo(request));

        return apiResponse;
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PostMapping("/{id}/disable")
    ApiResponse<Void> disableAccount(@PathVariable("id") Long id){
        userService.disableUser(id);
        return ApiResponse.<Void>builder()
                .message("User disabled successfully")
                .build();
    }
}
