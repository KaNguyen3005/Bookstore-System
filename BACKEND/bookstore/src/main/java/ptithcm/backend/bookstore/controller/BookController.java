package ptithcm.backend.bookstore.controller;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.CreateBookRequest;
import ptithcm.backend.bookstore.dto.request.UpdateBookRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.BookResponse;
import ptithcm.backend.bookstore.dto.response.ReviewResponse;
import ptithcm.backend.bookstore.entity.Review;
import ptithcm.backend.bookstore.service.BookService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/books")
public class BookController {
    BookService bookService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<BookResponse> create(@ModelAttribute CreateBookRequest createBookRequest){
        log.error("Đã chạy xuống controller");
        ApiResponse<BookResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookService.create(createBookRequest));
        return apiResponse;
    }

    @GetMapping()
    public ApiResponse<List<BookResponse>> getAll(){
        ApiResponse<List<BookResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookService.getAll());
        return apiResponse;
    }

    @GetMapping("/search")
    public ApiResponse<List<BookResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer category,
            @RequestParam(required = false) BigDecimal min_price,
            @RequestParam(required = false) BigDecimal max_price,
            @RequestParam(required = false) String sort) {
        ApiResponse<List<BookResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookService.searchBooks(keyword, category, min_price, max_price, sort));
        return apiResponse;
    }

    @GetMapping("/{id}")
    public ApiResponse<BookResponse> get(@PathVariable("id") Integer id){
        ApiResponse<BookResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookService.get(id));
        return apiResponse;
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> delete(@PathVariable("id") Integer id){

        bookService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Delete success")
                .build();
    }

    @PatchMapping(path="/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<BookResponse> update(@PathVariable("id") Integer id, @ModelAttribute UpdateBookRequest request){
        ApiResponse<BookResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(bookService.update(id, request));

        return apiResponse;
    }

    @GetMapping("{id}/reviews")
    ApiResponse<List<ReviewResponse>> getAllReview(@PathVariable("id") Integer id) {
        ApiResponse<List<ReviewResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookService.getAllReview(id));
        return apiResponse;
    }
}
