package ptithcm.backend.bookstore.controller;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ptithcm.backend.bookstore.dto.request.CreateAuthorRequest;
import ptithcm.backend.bookstore.dto.request.CreatePublisherRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.AuthorResponse;
import ptithcm.backend.bookstore.dto.response.PublisherResponse;
import ptithcm.backend.bookstore.service.AuthorService;
import ptithcm.backend.bookstore.service.PublisherService;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/publishers")
public class PublisherController {

    PublisherService publisherService;

    @PostMapping()
    ApiResponse<PublisherResponse> createAuthor(@RequestBody CreatePublisherRequest createPublisherRequest){
        ApiResponse<PublisherResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(publisherService.createPublisher(createPublisherRequest));
        return apiResponse;
    }
}
