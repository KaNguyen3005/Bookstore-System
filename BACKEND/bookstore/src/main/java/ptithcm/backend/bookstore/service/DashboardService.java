package ptithcm.backend.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ptithcm.backend.bookstore.dto.response.*;
import ptithcm.backend.bookstore.entity.Order;
import ptithcm.backend.bookstore.enums.OrderStatus;
import ptithcm.backend.bookstore.mapper.OrderMapper;
import ptithcm.backend.bookstore.repository.BookRepository;
import ptithcm.backend.bookstore.repository.OrderRepository;
import ptithcm.backend.bookstore.repository.UserRepository;
import ptithcm.backend.bookstore.utils.AppTime;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardService {
    private static final int DEFAULT_LOW_STOCK_THRESHOLD = 5;
    private static final int MAX_DASHBOARD_LIMIT = 10;
    private static final List<OrderStatus> REVENUE_ORDER_STATUSES = List.of(
            OrderStatus.DELIVERED,
            OrderStatus.COMPLETED
    );
    private static final List<String> REVENUE_ORDER_STATUS_NAMES = REVENUE_ORDER_STATUSES.stream()
            .map(OrderStatus::name)
            .toList();

    OrderRepository orderRepository;
    BookRepository bookRepository;
    UserRepository userRepository;
    OrderMapper orderMapper;

    @Transactional(readOnly = true)
    public DashboardOverviewResponse getOverview(String range, int limit, int lowStockThreshold) {
        return getOverview(range, null, null, limit, lowStockThreshold);
    }

    @Transactional(readOnly = true)
    public DashboardOverviewResponse getOverview(
            String range,
            LocalDate fromDate,
            LocalDate toDate,
            int limit,
            int lowStockThreshold
    ) {
        int safeLimit = normalizeLimit(limit);
        int safeLowStockThreshold = normalizeLowStockThreshold(lowStockThreshold);
        DateRange dateRange = resolveDateRange(range, fromDate, toDate);

        return DashboardOverviewResponse.builder()
                .totalRevenue(toBigDecimal(orderRepository.sumRevenueByStatusesBetween(
                        REVENUE_ORDER_STATUS_NAMES,
                        dateRange.from(),
                        dateRange.to()
                )))
                .monthlyRevenue(getRevenueForCurrentMonth())
                .dailyRevenue(getRevenueForToday())
                .totalOrders(orderRepository.countTotalOrdersBetween(dateRange.from(), dateRange.to()))
                .totalCustomers(userRepository.countByRole_RoleNameAndDeletedAtIsNull("CUSTOMER"))
                .totalProducts(bookRepository.countByDeletedAtIsNull())
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING.name()))
                .confirmedOrders(orderRepository.countByStatus(OrderStatus.CONFIRMED.name()))
                .shippingOrders(orderRepository.countByStatus(OrderStatus.SHIPPING.name()))
                .completedOrders(orderRepository.countByStatus(OrderStatus.COMPLETED.name()))
                .cancelledOrders(orderRepository.countByStatus(OrderStatus.CANCELLED.name()))
                .lowStockProducts(bookRepository.countLowStockProducts(safeLowStockThreshold))
                .outOfStockProducts(bookRepository.countOutOfStockProducts())
                .ordersByStatus(getOrderStatusStatistics())
                .revenueChart(getRevenueChart(dateRange))
                .topSellingBooks(getTopSellingBooks(dateRange, safeLimit))
                .topRatedBooks(getTopRatedBooks(safeLimit))
                .lowStockBooks(getLowStockBooks(safeLowStockThreshold, safeLimit))
                .outOfStockBooks(getOutOfStockBooks(safeLimit))
                .recentOrders(getRecentOrders(safeLimit))
                .build();
    }

    @Transactional(readOnly = true)
    public List<OrderStatusStatisticResponse> getOrderStatusStatistics() {
        return orderRepository.getOrderStatusStatistics().stream()
                .map(row -> OrderStatusStatisticResponse.builder()
                        .status(row[0].toString().toLowerCase())
                        .count(toLong(row[1]))
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DashboardRevenuePointResponse> getRevenueChart(String range) {
        return getRevenueChart(resolveDateRange(range, null, null));
    }

    @Transactional(readOnly = true)
    public List<DashboardRevenuePointResponse> getRevenueChart(String range, LocalDate fromDate, LocalDate toDate) {
        return getRevenueChart(resolveDateRange(range, fromDate, toDate));
    }

    @Transactional(readOnly = true)
    public List<DashboardBookStatResponse> getTopSellingBooks(String range, int limit) {
        return getTopSellingBooks(resolveDateRange(range, null, null), normalizeLimit(limit));
    }

    @Transactional(readOnly = true)
    public List<DashboardBookStatResponse> getTopSellingBooks(
            String range,
            LocalDate fromDate,
            LocalDate toDate,
            int limit
    ) {
        return getTopSellingBooks(resolveDateRange(range, fromDate, toDate), normalizeLimit(limit));
    }

    @Transactional(readOnly = true)
    public List<DashboardBookStatResponse> getTopRatedBooks(int limit) {
        return bookRepository.findDashboardTopRatedBooks(PageRequest.of(0, normalizeLimit(limit))).stream()
                .map(row -> DashboardBookStatResponse.builder()
                        .bookId(toInteger(row[0]))
                        .title(toStringValue(row[1]))
                        .coverImageUrl(toStringValue(row[2]))
                        .avgRating(toFloat(row[3]))
                        .stockQuantity(toInteger(row[4]))
                        .reviewCount(toLong(row[5]))
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DashboardBookStatResponse> getLowStockBooks(int threshold, int limit) {
        int safeThreshold = normalizeLowStockThreshold(threshold);
        return bookRepository.findDashboardLowStockBooks(safeThreshold, PageRequest.of(0, normalizeLimit(limit))).stream()
                .map(this::mapBookStockRow)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DashboardBookStatResponse> getOutOfStockBooks(int limit) {
        return bookRepository.findDashboardOutOfStockBooks(PageRequest.of(0, normalizeLimit(limit))).stream()
                .map(this::mapBookStockRow)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DashboardRecentOrderResponse> getRecentOrders(int limit) {
        return orderRepository.findRecentDashboardOrders(PageRequest.of(0, normalizeLimit(limit))).stream()
                .map(this::mapRecentOrder)
                .toList();
    }

    private List<DashboardRevenuePointResponse> getRevenueChart(DateRange dateRange) {
        List<Object[]> rows = switch (dateRange.groupBy()) {
            case HOUR -> orderRepository.getDashboardRevenueByHour(
                    dateRange.from(),
                    dateRange.to(),
                    REVENUE_ORDER_STATUS_NAMES
            );
            case MONTH -> orderRepository.getDashboardRevenueByMonth(
                    dateRange.from(),
                    dateRange.to(),
                    REVENUE_ORDER_STATUS_NAMES
            );
            case DAY -> orderRepository.getDashboardRevenueByDay(
                    dateRange.from(),
                    dateRange.to(),
                    REVENUE_ORDER_STATUS_NAMES
            );
        };

        return rows.stream()
                .map(row -> DashboardRevenuePointResponse.builder()
                        .period(row[0].toString())
                        .revenue(toBigDecimal(row[1]))
                        .orderCount(toLong(row[2]))
                        .build())
                .toList();
    }

    private List<DashboardBookStatResponse> getTopSellingBooks(DateRange dateRange, int limit) {
        return orderRepository.findDashboardTopSellingBooks(
                        dateRange.from(),
                        dateRange.to(),
                        REVENUE_ORDER_STATUSES,
                        PageRequest.of(0, normalizeLimit(limit))
                ).stream()
                .map(row -> DashboardBookStatResponse.builder()
                        .bookId(toInteger(row[0]))
                        .title(toStringValue(row[1]))
                        .coverImageUrl(toStringValue(row[2]))
                        .avgRating(toFloat(row[3]))
                        .stockQuantity(toInteger(row[4]))
                        .totalQuantitySold(toLong(row[5]))
                        .build())
                .toList();
    }

    private DashboardBookStatResponse mapBookStockRow(Object[] row) {
        return DashboardBookStatResponse.builder()
                .bookId(toInteger(row[0]))
                .title(toStringValue(row[1]))
                .coverImageUrl(toStringValue(row[2]))
                .avgRating(toFloat(row[3]))
                .stockQuantity(toInteger(row[4]))
                .build();
    }

    private DashboardRecentOrderResponse mapRecentOrder(Order order) {
        BigDecimal totalAmount = order.getPayment() != null && order.getPayment().getAmount() != null
                ? order.getPayment().getAmount()
                : orderMapper.calculateTotalAmount(order);

        return DashboardRecentOrderResponse.builder()
                .orderId(order.getOrderId())
                .customerName(order.getCustomer() != null ? order.getCustomer().getName() : null)
                .status(order.getStatus())
                .paymentStatus(order.getPayment() != null ? order.getPayment().getStatus() : null)
                .totalAmount(totalAmount)
                .createdAt(order.getCreatedAt())
                .build();
    }

    private BigDecimal getRevenueForToday() {
        LocalDate today = AppTime.today();
        return sumRows(orderRepository.getDashboardRevenueByDay(
                today.atStartOfDay(),
                today.atTime(LocalTime.MAX),
                REVENUE_ORDER_STATUS_NAMES
        ));
    }

    private BigDecimal getRevenueForCurrentMonth() {
        LocalDate today = AppTime.today();
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        LocalDate lastDayOfMonth = today.withDayOfMonth(today.lengthOfMonth());
        return sumRows(orderRepository.getDashboardRevenueByDay(
                firstDayOfMonth.atStartOfDay(),
                lastDayOfMonth.atTime(LocalTime.MAX),
                REVENUE_ORDER_STATUS_NAMES
        ));
    }

    private BigDecimal sumRows(List<Object[]> rows) {
        return rows.stream()
                .map(row -> toBigDecimal(row[1]))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private DateRange resolveDateRange(String rawRange) {
        return resolveDateRange(rawRange, null, null);
    }

    private DateRange resolveDateRange(String rawRange, LocalDate fromDate, LocalDate toDate) {
        if (fromDate != null || toDate != null) {
            LocalDate safeFrom = fromDate != null ? fromDate : toDate;
            LocalDate safeTo = toDate != null ? toDate : fromDate;

            if (safeFrom.isAfter(safeTo)) {
                throw new IllegalArgumentException("from must be before or equal to to");
            }

            long days = java.time.temporal.ChronoUnit.DAYS.between(safeFrom, safeTo) + 1;
            ChartGroupBy groupBy = days <= 1 ? ChartGroupBy.HOUR : days > 62 ? ChartGroupBy.MONTH : ChartGroupBy.DAY;

            return new DateRange(
                    safeFrom.atStartOfDay(),
                    safeTo.atTime(LocalTime.MAX),
                    groupBy
            );
        }

        LocalDate today = AppTime.today();
        String normalized = rawRange == null ? "today" : rawRange.trim().toLowerCase();

        return switch (normalized) {
            case "7days", "7_days", "7ngay", "7_ngay", "week" -> new DateRange(
                    today.minusDays(6).atStartOfDay(),
                    today.atTime(LocalTime.MAX),
                    ChartGroupBy.DAY
            );
            case "month", "1month", "1_month", "1thang", "1_thang" -> new DateRange(
                    today.withDayOfMonth(1).atStartOfDay(),
                    today.withDayOfMonth(today.lengthOfMonth()).atTime(LocalTime.MAX),
                    ChartGroupBy.DAY
            );
            case "year", "1year", "1_year", "nam", "năm" -> new DateRange(
                    today.withDayOfYear(1).atStartOfDay(),
                    today.withDayOfYear(today.lengthOfYear()).atTime(LocalTime.MAX),
                    ChartGroupBy.MONTH
            );
            case "all", "all_time", "tatca", "tất cả" -> new DateRange(
                    LocalDate.of(1970, 1, 1).atStartOfDay(),
                    today.atTime(LocalTime.MAX),
                    ChartGroupBy.MONTH
            );
            default -> new DateRange(
                    today.atStartOfDay(),
                    today.atTime(LocalTime.MAX),
                    ChartGroupBy.HOUR
            );
        };
    }

    private int normalizeLimit(int limit) {
        if (limit <= 0) {
            return MAX_DASHBOARD_LIMIT;
        }
        return Math.min(limit, MAX_DASHBOARD_LIMIT);
    }

    private int normalizeLowStockThreshold(int threshold) {
        return threshold <= 0 ? DEFAULT_LOW_STOCK_THRESHOLD : threshold;
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        return new BigDecimal(value.toString());
    }

    private Long toLong(Object value) {
        if (value == null) {
            return 0L;
        }
        return Long.valueOf(value.toString());
    }

    private Integer toInteger(Object value) {
        if (value == null) {
            return null;
        }
        return Integer.valueOf(value.toString());
    }

    private Float toFloat(Object value) {
        if (value == null) {
            return null;
        }
        return Float.valueOf(value.toString());
    }

    private String toStringValue(Object value) {
        return value == null ? null : value.toString();
    }

    private enum ChartGroupBy {
        HOUR,
        DAY,
        MONTH
    }

    private record DateRange(LocalDateTime from, LocalDateTime to, ChartGroupBy groupBy) {
    }
}
