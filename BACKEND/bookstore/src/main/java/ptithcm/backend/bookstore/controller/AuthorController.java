package ptithcm.backend.bookstore.controller;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.CreateAuthorRequest;
import ptithcm.backend.bookstore.dto.request.UpdateAuthorRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.AuthorResponse;
import ptithcm.backend.bookstore.service.AuthorService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/authors")
public class AuthorController {

    AuthorService authorService;

    @PostMapping()
    ApiResponse<AuthorResponse> create(@RequestBody CreateAuthorRequest request){
        ApiResponse<AuthorResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(authorService.create(request));
        return apiResponse;
    }

    @GetMapping()
    ApiResponse<List<AuthorResponse>> getAll(){
        return ApiResponse.<List<AuthorResponse>>builder().result(authorService.getAll()).build();
    }

    @PatchMapping("/{id}")
    ApiResponse<AuthorResponse> update(@PathVariable("id") Integer id,@RequestBody UpdateAuthorRequest request){
        ApiResponse<AuthorResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(authorService.update(id, request));

        return apiResponse;
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> delete(@PathVariable("id") Integer id){
        authorService.delete(id);

        return ApiResponse.<Void>builder()
            .message("Delete success")
            .build();
    }


}
