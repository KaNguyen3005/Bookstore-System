package ptithcm.backend.bookstore.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreateOrderRequest;
import ptithcm.backend.bookstore.dto.request.OrderItemRequest;
import ptithcm.backend.bookstore.dto.response.OrderResponse;
import ptithcm.backend.bookstore.dto.response.UserResponse;
import ptithcm.backend.bookstore.entity.*;
import ptithcm.backend.bookstore.enums.OrderStatus;
import ptithcm.backend.bookstore.enums.PaymentMethod;
import ptithcm.backend.bookstore.enums.PaymentStatus;
import ptithcm.backend.bookstore.enums.VoucherType;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.OrderMapper;
import ptithcm.backend.bookstore.repository.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final PaymentRepository paymentRepository;
    private final BookRepository bookRepository;
    private final VoucherRepository voucherRepository;
    private final AddressRepository addressRepository;
    OrderRepository orderRepository;
    UserRepository userRepository;

    UserService userService;
    OrderMapper orderMapper;
    
    public List<OrderResponse> getAll() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Transactional
    public OrderResponse create(CreateOrderRequest request){
        // 1. Lấy thông tin user hiện tại
        UserResponse userResponse = userService.getMyInfo();
        User customer = userRepository.findById(userResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Validate và lấy địa chỉ giao hàng
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        // Kiểm tra địa chỉ có thuộc về user không
        if (!address.getUser().getUserId().equals(customer.getUserId())) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        // 3. Validate items không rỗng
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new AppException(ErrorCode.ORDER_IS_EMPTY);
        }

        // 4. Lấy tất cả bookId từ request
        List<Integer> bookIds = request.getItems().stream()
                .map(OrderItemRequest::getBookId)
                .distinct()
                .collect(Collectors.toList());

        // 5. Query 1 lần lấy tất cả sách
        List<Book> books = bookRepository.findAllById(bookIds);

        // 6. Chuyển sang Map để tra cứu nhanh
        Map<Integer, Book> bookMap = books.stream()
                .collect(Collectors.toMap(Book::getBookId, book -> book));

        // 7. Kiểm tra tất cả sách có tồn tại không
        if (books.size() != bookIds.size()) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }

        // 8. Tạo Order
        Order order = Order.builder()
                .customer(customer)
                .status(OrderStatus.PENDING)
                .build();

        // 9. Tính tổng tiền trước khi áp dụng voucher
        BigDecimal subtotal = request.getItems().stream()
                .map(item -> {
                    Book book = bookMap.get(item.getBookId());
                    if (book == null) {
                        throw new AppException(ErrorCode.BOOK_NOT_FOUND);
                    }

                    // Kiểm tra tồn kho
                    if (book.getStockQuantity() < item.getQuantity()) {
                        throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
                    }
                    
                    return book.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 10. Xử lý voucher nếu có
        Voucher voucher = null;
        BigDecimal discountAmount = BigDecimal.ZERO;

        if (request.getVoucherCode() != null && !request.getVoucherCode().trim().isEmpty()) {
            voucher = voucherRepository.findByVoucherCode(request.getVoucherCode())
                    .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

            // Validate voucher
            if (!voucher.getIsActive()) {
                throw new AppException(ErrorCode.VALIDATION_ERROR);
            }

            LocalDateTime now = LocalDateTime.now();
            if (voucher.getStartDate().isAfter(now) || voucher.getEndDate().isBefore(now)) {
                throw new AppException(ErrorCode.VALIDATION_ERROR); // Voucher hết hạn hoặc chưa bắt đầu
            }

            if (voucher.getTotalLimit() != null && voucher.getUsedCount() >= voucher.getTotalLimit()) {
                throw new AppException(ErrorCode.VALIDATION_ERROR); // Voucher đã hết lượt sử dụng
            }

            if (subtotal.compareTo(voucher.getMinOrderValue()) < 0) {
                throw new AppException(ErrorCode.VALIDATION_ERROR); // Đơn hàng không đạt giá trị tối thiểu
            }

            // Tính discount
            if (voucher.getType() == VoucherType.FIXED) {
                discountAmount = voucher.getDiscountValue();
            } else if (voucher.getType() == VoucherType.PERCENTAGE) {
                discountAmount = subtotal.multiply(voucher.getDiscountValue())
                        .divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);
            }

            // Áp dụng giới hạn discount tối đa
            if (voucher.getMaxDiscountAmount() != null &&
                discountAmount.compareTo(voucher.getMaxDiscountAmount()) > 0) {
                discountAmount = voucher.getMaxDiscountAmount();
            }

            order.setVoucher(voucher);
        }

        // 11. Tính VAT (5% theo mặc định)
        BigDecimal vatRate = order.getVatRate() != null ? order.getVatRate() : new BigDecimal("0.05");
        BigDecimal vatAmount = subtotal.multiply(vatRate).setScale(2, RoundingMode.HALF_UP);

        // 12. Tính tổng tiền cuối cùng
        BigDecimal totalAmount = subtotal
                .add(vatAmount)
                .subtract(discountAmount)
                .setScale(2, RoundingMode.HALF_UP);

        // 13. Cập nhật thông tin order
        order.setVatAmount(vatAmount);
        order.setTotalAmount(totalAmount);

        // 14. Tạo BookOrder items
        List<BookOrder> bookOrders = request.getItems().stream()
                .map(item -> BookOrder.builder()
                        .book(bookMap.get(item.getBookId()))
                        .quantity(item.getQuantity())
                        .order(order)
                        .build())
                .collect(Collectors.toList());

        order.setBookOrders(bookOrders);

        // 15. Lưu order
        Order savedOrder = orderRepository.save(order);

        // 16. Cập nhật voucher nếu được sử dụng
        if (voucher != null) {
            voucher.setUsedCount(voucher.getUsedCount() + 1);
            voucherRepository.save(voucher);
        }

        // 17. Tạo Payment
        PaymentMethod paymentMethod = PaymentMethod.COD;
        if (request.getPaymentMethod() != null) {
            try {
                paymentMethod = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid payment method: {}, using COD as default", request.getPaymentMethod());
            }
        }

        Payment payment = Payment.builder()
                .order(savedOrder)
                .method(paymentMethod)
                .status(PaymentStatus.PENDING)
                .amount(totalAmount)
                .build();
        
        paymentRepository.save(payment);

        log.info("Order created successfully - OrderId: {}, CustomerId: {}, TotalAmount: {}",
                 savedOrder.getOrderId(), customer.getUserId(), totalAmount);

        return orderMapper.toResponse(savedOrder);
    }
}
