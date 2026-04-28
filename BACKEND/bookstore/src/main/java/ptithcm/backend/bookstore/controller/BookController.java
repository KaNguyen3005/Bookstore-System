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
import org.springframework.web.multipart.MultipartFile;
import ptithcm.backend.bookstore.dto.request.CreateBookRequest;
import ptithcm.backend.bookstore.dto.request.UpdateBookRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.BookResponse;
import ptithcm.backend.bookstore.dto.response.OrderItemResponse;
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

    @PreAuthorize("hasAuthority('CREATE_BOOK')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<BookResponse> create(@ModelAttribute CreateBookRequest createBookRequest){
        log.error("Đã chạy xuống controller");
        ApiResponse<BookResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookService.create(createBookRequest));
        return apiResponse;
    }

    @PreAuthorize("hasAuthority('UPDATE_BOOK')")
    @PostMapping("{id}/book-images")
    public void uploadImages(
            @PathVariable Integer id,
            @RequestParam("files") List<MultipartFile> files
    ) {
        bookService.uploadImages(id, files);
    }

    @GetMapping()
    public ApiResponse<Page<BookResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        ApiResponse<Page<BookResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookService.getAll(page, size));
        return apiResponse;
    }

    @GetMapping("/search")
    public ApiResponse<Page<BookResponse>> searchBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<BookResponse>>builder()
                .result(bookService.searchBooks(keyword, categoryId, minPrice, maxPrice, sort, page, size))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<BookResponse> get(@PathVariable("id") Integer id){
        ApiResponse<BookResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookService.get(id));
        return apiResponse;
    }

    @PreAuthorize("hasAuthority('DELETE_BOOK')")
    @DeleteMapping("/{id}")
    ApiResponse<Void> delete(@PathVariable("id") Integer id){

        bookService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Delete success")
                .build();
    }

    @PreAuthorize("hasAuthority('UPDATE_BOOK')")
    @PatchMapping(path="/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<BookResponse> update(@PathVariable("id") Integer id, @ModelAttribute @Valid UpdateBookRequest request){
        ApiResponse<BookResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(bookService.update(id, request));

        return apiResponse;
    }

    @GetMapping("{id}/reviews")
    ApiResponse<Page<OrderItemResponse>> getBookReviews(
            @PathVariable("id") Integer id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        ApiResponse<Page<OrderItemResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookService.getBookReviews(id, page, size));
        return apiResponse;
    }
}
