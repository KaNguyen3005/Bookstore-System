//package ptithcm.backend.bookstore.controller;
//
//import lombok.AccessLevel;
//import lombok.Data;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.web.bind.annotation.*;
//import ptithcm.backend.bookstore.dto.request.CreateCategoriesRequest;
//import ptithcm.backend.bookstore.dto.response.ApiResponse;
//import ptithcm.backend.bookstore.dto.response.CategoriesResponse;
//import ptithcm.backend.bookstore.service.CategoryService;
//
//import java.util.List;
//
//@RestController
//@RequiredArgsConstructor
//@Slf4j
//@Data
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//@RequestMapping("api/categories")
//public class CategoriesController {
//
//    CategoryService categoriesService;
//
//    @PostMapping()
//    ApiResponse<CategoriesResponse> create(@RequestBody CreateCategoriesRequest createCategoriesRequest){
//        ApiResponse<CategoriesResponse> apiResponse = new ApiResponse<>();
//        apiResponse.setResult(categoriesService.create(createCategoriesRequest));
//        return apiResponse;
//    }
//
//    @GetMapping()
//    ApiResponse<List<CategoriesResponse>> getAll(){
//        return ApiResponse.<List<CategoriesResponse>>builder().result(categoriesService.getAll()).build();
//    }
//
//}
