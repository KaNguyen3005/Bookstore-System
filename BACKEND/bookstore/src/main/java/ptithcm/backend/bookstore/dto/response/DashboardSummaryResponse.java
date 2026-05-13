package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {
    // Order Statistics
    Long totalOrders;
    Long pendingOrders;
    Long confirmedOrders;
    Long shippingOrders;
    Long completedOrders;
    Long cancelledOrders;
    
    // Revenue
    BigDecimal totalRevenue;
    BigDecimal monthlyRevenue;
    BigDecimal dailyRevenue;
    
    // Products
    Long totalProducts;
    Long outOfStockProducts;
    Long lowStockProducts;
    
    // Details
    List<OrderStatusStatisticResponse> ordersByStatus;
}

