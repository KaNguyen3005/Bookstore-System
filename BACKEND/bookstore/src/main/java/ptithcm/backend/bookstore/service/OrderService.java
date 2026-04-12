package ptithcm.backend.bookstore.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.configuration.GHNConfig;
import ptithcm.backend.bookstore.dto.request.CreateOrderRequest;
import ptithcm.backend.bookstore.dto.request.OrderItemRequest;
import ptithcm.backend.bookstore.dto.request.OrderPricing;
import ptithcm.backend.bookstore.dto.request.UpdateOrderStatusRequest;
import ptithcm.backend.bookstore.dto.response.OrderResponse;
import ptithcm.backend.bookstore.dto.response.RevenueResponse;
import ptithcm.backend.bookstore.dto.response.UserResponse;
import ptithcm.backend.bookstore.entity.*;
import ptithcm.backend.bookstore.enums.*;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
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
    public List<OrderResponse> getAll() {

        List<Order> orders = orderRepository.findAll();

        List<Long> orderIds = orders.stream()
                .map(Order::getOrderId)
                .toList();

        Map<Long, Shipment> shipmentMap = shipmentRepository.findByOrderIds(orderIds)
                .stream()
                .collect(Collectors.toMap(
                        s -> s.getOrder().getOrderId(),
                        s -> s
                ));
        Map<Long, Payment> paymentMap = paymentRepository.findByOrderIds(orderIds)
                .stream()
                .collect(Collectors.toMap(
                        p -> p.getOrder().getOrderId(),
                        p -> p
                ));

        return orders.stream()
                .map(order -> {
                    OrderResponse response = orderMapper.toResponse(order);

                    Shipment shipment = shipmentMap.get(order.getOrderId());
                    if (shipment != null) {
                        response.setShippingStatus(shipment.getStatus());
                    }
                    Payment payment = paymentMap.get(order.getOrderId());
                    if (payment != null) {
                        response.setPaymentStatus(payment.getStatus());
                    }
                    return response;
                })
                .toList();
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

        order.setStatus(OrderStatus.CONFIRMED);

        shipmentRepository.save(shipment);
        orderRepository.save(order);

        return orderMapper.toResponse(order);
    }

    @Transactional
    public void cancelOrder(Integer id) {
        // 1. Lấy thông tin user hiện tại
        UserResponse userResponse = userService.getMyInfo();
        User customer = userRepository.findById(userResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Tìm đơn hàng
        Order order = orderRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // 3. Kiểm tra quyền sở hữu đơn hàng
        if (!order.getCustomer().getUserId().equals(customer.getUserId())) {
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

        log.info("Order cancelled successfully - OrderId: {}, CustomerId: {}", order.getOrderId(), customer.getUserId());
    }

    public List<RevenueResponse> getRevenue(LocalDate from, LocalDate to, String groupBy) {
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.atTime(23, 59, 59);

        String normalized = groupBy == null ? "day" : groupBy.trim().toLowerCase();

        List<Object[]> rows = switch (normalized) {
            case "month" -> orderRepository.getRevenueByMonth(fromDateTime, toDateTime, OrderStatus.COMPLETED.ordinal());
            case "year" -> orderRepository.getRevenueByYear(fromDateTime, toDateTime, OrderStatus.COMPLETED.ordinal());
            default -> orderRepository.getRevenueByDay(fromDateTime, toDateTime, OrderStatus.COMPLETED.ordinal());
        };

        return rows.stream()
                .map(row -> new RevenueResponse(
                        row[0].toString(),
                        (BigDecimal) row[1]
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

        BigDecimal vatRate = new BigDecimal("0.05");
        BigDecimal vatAmount = amountAfterAllDiscount.multiply(vatRate)
                .setScale(2, RoundingMode.HALF_UP);

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
                .totalAmount(pricing.getTotalAmount())
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
        return Shipment.builder()
                .order(order)
                .customerName(customer.getName())
                .customerPhone(customer.getPhone())
                .detailAddress(address.getDetailAddress())
                .ward(address.getWard())
                .district(address.getDistrict())
                .province(address.getProvince())
                .status(ShippingStatus.PENDING)
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

        Long points = order.getTotalAmount().longValue() / 10000;

        user.setPoint(user.getPoint() + points);
        order.setRewardPointApplied(true);

        userRepository.save(user);
        orderRepository.save(order);
    }
}
