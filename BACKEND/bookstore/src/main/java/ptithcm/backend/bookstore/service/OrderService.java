package ptithcm.backend.bookstore.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.configuration.GHNConfig;
import ptithcm.backend.bookstore.dto.request.*;
import ptithcm.backend.bookstore.dto.response.*;
import ptithcm.backend.bookstore.entity.*;
import ptithcm.backend.bookstore.enums.*;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.BookOrderMapper;
import ptithcm.backend.bookstore.mapper.OrderItemMapper;
import ptithcm.backend.bookstore.mapper.OrderMapper;
import ptithcm.backend.bookstore.mapper.VoucherMapper;
import ptithcm.backend.bookstore.repository.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private static final BigDecimal DEFAULT_VAT_RATE = new BigDecimal("0.05");

    ShipmentRepository shipmentRepository;
    PaymentRepository paymentRepository;
    BookRepository bookRepository;
    VoucherRepository voucherRepository;
    AddressRepository addressRepository;
    OrderRepository orderRepository;
    UserRepository userRepository;
    UserService userService;
    OrderMapper orderMapper;
    GHNService ghnService;
    VoucherMapper voucherMapper;
    BookOrderRepository bookOrderRepository;
    BookOrderMapper bookOrderMapper;
    InteractEventService interactEventService;

    @Transactional
    public Page<OrderResponse> getAll(int page, int size) {

        Pageable pageable = buildOrderPageable(page, size);
        Page<Order> orders = orderRepository.findByDeletedAtIsNull(pageable);

        List<Long> orderIds = orders.getContent().stream()
                .map(Order::getOrderId)
                .toList();
        Map<Long, Payment> paymentMap = paymentRepository.findByOrderIds(orderIds)
                .stream()
                .collect(Collectors.toMap(
                        p -> p.getOrder().getOrderId(),
                        p -> p
                ));

        return orders
                .map(order -> {
                    OrderResponse response = orderMapper.toResponse(order);

                    // ShippingStatus đã nằm trong response.getShipment().getStatus() (map từ Order.shipment)
                    Payment payment = paymentMap.get(order.getOrderId());
                    if (payment != null) {
                        response.setPaymentStatus(payment.getStatus());
                    }
                    return response;
                });
    }

    @Transactional
    public Page<OrderResponse> getMyOrders(int page, int size) {
        UserResponse userResponse = userService.getMyInfo();
        Pageable pageable = buildOrderPageable(page, size);

        Page<Order> orders = orderRepository.findByCustomer_UserIdAndDeletedAtIsNull(userResponse.getUserId(), pageable);

        List<Long> orderIds = orders.getContent().stream()
                .map(Order::getOrderId)
                .toList();
        Map<Long, Payment> paymentMap = paymentRepository.findByOrderIds(orderIds)
                .stream()
                .collect(Collectors.toMap(
                        p -> p.getOrder().getOrderId(),
                        p -> p
                ));

        return orders.map(order -> {
            OrderResponse response = orderMapper.toResponse(order);
            Payment payment = paymentMap.get(order.getOrderId());
            if (payment != null) {
                response.setPaymentStatus(payment.getStatus());
            }
            return response;
        });
    }

    @Transactional
    public OrderResponse getMyOrderById(Long id){
        UserResponse user = userService.getMyInfo();

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));


        return orderMapper.toResponse(order);
    }


    @Transactional
    public OrderResponse create(CreateOrderRequest request) {
        User customer = getCurrentCustomer();
        Address address = getValidatedAddress(request.getAddressId(), customer);
        validateOrderItems(request);
        Map<Integer, Book> bookMap = loadBooksMap(request);
        BigDecimal subtotal = calculateSubtotal(request, bookMap);
        Voucher voucher = resolveVoucher(request.getVoucherCode(), subtotal);
        BigDecimal tierRate = getTierRate(customer);
        OrderPricing pricing = calculatePricing(subtotal, voucher, tierRate);
        Order order = buildOrder(customer, voucher, pricing);
        List<BookOrder> bookOrders = buildBookOrders(request, order, bookMap);
        order.setBookOrders(bookOrders);
        decreaseStock(request, bookMap);
        bookRepository.saveAll(bookMap.values());
        Order savedOrder = orderRepository.save(order);
        Shipment shipment = buildShipment(savedOrder, customer, address);
        shipmentRepository.save(shipment);
        increaseVoucherUsage(voucher);
        Payment payment = buildPayment(savedOrder, request.getPaymentMethod(), pricing.getTotalAmount());
        paymentRepository.save(payment);
        logOrderCreated(savedOrder, customer, subtotal, pricing);
        OrderResponse response = orderMapper.toResponse(savedOrder);
        response.setSubtotal(subtotal);

        for (OrderItemRequest item : request.getItems()) {
            interactEventService.recordEvent(
                    customer.getUserId(),
                    item.getBookId(),
                    InteractEventType.PURCHASE
            );
        }
        return response;
    }
    public OrderResponse update(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        OrderStatus newStatus = request.getStatus();
        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        return orderMapper.toResponse(updatedOrder);
    }

    public OrderResponse getById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        return orderMapper.toResponse(order);
    }

    @Transactional
    public OrderResponse approveOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS);
        }

        Shipment shipment = shipmentRepository.findByOrder_OrderId(order.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.SHIPMENT_NOT_FOUND));

        String ghnOrderCode = ghnService.createShippingOrder(order);

        shipment.setTrackingNumber(ghnOrderCode);
        shipment.setStatus(ShippingStatus.READY_TO_SHIP);
        UserResponse staffResponse = userService.getMyInfo();
        User staff = userRepository.findById(staffResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        order.setStatus(OrderStatus.CONFIRMED);
        order.setStaff(staff);

        shipmentRepository.save(shipment);
        orderRepository.save(order);

        return orderMapper.toResponse(order);
    }

    @Transactional
    public void cancelOrder(Integer id) {
        // 1. Lấy thông tin user hiện tại
        UserResponse userResponse = userService.getMyInfo();
        User currentUser = userRepository.findById(userResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Tìm đơn hàng
        Order order = orderRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // 3. Kiểm tra quyền sở hữu đơn hàng
        if (!canCancelOrder(currentUser, order)) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        // 4. Kiểm tra trạng thái đơn hàng có thể hủy không
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new AppException(ErrorCode.ORDER_CANNOT_CANCEL);
        }

        // 5. Cập nhật trạng thái đơn hàng thành CANCELLED
        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        // 6. Cập nhật trạng thái payment nếu có
        Payment payment = paymentRepository.findByOrder_OrderId(order.getOrderId());
        if (payment != null) {
            payment.setStatus(PaymentStatus.CANCELLED);
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
        }

        // 7. Hoàn lại voucher nếu đã sử dụng
        if (order.getVoucher() != null) {
            Voucher voucher = order.getVoucher();
            voucher.setUsedCount(voucher.getUsedCount() - 1);
            voucherRepository.save(voucher);
        }

        log.info("Order cancelled successfully - OrderId: {}, UserId: {}", order.getOrderId(), currentUser.getUserId());
    }

    private Pageable buildOrderPageable(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);
        return PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    private boolean canCancelOrder(User user, Order order) {
        if (user.getRole() != null) {
            String roleName = user.getRole().getRoleName();
            if (ptithcm.backend.bookstore.enums.Role.ADMIN.name().equals(roleName)
                    || ptithcm.backend.bookstore.enums.Role.STAFF.name().equals(roleName)) {
                return true;
            }
        }

        return order.getCustomer() != null && order.getCustomer().getUserId().equals(user.getUserId());
    }

    public List<RevenueResponse> getRevenue(LocalDate from, LocalDate to, String groupBy) {
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.atTime(23, 59, 59);

        String normalized = groupBy == null ? "day" : groupBy.trim().toLowerCase();

        List<Object[]> rows = switch (normalized) {
            case "month" -> orderRepository.getRevenueByMonth(fromDateTime, toDateTime, OrderStatus.COMPLETED.name());
            case "year" -> orderRepository.getRevenueByYear(fromDateTime, toDateTime, OrderStatus.COMPLETED.name());
            default -> orderRepository.getRevenueByDay(fromDateTime, toDateTime, OrderStatus.COMPLETED.name());
        };

        return rows.stream()
                .map(row -> new RevenueResponse(
                        row[0].toString(),
                        toBigDecimal(row[1])
                ))
                .toList();
    }

    private User getCurrentCustomer() {
        UserResponse userResponse = userService.getMyInfo();
        return userRepository.findById(userResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private Address getValidatedAddress(Long addressId, User customer) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        if (!address.getUser().getUserId().equals(customer.getUserId())) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        return address;
    }

    private void validateOrderItems(CreateOrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new AppException(ErrorCode.ORDER_IS_EMPTY);
        }
    }

    private Map<Integer, Book> loadBooksMap(CreateOrderRequest request) {
        List<Integer> bookIds = request.getItems().stream()
                .map(OrderItemRequest::getBookId)
                .distinct()
                .toList();

        List<Book> books = bookRepository.findAllById(bookIds);

        if (books.size() != bookIds.size()) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }

        return books.stream()
                .collect(Collectors.toMap(Book::getBookId, Function.identity()));
    }

    private BigDecimal calculateSubtotal(CreateOrderRequest request, Map<Integer, Book> bookMap) {
        BigDecimal subtotal = request.getItems().stream()
                .map(item -> calculateItemAmount(item, bookMap))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return subtotal.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateItemAmount(OrderItemRequest item, Map<Integer, Book> bookMap) {
        if (item.getQuantity() == null || item.getQuantity() <= 0) {
            throw new AppException(ErrorCode.INVALID_QUANTITY);
        }

        Book book = bookMap.get(item.getBookId());
        if (book == null) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }

        if (book.getStockQuantity() < item.getQuantity()) {
            throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
        }

        return book.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
    }

    private BigDecimal getTierRate(User customer) {
        BigDecimal tierRate = mappingTierToDiscount(customer.getTier());
        return tierRate != null ? tierRate : BigDecimal.ZERO;
    }

    private Voucher resolveVoucher(String voucherCode, BigDecimal subtotal) {
        if (voucherCode == null || voucherCode.trim().isEmpty()) {
            return null;
        }

        Voucher voucher = voucherRepository.findByVoucherCode(voucherCode.trim())
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        validateVoucher(voucher, subtotal);
        return voucher;
    }

    private void validateVoucher(Voucher voucher, BigDecimal subtotal) {
        LocalDateTime now = LocalDateTime.now();

        if (Boolean.FALSE.equals(voucher.getIsActive())) {
            throw new AppException(ErrorCode.VOUCHER_INACTIVE);
        }

        if (voucher.getStartDate() != null && voucher.getStartDate().isAfter(now)) {
            throw new AppException(ErrorCode.VOUCHER_NOT_STARTED);
        }

        if (voucher.getEndDate() != null && voucher.getEndDate().isBefore(now)) {
            throw new AppException(ErrorCode.VOUCHER_EXPIRED);
        }

        if (voucher.getTotalLimit() != null
                && voucher.getUsedCount() != null
                && voucher.getUsedCount() >= voucher.getTotalLimit()) {
            throw new AppException(ErrorCode.VOUCHER_OUT_OF_STOCK);
        }

        if (voucher.getMinOrderValue() != null
                && subtotal.compareTo(voucher.getMinOrderValue()) < 0) {
            throw new AppException(ErrorCode.ORDER_NOT_ELIGIBLE_FOR_VOUCHER);
        }
    }

    public BigDecimal mappingTierToDiscount(String tier) {
        return switch (tier.toUpperCase()) {
            case "BRONZE" -> BigDecimal.valueOf(0.01);
            case "SILVER" -> BigDecimal.valueOf(0.02);
            case "GOLD" -> BigDecimal.valueOf(0.03);
            case "PLATINUM" -> BigDecimal.valueOf(0.05);
            default -> BigDecimal.ZERO;
        };
    }





    private OrderPricing calculatePricing(BigDecimal subtotal, Voucher voucher, BigDecimal tierRate) {
        BigDecimal fixedDiscountAmount = BigDecimal.ZERO;
        BigDecimal voucherPercentRate = BigDecimal.ZERO;

        if (voucher != null) {
            if (voucher.getType() == VoucherType.FIXED) {
                fixedDiscountAmount = voucher.getDiscountValue().setScale(2, RoundingMode.HALF_UP);
            } else if (voucher.getType() == VoucherType.PERCENTAGE) {
                voucherPercentRate = voucher.getDiscountValue()
                        .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            }
        }

        if (fixedDiscountAmount.compareTo(subtotal) > 0) {
            fixedDiscountAmount = subtotal;
        }

        BigDecimal amountAfterFixedDiscount = subtotal.subtract(fixedDiscountAmount)
                .max(BigDecimal.ZERO)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal percentDiscountAmount = calculatePercentDiscount(
                amountAfterFixedDiscount, voucher, voucherPercentRate, tierRate
        );

        if (percentDiscountAmount.compareTo(amountAfterFixedDiscount) > 0) {
            percentDiscountAmount = amountAfterFixedDiscount;
        }

        BigDecimal amountAfterAllDiscount = amountAfterFixedDiscount.subtract(percentDiscountAmount)
                .max(BigDecimal.ZERO)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal vatRate = DEFAULT_VAT_RATE;
        BigDecimal vatAmount = roundVatAmount(amountAfterAllDiscount.multiply(vatRate));

        BigDecimal totalAmount = amountAfterAllDiscount.add(vatAmount)
                .setScale(2, RoundingMode.HALF_UP);

        return OrderPricing.builder()
                .vatRate(vatRate)
                .vatAmount(vatAmount)
                .totalAmount(totalAmount)
                .fixedDiscountAmount(fixedDiscountAmount)
                .voucherPercentRate(voucherPercentRate)
                .tierRate(tierRate)
                .percentDiscountAmount(percentDiscountAmount)
                .build();
    }

    private BigDecimal calculatePercentDiscount(
            BigDecimal amountAfterFixedDiscount,
            Voucher voucher,
            BigDecimal voucherPercentRate,
            BigDecimal tierRate
    ) {
        BigDecimal totalPercentDiscountRate = voucherPercentRate.add(tierRate);

        if (totalPercentDiscountRate.compareTo(BigDecimal.ONE) > 0) {
            totalPercentDiscountRate = BigDecimal.ONE;
        }

        if (totalPercentDiscountRate.compareTo(BigDecimal.ZERO) < 0) {
            totalPercentDiscountRate = BigDecimal.ZERO;
        }

        BigDecimal percentDiscountAmount = amountAfterFixedDiscount
                .multiply(totalPercentDiscountRate)
                .setScale(2, RoundingMode.HALF_UP);

        if (voucher != null
                && voucher.getType() == VoucherType.PERCENTAGE
                && voucher.getMaxDiscountAmount() != null) {

            BigDecimal rawVoucherDiscount = amountAfterFixedDiscount
                    .multiply(voucherPercentRate)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal cappedVoucherDiscount = rawVoucherDiscount.min(voucher.getMaxDiscountAmount());

            BigDecimal tierDiscountAmount = amountAfterFixedDiscount
                    .multiply(tierRate)
                    .setScale(2, RoundingMode.HALF_UP);

            percentDiscountAmount = cappedVoucherDiscount.add(tierDiscountAmount)
                    .setScale(2, RoundingMode.HALF_UP);
        }

        return percentDiscountAmount;
    }

    private Order buildOrder(User customer, Voucher voucher, OrderPricing pricing) {
        Order order = Order.builder()
                .customer(customer)
                .status(OrderStatus.PENDING)
                .voucher(voucher)
                .vatRate(pricing.getVatRate())
                .vatAmount(pricing.getVatAmount())
                .tierRate(pricing.getTierRate())
                .build();

        return order;
    }

    private List<BookOrder> buildBookOrders(CreateOrderRequest request, Order order, Map<Integer, Book> bookMap) {
        return request.getItems().stream()
                .map(item -> BookOrder.builder()
                        .order(order)
                        .book(bookMap.get(item.getBookId()))
                        .quantity(item.getQuantity())
                        .build())
                .toList();
    }

    private void decreaseStock(CreateOrderRequest request, Map<Integer, Book> bookMap) {
        for (OrderItemRequest item : request.getItems()) {
            Book book = bookMap.get(item.getBookId());
            book.setStockQuantity(book.getStockQuantity() - item.getQuantity());
        }
    }

    private Shipment buildShipment(Order order, User customer, Address address) {
        // Tính toán kích thước và trọng lượng từ các sách trong đơn hàng
        ShipmentDimensions dimensions = calculateShipmentDimensions(order.getBookOrders());

        return Shipment.builder()
                .order(order)
                .address(address)
                .status(ShippingStatus.PENDING)
                .weight(dimensions.getWeight())
                .length(dimensions.getLength())
                .width(dimensions.getWidth())
                .height(dimensions.getHeight())
                .build();
    }

    /**
     * Tính toán kích thước và trọng lượng từ danh sách sách trong đơn hàng
     * - Weight: Tổng trọng lượng của tất cả sách (weight * quantity)
     * - Length: Chiều dài lớn nhất * số lượng sách loại
     * - Width: Chiều rộng lớn nhất * số lượng sách loại
     * - Height: Tổng chiều cao của tất cả sách xếp chồng lên nhau (height * quantity)
     */
    private ShipmentDimensions calculateShipmentDimensions(List<BookOrder> bookOrders) {
        if (bookOrders == null || bookOrders.isEmpty()) {
            return ShipmentDimensions.builder()
                    .weight(0)
                    .length(10)      // Default 10cm
                    .width(10)       // Default 10cm
                    .height(5)       // Default 5cm
                    .build();
        }

        int totalWeight = 0;
        int maxLength = 0;
        int maxWidth = 0;
        int totalHeight = 0;

        for (BookOrder bookOrder : bookOrders) {
            Book book = bookOrder.getBook();
            int quantity = bookOrder.getQuantity();

            // Tính tổng trọng lượng (kg)
            if (book.getWeight() != null) {
                totalWeight += book.getWeight() * quantity;
            }

            // Lấy chiều dài và chiều rộng lớn nhất
            if (book.getLength() != null && book.getLength() > maxLength) {
                maxLength = book.getLength();
            }
            if (book.getWidth() != null && book.getWidth() > maxWidth) {
                maxWidth = book.getWidth();
            }

            // Tính tổng chiều cao (xếp chồng lên nhau)
            if (book.getHeight() != null) {
                totalHeight += book.getHeight() * quantity;
            }
        }

        // Đảm bảo các giá trị tối thiểu
        if (maxLength == 0) maxLength = 20;  // Default 20cm
        if (maxWidth == 0) maxWidth = 15;   // Default 15cm
        if (totalHeight == 0) totalHeight = 5; // Default 5cm
        if (totalWeight == 0) totalWeight = 1; // Default 1kg

        return ShipmentDimensions.builder()
                .weight(totalWeight)
                .length(maxLength)
                .width(maxWidth)
                .height(totalHeight)
                .build();
    }

    private void increaseVoucherUsage(Voucher voucher) {
        if (voucher == null) return;

        int currentUsedCount = voucher.getUsedCount() == null ? 0 : voucher.getUsedCount();
        voucher.setUsedCount(currentUsedCount + 1);
        voucherRepository.save(voucher);
    }

    private Payment buildPayment(Order order, String paymentMethodRaw, BigDecimal totalAmount) {
        PaymentMethod paymentMethod = parsePaymentMethod(paymentMethodRaw);

        return Payment.builder()
                .order(order)
                .method(paymentMethod)
                .status(PaymentStatus.PENDING)
                .amount(totalAmount)
                .build();
    }

    private PaymentMethod parsePaymentMethod(String paymentMethodRaw) {
        if (paymentMethodRaw == null || paymentMethodRaw.isBlank()) {
            return PaymentMethod.COD;
        }

        try {
            return PaymentMethod.valueOf(paymentMethodRaw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid payment method: {}, using COD as default", paymentMethodRaw);
            return PaymentMethod.COD;
        }
    }

    private void logOrderCreated(Order order, User customer, BigDecimal subtotal, OrderPricing pricing) {
        log.info(
                "Order created successfully - OrderId: {}, CustomerId: {}, Subtotal: {}, FixedDiscount: {}, VoucherPercentRate: {}, TierRate: {}, PercentDiscount: {}, VAT: {}, TotalAmount: {}",
                order.getOrderId(),
                customer.getUserId(),
                subtotal,
                pricing.getFixedDiscountAmount(),
                pricing.getVoucherPercentRate(),
                pricing.getTierRate(),
                pricing.getPercentDiscountAmount(),
                pricing.getVatAmount(),
                pricing.getTotalAmount()
        );
    }

    @Transactional
    public void addPointsForDeliveredOrder(Order order) {
        if (Boolean.TRUE.equals(order.getRewardPointApplied())) {
            return;
        }

        User user = order.getCustomer();
        if (user == null) return;

        Long points = calculateOrderTotalAmount(order).longValue() / 10000;

        user.setPoint(user.getPoint() + points);
        order.setRewardPointApplied(true);

        userRepository.save(user);
        orderRepository.save(order);
    }

    /**
     * Lấy danh sách sách bán chạy nhất trong khoảng thời gian
     * @param from Ngày bắt đầu
     * @param to Ngày kết thúc
     * @param limit Số lượng sách cần lấy (ví dụ: 10, 20, ...)
     * @return Danh sách sách bán chạy nhất cùng số lượng bán
     */
    public List<RevenueResponse> getTopSellingBooks(LocalDate from, LocalDate to, int limit) {
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.atTime(23, 59, 59);

        List<Object[]> rows = orderRepository.getTopSellingBooks(
                fromDateTime, 
                toDateTime, 
                OrderStatus.COMPLETED.name(),
                limit
        );

        return rows.stream()
                .map(row -> new RevenueResponse(
                        row[0].toString(),
                        toBigDecimal(row[2])  // totalQuantitySold
                ))
                .toList();
    }

    /**
     * Lấy sách bán chạy nhất (top 1) trong khoảng thời gian
     * @param from Ngày bắt đầu
     * @param to Ngày kết thúc
     * @return Sách bán chạy nhất hoặc null nếu không có
     */
    public TopSellingBookResponse getTopSellingBook(LocalDate from, LocalDate to) {
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.atTime(23, 59, 59);

        List<Object[]> rows = orderRepository.getTopSellingBook(
                fromDateTime, 
                toDateTime, 
                OrderStatus.COMPLETED.name()
        );

        if (rows.isEmpty()) {
            return null;
        }

        Object[] row = rows.get(0);
        return TopSellingBookResponse.builder()
                .bookId(((Number) row[0]).intValue())
                .title(row[1].toString())
                .totalQuantitySold(((Number) row[2]).longValue())
                .rank(1L)
                .build();
    }

    /**
     * Lấy danh sách sách bán chạy nhất với ranking
     * @param from Ngày bắt đầu
     * @param to Ngày kết thúc
     * @param limit Số lượng sách cần lấy
     * @return Danh sách sách với ranking
     */
    public List<TopSellingBookResponse> getTopSellingBooksWithRank(LocalDate from, LocalDate to, int limit) {
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.atTime(23, 59, 59);

        List<Object[]> rows = orderRepository.getTopSellingBooks(
                fromDateTime, 
                toDateTime, 
                OrderStatus.COMPLETED.name(),
                limit
        );

        return rows.stream()
                .map(row -> TopSellingBookResponse.builder()
                        .bookId(((Number) row[0]).intValue())
                        .title(row[1].toString())
                        .totalQuantitySold(((Number) row[2]).longValue())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Thống kê số lượng đơn hàng theo trạng thái
     * @return Danh sách đơn hàng grouped by status
     */
    public List<OrderStatusStatisticResponse> getOrderStatusStatistics() {
        List<Object[]> rows = orderRepository.getOrderStatusStatistics();
        
        return rows.stream()
                .map(row -> {
                    Long count = ((Number) row[1]).longValue();
                    
                    return OrderStatusStatisticResponse.builder()
                            .status(row[0].toString().toLowerCase())
                            .count(count)
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Lấy dashboard summary với tất cả thống kê
     */
    public DashboardSummaryResponse getDashboardSummary() {
        // Get order statistics
        List<OrderStatusStatisticResponse> orderStats = getOrderStatusStatistics();
        
        // Calculate totals
        Long totalOrders = orderRepository.countTotalOrders();
        
        Long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING.name());
        Long confirmedOrders = orderRepository.countByStatus(OrderStatus.CONFIRMED.name());
        Long shippingOrders = orderRepository.countByStatus(OrderStatus.SHIPPING.name());
        Long completedOrders = orderRepository.countByStatus(OrderStatus.COMPLETED.name());
        Long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED.name());
        
        // Calculate revenue for today
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        
        List<Object[]> dailyRevenue = orderRepository.getRevenueByDay(
                startOfDay, 
                endOfDay, 
                OrderStatus.COMPLETED.name()
        );
        
        BigDecimal totalRevenueToday = dailyRevenue.isEmpty() ? 
                BigDecimal.ZERO : 
                toBigDecimal(dailyRevenue.get(0)[1]);
        
        // Calculate revenue for this month
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(23, 59, 59);
        
        List<Object[]> monthlyRevenue = orderRepository.getRevenueByMonth(
                startOfMonth, 
                endOfMonth, 
                OrderStatus.COMPLETED.name()
        );
        
        BigDecimal totalRevenueMonth = BigDecimal.ZERO;
        for (Object[] row : monthlyRevenue) {
            BigDecimal revenue = toBigDecimal(row[1]);
            totalRevenueMonth = totalRevenueMonth.add(revenue != null ? revenue : BigDecimal.ZERO);
        }
        
        // Calculate total revenue all time
        LocalDateTime startOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        LocalDateTime endOfYear = LocalDate.now().withDayOfYear(LocalDate.now().lengthOfYear()).atTime(23, 59, 59);
        
        List<Object[]> yearlyRevenue = orderRepository.getRevenueByYear(
                startOfYear, 
                endOfYear, 
                OrderStatus.COMPLETED.name()
        );
        
        BigDecimal totalRevenueYear = BigDecimal.ZERO;
        for (Object[] row : yearlyRevenue) {
            BigDecimal revenue = toBigDecimal(row[1]);
            totalRevenueYear = totalRevenueYear.add(revenue != null ? revenue : BigDecimal.ZERO);
        }
        
        // Build response
        return DashboardSummaryResponse.builder()
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .confirmedOrders(confirmedOrders)
                .shippingOrders(shippingOrders)
                .completedOrders(completedOrders)
                .cancelledOrders(cancelledOrders)
                .totalRevenue(totalRevenueYear)
                .monthlyRevenue(totalRevenueMonth)
                .dailyRevenue(totalRevenueToday)
                .ordersByStatus(orderStats)
                .build();
    }

    /**
     * Tính totalAmount từ Order (subtotal + VAT)
     * Dùng cho các service khác cần totalAmount nhưng Order không lưu trữ nó
     */
    public BigDecimal calculateOrderTotalAmount(Order order) {
        if (order == null || order.getBookOrders() == null || order.getBookOrders().isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal amountAfterDiscount = calculateOrderAmountAfterDiscount(order);
        BigDecimal vatRate = resolveVatRate(order);
        BigDecimal vatAmount = roundVatAmount(amountAfterDiscount.multiply(vatRate));

        return amountAfterDiscount.add(vatAmount).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal resolveVatRate(Order order) {
        if (order == null || order.getVatRate() == null || order.getVatRate().compareTo(BigDecimal.ZERO) == 0) {
            return DEFAULT_VAT_RATE;
        }
        return order.getVatRate();
    }

    private BigDecimal calculateOrderAmountAfterDiscount(Order order) {
        BigDecimal subtotal = calculateOrderSubtotal(order);
        BigDecimal fixedDiscountAmount = BigDecimal.ZERO;
        BigDecimal voucherPercentRate = BigDecimal.ZERO;
        Voucher voucher = order.getVoucher();

        if (voucher != null && voucher.getDiscountValue() != null) {
            if (voucher.getType() == VoucherType.FIXED) {
                fixedDiscountAmount = voucher.getDiscountValue().setScale(2, RoundingMode.HALF_UP);
            } else if (voucher.getType() == VoucherType.PERCENTAGE) {
                voucherPercentRate = voucher.getDiscountValue()
                        .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            }
        }

        if (fixedDiscountAmount.compareTo(subtotal) > 0) {
            fixedDiscountAmount = subtotal;
        }

        BigDecimal amountAfterFixedDiscount = subtotal.subtract(fixedDiscountAmount)
                .max(BigDecimal.ZERO)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal tierRate = order.getTierRate() != null ? order.getTierRate() : BigDecimal.ZERO;
        BigDecimal percentDiscountAmount = calculatePercentDiscount(
                amountAfterFixedDiscount,
                voucher,
                voucherPercentRate,
                tierRate
        );

        if (percentDiscountAmount.compareTo(amountAfterFixedDiscount) > 0) {
            percentDiscountAmount = amountAfterFixedDiscount;
        }

        return amountAfterFixedDiscount.subtract(percentDiscountAmount)
                .max(BigDecimal.ZERO)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateOrderSubtotal(Order order) {
        BigDecimal subtotal = BigDecimal.ZERO;
        for (BookOrder bo : order.getBookOrders()) {
            if (bo == null || bo.getBook() == null || bo.getBook().getPrice() == null || bo.getQuantity() == null) {
                continue;
            }
            subtotal = subtotal.add(bo.getBook().getPrice().multiply(BigDecimal.valueOf(bo.getQuantity())));
        }
        return subtotal.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal roundVatAmount(BigDecimal vatAmount) {
        if (vatAmount == null) {
            return BigDecimal.ZERO;
        }
        return vatAmount.setScale(0, RoundingMode.CEILING);
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        return new BigDecimal(value.toString());
    }

    public OrderItemResponse updateOrderItem(Long orderId, Long itemId, UpdateOrderItemRequest request){
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        UserResponse user = userService.getMyInfo();
        if (order.getCustomer() == null || !order.getCustomer().getUserId().equals(user.getUserId())) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        // Chỉ cho phép đánh giá khi đơn đã giao hoặc đã hoàn thành
        if (order.getStatus() != OrderStatus.DELIVERED && order.getStatus() != OrderStatus.COMPLETED) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS);
        }

        // NOTE: method signature is (itemId, orderId)
        BookOrder bookOrder = bookOrderRepository.findByBookOrderIdAndOrder_OrderId(itemId, orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_ITEM_NOT_FOUND));

        if(bookOrder.getContent() != null || bookOrder.getRate() != null){
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        bookOrder.setContent(request.getContent());
        bookOrder.setRate(request.getRating());
        interactEventService.recordEvent(user.getUserId(), bookOrder.getBook().getBookId(), InteractEventType.REVIEW);
        return bookOrderMapper.toResponse(bookOrderRepository.save(bookOrder));
    }
}
