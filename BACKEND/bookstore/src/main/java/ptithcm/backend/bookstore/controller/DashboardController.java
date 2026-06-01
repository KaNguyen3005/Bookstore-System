package ptithcm.backend.bookstore.controller;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.DashboardBookStatResponse;
import ptithcm.backend.bookstore.dto.response.DashboardOverviewResponse;
import ptithcm.backend.bookstore.dto.response.DashboardRecentOrderResponse;
import ptithcm.backend.bookstore.dto.response.DashboardRevenuePointResponse;
import ptithcm.backend.bookstore.dto.response.OrderStatusStatisticResponse;
import ptithcm.backend.bookstore.service.DashboardService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/dashboard")
public class DashboardController {
    DashboardService dashboardService;

    @PreAuthorize("hasAuthority('READ_DASHBOARD')")
    @GetMapping
    public ApiResponse<DashboardOverviewResponse> getDashboard(
            @RequestParam(name = "range", defaultValue = "today") String range,
            @RequestParam(name = "from", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(name = "to", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(name = "limit", defaultValue = "10") int limit,
            @RequestParam(name = "lowStockThreshold", defaultValue = "5") int lowStockThreshold
    ) {
        log.info(
                "Get dashboard overview, range={}, from={}, to={}, limit={}, lowStockThreshold={}",
                range,
                from,
                to,
                limit,
                lowStockThreshold
        );
        return ApiResponse.<DashboardOverviewResponse>builder()
                .result(dashboardService.getOverview(range, from, to, limit, lowStockThreshold))
                .build();
    }

    @PreAuthorize("hasAuthority('READ_DASHBOARD')")
    @GetMapping("/order-status")
    public ApiResponse<List<OrderStatusStatisticResponse>> getOrderStatusStatistics() {
        return ApiResponse.<List<OrderStatusStatisticResponse>>builder()
                .result(dashboardService.getOrderStatusStatistics())
                .build();
    }

    @PreAuthorize("hasAuthority('READ_DASHBOARD')")
    @GetMapping("/revenue-chart")
    public ApiResponse<List<DashboardRevenuePointResponse>> getRevenueChart(
            @RequestParam(name = "range", defaultValue = "today") String range,
            @RequestParam(name = "from", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(name = "to", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return ApiResponse.<List<DashboardRevenuePointResponse>>builder()
                .result(dashboardService.getRevenueChart(range, from, to))
                .build();
    }

    @PreAuthorize("hasAuthority('READ_DASHBOARD')")
    @GetMapping("/top-selling-books")
    public ApiResponse<List<DashboardBookStatResponse>> getTopSellingBooks(
            @RequestParam(name = "range", defaultValue = "month") String range,
            @RequestParam(name = "from", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(name = "to", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<DashboardBookStatResponse>>builder()
                .result(dashboardService.getTopSellingBooks(range, from, to, limit))
                .build();
    }

    @PreAuthorize("hasAuthority('READ_DASHBOARD')")
    @GetMapping("/top-rated-books")
    public ApiResponse<List<DashboardBookStatResponse>> getTopRatedBooks(
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<DashboardBookStatResponse>>builder()
                .result(dashboardService.getTopRatedBooks(limit))
                .build();
    }

    @PreAuthorize("hasAuthority('READ_DASHBOARD')")
    @GetMapping("/low-stock-books")
    public ApiResponse<List<DashboardBookStatResponse>> getLowStockBooks(
            @RequestParam(name = "threshold", defaultValue = "5") int threshold,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<DashboardBookStatResponse>>builder()
                .result(dashboardService.getLowStockBooks(threshold, limit))
                .build();
    }

    @PreAuthorize("hasAuthority('READ_DASHBOARD')")
    @GetMapping("/out-of-stock-books")
    public ApiResponse<List<DashboardBookStatResponse>> getOutOfStockBooks(
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<DashboardBookStatResponse>>builder()
                .result(dashboardService.getOutOfStockBooks(limit))
                .build();
    }

    @PreAuthorize("hasAuthority('READ_DASHBOARD')")
    @GetMapping("/recent-orders")
    public ApiResponse<List<DashboardRecentOrderResponse>> getRecentOrders(
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<DashboardRecentOrderResponse>>builder()
                .result(dashboardService.getRecentOrders(limit))
                .build();
    }
}
