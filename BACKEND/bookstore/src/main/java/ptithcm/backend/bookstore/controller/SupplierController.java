//package ptithcm.backend.bookstore.controller;
//
//import lombok.AccessLevel;
//import lombok.Data;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import ptithcm.backend.bookstore.dto.request.CreateAuthorRequest;
//import ptithcm.backend.bookstore.dto.response.ApiResponse;
//import ptithcm.backend.bookstore.dto.response.AuthorResponse;
//import ptithcm.backend.bookstore.service.AuthorService;
//
//@RestController
//@RequiredArgsConstructor
//@Slf4j
//@Data
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//@RequestMapping("api/authors")
//public class SupplierController {
//
//    AuthorService authorService;
//
//    @PostMapping()
//    ApiResponse<AuthorResponse> createAuthor(@RequestBody CreateAuthorRequest createAuthorRequest){
//        ApiResponse<AuthorResponse> apiResponse = new ApiResponse<>();
//        apiResponse.setResult(authorService.createAuthor(createAuthorRequest));
//        return apiResponse;
//    }
//}
