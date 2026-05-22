package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardOverviewResponse {
    BigDecimal totalRevenue;
    BigDecimal monthlyRevenue;
    BigDecimal dailyRevenue;

    Long totalOrders;
    Long totalCustomers;
    Long totalProducts;

    Long pendingOrders;
    Long confirmedOrders;
    Long shippingOrders;
    Long completedOrders;
    Long cancelledOrders;

    Long lowStockProducts;
    Long outOfStockProducts;

    List<OrderStatusStatisticResponse> ordersByStatus;
    List<DashboardRevenuePointResponse> revenueChart;
    List<DashboardBookStatResponse> topSellingBooks;
    List<DashboardBookStatResponse> topRatedBooks;
    List<DashboardBookStatResponse> lowStockBooks;
    List<DashboardBookStatResponse> outOfStockBooks;
    List<DashboardRecentOrderResponse> recentOrders;
}
