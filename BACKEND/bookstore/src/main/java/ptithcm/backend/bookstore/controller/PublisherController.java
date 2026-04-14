package ptithcm.backend.bookstore.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.CreatePublisherRequest;
import ptithcm.backend.bookstore.dto.request.UpdatePublisherRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.PublisherResponse;
import ptithcm.backend.bookstore.service.PublisherService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/publishers")
public class PublisherController {

    PublisherService publisherService;

    @PreAuthorize("hasAuthority('CREATE_PUBLISHER')")
    @PostMapping()
    ApiResponse<PublisherResponse> create(@RequestBody @Valid CreatePublisherRequest request){
        ApiResponse<PublisherResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(publisherService.create(request));
        return apiResponse;
    }

    @PreAuthorize("hasAuthority('READ_PUBLISHER')")
    @GetMapping()
    ApiResponse<List<PublisherResponse>> getAll(){
        return ApiResponse.<List<PublisherResponse>>builder().result(publisherService.getAll()).build();
    }

    @PreAuthorize("hasAuthority('UPDATE_PUBLISHER')")
    @PatchMapping("/{id}")
    ApiResponse<PublisherResponse> update(@PathVariable Integer id,@RequestBody @Valid UpdatePublisherRequest request){
        ApiResponse<PublisherResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(publisherService.update(id, request));
        return apiResponse;
    }

    @PreAuthorize("hasAuthority('DELETE_PUBLISHER')")
    @DeleteMapping("/{id}")
    ApiResponse<Void> delete(@PathVariable("id") Integer id){
        publisherService.delete(id);

        return ApiResponse.<Void>builder()
                .message("Delete success")
                .build();
    }
}
