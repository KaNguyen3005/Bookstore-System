package ptithcm.backend.bookstore.controller;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.CreateAuthorRequest;
import ptithcm.backend.bookstore.dto.request.CreatePublisherRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.AuthorResponse;
import ptithcm.backend.bookstore.dto.response.CategoriesResponse;
import ptithcm.backend.bookstore.dto.response.PublisherResponse;
import ptithcm.backend.bookstore.service.AuthorService;
import ptithcm.backend.bookstore.service.PublisherService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/publishers")
public class PublisherController {

    PublisherService publisherService;

    @PostMapping()
    ApiResponse<PublisherResponse> create(@RequestBody CreatePublisherRequest createPublisherRequest){
        ApiResponse<PublisherResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(publisherService.create(createPublisherRequest));
        return apiResponse;
    }

    @GetMapping()
    ApiResponse<List<PublisherResponse>> getAll(){
        return ApiResponse.<List<PublisherResponse>>builder().result(publisherService.getAll()).build();
    }
}
