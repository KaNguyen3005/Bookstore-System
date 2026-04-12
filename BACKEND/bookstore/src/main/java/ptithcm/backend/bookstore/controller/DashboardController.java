package ptithcm.backend.bookstore.controller;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.DashboardSummaryResponse;
import ptithcm.backend.bookstore.dto.response.OrderStatusStatisticResponse;
import ptithcm.backend.bookstore.service.OrderService;

import java.util.List;

/**
 * Dashboard API Controller
 * 
 * Endpoints:
 * 1. GET /api/dashboard - Lấy tổng overview
 * 2. GET /api/dashboard/order-status - Lấy thống kê đơn hàng theo status
 */
@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/dashboard")
public class DashboardController {
    OrderService orderService;

    /**
     * Lấy dashboard summary toàn bộ
     * 
     * Response:
     * {
     *   "code": "0",
     *   "message": "OK",
     *   "result": {
     *     "totalOrders": 500,
     *     "pendingOrders": 12,
     *     "confirmedOrders": 50,
     *     "shippingOrders": 100,
     *     "completedOrders": 320,
     *     "cancelledOrders": 18,
     *     "totalRevenue": 50000000,
     *     "monthlyRevenue": 5000000,
     *     "dailyRevenue": 150000,
     *     "ordersByStatus": [
     *       { "status": "pending", "count": 12 },
     *       { "status": "confirmed", "count": 50 },
     *       ...
     *     ]
     *   }
     * }
     */
    @GetMapping
    public ApiResponse<DashboardSummaryResponse> getDashboard() {
        log.info("Get dashboard summary");
        return ApiResponse.<DashboardSummaryResponse>builder()
                .result(orderService.getDashboardSummary())
                .build();
    }

    /**
     * Lấy thống kê đơn hàng theo status
     * 
     * Response:
     * {
     *   "code": "0",
     *   "message": "OK",
     *   "result": [
     *     { "status": "pending", "count": 12 },
     *     { "status": "confirmed", "count": 50 },
     *     { "status": "shipping", "count": 100 },
     *     { "status": "completed", "count": 320 },
     *     { "status": "cancelled", "count": 18 }
     *   ]
     * }
     */
    @GetMapping("/order-status")
    public ApiResponse<List<OrderStatusStatisticResponse>> getOrderStatusStatistics() {
        log.info("Get order status statistics");
        return ApiResponse.<List<OrderStatusStatisticResponse>>builder()
                .result(orderService.getOrderStatusStatistics())
                .build();
    }
}

