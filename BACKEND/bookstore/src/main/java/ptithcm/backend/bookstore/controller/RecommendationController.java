package ptithcm.backend.bookstore.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.BookResponse;
import ptithcm.backend.bookstore.service.RecommendationService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
@Tag(name = "Recommendations", description = "APIs để lấy khuyến nghị sách toàn cầu và cá nhân hóa")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @Operation(
            summary = "Lấy sách phổ biến",
            description = "Trả về danh sách sách phổ biến nhất trong hệ thống."
    )
    @GetMapping("/popular")
    public ApiResponse<List<BookResponse>> getPopularBooks(
            @Parameter(
                    description = "Số lượng sách trả về. Mặc định là 10, tối đa nên giới hạn 100",
                    example = "10"
            )
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<BookResponse>>builder()
                .result(recommendationService.getPopularBooks(limit))
                .build();
    }

    @Operation(
            summary = "Khuyến nghị sách cho user cụ thể",
            description = "Trả về danh sách sách được khuyến nghị cho người dùng theo userId."
    )
    @GetMapping("/users/{userId}")
    public ApiResponse<List<BookResponse>> recommendForUser(
            @Parameter(description = "ID của người dùng", example = "1")
            @PathVariable Long userId,

            @Parameter(description = "Số lượng sách khuyến nghị", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<BookResponse>>builder()
                .result(recommendationService.recommendForUser(userId, limit))
                .build();
    }

    @Operation(
            summary = "Lấy sách tương tự",
            description = "Trả về danh sách sách tương tự với một cuốn sách cụ thể."
    )
    @GetMapping("/books/{bookId}/similar")
    public ApiResponse<List<BookResponse>> getSimilarBooks(
            @Parameter(description = "ID của sách", example = "1")
            @PathVariable Integer bookId,

            @Parameter(description = "Số lượng sách trả về", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<BookResponse>>builder()
                .result(recommendationService.getSimilarBooks(bookId, limit))
                .build();
    }

    @Operation(
            summary = "Lấy sách thường được mua cùng",
            description = "Trả về danh sách sách thường được mua cùng với một cuốn sách cụ thể."
    )
    @GetMapping("/books/{bookId}/frequently-bought-together")
    public ApiResponse<List<BookResponse>> getFrequentlyBoughtTogether(
            @Parameter(description = "ID của sách", example = "1")
            @PathVariable Integer bookId,

            @Parameter(description = "Số lượng sách trả về", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<BookResponse>>builder()
                .result(recommendationService.getFrequentlyBoughtTogether(bookId, limit))
                .build();
    }

    @Operation(
            summary = "Khuyến nghị content-based cho user hiện tại",
            description = "Khuyến nghị sách dựa trên nội dung sách mà người dùng đã tương tác."
    )
    @GetMapping("/me/content-based")
    public ApiResponse<List<BookResponse>> recommendContentBased(
            @Parameter(description = "Số lượng sách khuyến nghị", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<BookResponse>>builder()
                .result(recommendationService.recommendContentBased(limit))
                .build();
    }

    @Operation(
            summary = "Khuyến nghị collaborative filtering cho user hiện tại",
            description = "Khuyến nghị sách dựa trên hành vi của những người dùng có sở thích tương tự."
    )
    @GetMapping("/me/collaborative")
    public ApiResponse<List<BookResponse>> recommendCollaborative(
            @Parameter(description = "Số lượng sách khuyến nghị", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<BookResponse>>builder()
                .result(recommendationService.recommendCollaborative(limit))
                .build();
    }

    @Operation(
            summary = "Khuyến nghị hybrid cho user hiện tại",
            description = "Khuyến nghị sách bằng cách kết hợp nhiều thuật toán khuyến nghị."
    )
    @GetMapping("/me/hybrid")
    public ApiResponse<List<BookResponse>> recommendHybrid(
            @Parameter(description = "Số lượng sách khuyến nghị", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<BookResponse>>builder()
                .result(recommendationService.recommendHybrid(limit))
                .build();
    }
}

