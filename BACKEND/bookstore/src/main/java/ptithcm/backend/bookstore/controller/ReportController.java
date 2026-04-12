package ptithcm.backend.bookstore.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.RevenueResponse;
import ptithcm.backend.bookstore.dto.response.TopSellingBookResponse;
import ptithcm.backend.bookstore.service.OrderService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/reports")
public class ReportController {
    OrderService orderService;

    //TODO: Cần hiểu code này
    @GetMapping("/revenue")
    public ApiResponse<List<RevenueResponse>> getRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(name = "group_by", defaultValue = "day") String groupBy
    ) {
        return ApiResponse.<List<RevenueResponse>>builder()
                .result(orderService.getRevenue(from, to, groupBy))
                .build();
    }

    /**
     * 🏆 Lấy danh sách sách bán chạy nhất (Top N)
     * 
     * Endpoint: GET /api/v1/reports/top-selling-books?from=2026-01-01&to=2026-12-31&limit=10
     * 
     * Response:
     * {
     *   "code": "0",
     *   "message": "OK",
     *   "result": [
     *     { "period": "1", "revenue": 150 },  // book_id: 1, quantity: 150
     *     { "period": "5", "revenue": 120 },  // book_id: 5, quantity: 120
     *     ...
     *   ]
     * }
     */
    @GetMapping("/top-selling-books")
    public ApiResponse<List<TopSellingBookResponse>> getTopSellingBooks(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<TopSellingBookResponse>>builder()
                .result(orderService.getTopSellingBooksWithRank(from, to, limit))
                .build();
    }

    /**
     * 🏆 Lấy sách bán chạy nhất (Top 1)
     * 
     * Endpoint: GET /api/v1/reports/top-selling-book?from=2026-01-01&to=2026-12-31
     * 
     * Response:
     * {
     *   "code": "0",
     *   "message": "OK",
     *   "result": {
     *     "bookId": 1,
     *     "title": "Java Programming",
     *     "totalQuantitySold": 150,
     *     "rank": 1
     *   }
     * }
     */
    @GetMapping("/top-selling-book")
    public ApiResponse<TopSellingBookResponse> getTopSellingBook(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return ApiResponse.<TopSellingBookResponse>builder()
                .result(orderService.getTopSellingBook(from, to))
                .build();
    }
}
