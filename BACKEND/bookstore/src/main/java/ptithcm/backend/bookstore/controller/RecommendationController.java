package ptithcm.backend.bookstore.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.RecommendedBookResponse;
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
    public ApiResponse<List<RecommendedBookResponse>> getPopularBooks(
            @Parameter(
                    description = "Số lượng sách trả về. Mặc định là 10, tối đa nên giới hạn 100",
                    example = "10"
            )
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<RecommendedBookResponse>>builder()
                .result(recommendationService.getPopularBooks(limit))
                .build();
    }

    @Operation(
            summary = "Khuyến nghị sách cho user cụ thể",
            description = "Trả về danh sách sách được khuyến nghị cho người dùng theo userId."
    )
    @GetMapping("/users/{userId}")
    public ApiResponse<List<RecommendedBookResponse>> recommendForUser(
            @Parameter(description = "ID của người dùng", example = "1")
            @PathVariable Long userId,

            @Parameter(description = "Số lượng sách khuyến nghị", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<RecommendedBookResponse>>builder()
                .result(recommendationService.recommendForUser(userId, limit))
                .build();
    }

    @Operation(
            summary = "Lấy sách tương tự",
            description = "Trả về danh sách sách tương tự với một cuốn sách cụ thể."
    )
    @GetMapping("/books/{bookId}/similar")
    public ApiResponse<List<RecommendedBookResponse>> getSimilarBooks(
            @Parameter(description = "ID của sách", example = "1")
            @PathVariable Integer bookId,

            @Parameter(description = "Số lượng sách trả về", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<RecommendedBookResponse>>builder()
                .result(recommendationService.getSimilarBooks(bookId, limit))
                .build();
    }

    @Operation(
            summary = "Lấy sách thường được mua cùng",
            description = "Trả về danh sách sách thường được mua cùng với một cuốn sách cụ thể."
    )
    @GetMapping("/books/{bookId}/frequently-bought-together")
    public ApiResponse<List<RecommendedBookResponse>> getFrequentlyBoughtTogether(
            @Parameter(description = "ID của sách", example = "1")
            @PathVariable Integer bookId,

            @Parameter(description = "Số lượng sách trả về", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<RecommendedBookResponse>>builder()
                .result(recommendationService.getFrequentlyBoughtTogether(bookId, limit))
                .build();
    }

    @Operation(
            summary = "Khuyến nghị content-based cho user hiện tại",
            description = "Khuyến nghị sách dựa trên nội dung sách mà người dùng đã tương tác."
    )
    @GetMapping("/me/content-based")
    public ApiResponse<List<RecommendedBookResponse>> recommendContentBased(
            @Parameter(description = "Số lượng sách khuyến nghị", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<RecommendedBookResponse>>builder()
                .result(recommendationService.recommendContentBased(limit))
                .build();
    }

    @Operation(
            summary = "Khuyến nghị collaborative filtering cho user hiện tại",
            description = "Khuyến nghị sách dựa trên hành vi của những người dùng có sở thích tương tự."
    )
    @GetMapping("/me/collaborative")
    public ApiResponse<List<RecommendedBookResponse>> recommendCollaborative(
            @Parameter(description = "Số lượng sách khuyến nghị", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<RecommendedBookResponse>>builder()
                .result(recommendationService.recommendCollaborative(limit))
                .build();
    }

    @Operation(
            summary = "Khuyến nghị hybrid cho user hiện tại",
            description = "Khuyến nghị sách bằng cách kết hợp nhiều thuật toán khuyến nghị."
    )
    @GetMapping("/me/hybrid")
    public ApiResponse<List<RecommendedBookResponse>> recommendHybrid(
            @Parameter(description = "Số lượng sách khuyến nghị", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<RecommendedBookResponse>>builder()
                .result(recommendationService.recommendHybrid(limit))
                .build();
    }

    @Operation(
            summary = "Lấy sách liên quan",
            description = "Trả về danh sách sách liên quan với một cuốn sách cụ thể (khác với similar books)."
    )
    @GetMapping("/books/{bookId}/related")
    public ApiResponse<List<RecommendedBookResponse>> getRelatedBooks(
            @Parameter(description = "ID của sách", example = "1")
            @PathVariable Integer bookId,

            @Parameter(description = "Số lượng sách trả về", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<RecommendedBookResponse>>builder()
                .result(recommendationService.getRelatedBooks(bookId, limit))
                .build();
    }

    @Operation(
            summary = "Lấy thông tin chi tiết sách từ AI Service",
            description = "Trả về thông tin chi tiết của một cuốn sách từ recommendation service."
    )
    @GetMapping("/books/{bookId}/info")
    public ApiResponse<Object> getBookInfo(
            @Parameter(description = "ID của sách", example = "1")
            @PathVariable Integer bookId
    ) {
        return ApiResponse.builder()
                .result(recommendationService.getBookInfo(bookId))
                .build();
    }

    @Operation(
            summary = "Tìm kiếm sách theo tiêu đề",
            description = "Tìm kiếm sách trong recommendation service theo tiêu đề."
    )
    @GetMapping("/books/search")
    public ApiResponse<Object> searchBooks(
            @Parameter(description = "Tiêu đề sách cần tìm", example = "Python")
            @RequestParam String title,

            @Parameter(description = "Số lượng kết quả tối đa", example = "10")
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.builder()
                .result(recommendationService.searchBooks(title, limit))
                .build();
    }

    @Operation(
            summary = "Huấn luyện recommendation models",
            description = "Huấn luyện lại các collaborative filtering và content-based models. Thao tác này có thể mất vài phút."
    )
    @PostMapping("/train")
    public ApiResponse<Object> trainModels(
            @Parameter(description = "Có huấn luyện lại collaborative engine không?", example = "true")
            @RequestParam(defaultValue = "true") boolean retrainCollaborative,

            @Parameter(description = "Có huấn luyện lại content-based engine không?", example = "true")
            @RequestParam(defaultValue = "true") boolean retrainContent
    ) {
        return ApiResponse.builder()
                .result(recommendationService.trainRecommendationModels(retrainCollaborative, retrainContent))
                .build();
    }

    @Operation(
            summary = "Lấy thống kê của AI Service",
            description = "Trả về thống kê về các recommendation engines."
    )
    @GetMapping("/stats")
    public ApiResponse<Object> getStats() {
        return ApiResponse.builder()
                .result(recommendationService.getRecommendationStats())
                .build();
    }

    @Operation(
            summary = "Kiểm tra trạng thái AI Service",
            description = "Kiểm tra xem recommendation service có hoạt động bình thường không."
    )
    @GetMapping("/health")
    public ApiResponse<Object> healthCheck() {
        return ApiResponse.builder()
                .result(recommendationService.checkRecommendationServiceHealth())
                .build();
    }
}

