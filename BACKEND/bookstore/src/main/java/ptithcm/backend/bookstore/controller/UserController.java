package ptithcm.backend.bookstore.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.*;
import ptithcm.backend.bookstore.dto.response.*;
import ptithcm.backend.bookstore.service.CloudinaryService;
import ptithcm.backend.bookstore.service.UserService;

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
    ApiResponse<Page<UserResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return ApiResponse.<Page<UserResponse>>builder().result(userService.getAll(page, size)).build();
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
    ApiResponse<UserResponse> changeStatusAccount(@PathVariable("id") Long id, @RequestBody @Valid ChangeStatusAccountRequest request){
        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(userService.changeStatusAccount(id, request));
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

        apiResponse.setResult(userService.updateMyInfo(request));

        return apiResponse;
    }

    @PatchMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<UserResponse> uploadAvatar(@ModelAttribute @Valid UploadAvatarRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.uploadAvatar(request))
                .message("Upload avatar success")
                .build();
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
