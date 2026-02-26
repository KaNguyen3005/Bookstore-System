package ptithcm.backend.bookstore.controller;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.CreateBookRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.BookResponse;
import ptithcm.backend.bookstore.service.BookService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/books")
public class BookController {
    BookService bookService;

    @PostMapping()
    public ApiResponse<BookResponse> create(@RequestBody CreateBookRequest createBookRequest){
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
}
