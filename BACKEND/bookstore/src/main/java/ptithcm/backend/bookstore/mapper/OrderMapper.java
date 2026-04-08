package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import ptithcm.backend.bookstore.dto.request.CreateCategoryRequest;
import ptithcm.backend.bookstore.dto.request.CreateOrderRequest;
import ptithcm.backend.bookstore.dto.response.CategoryResponse;
import ptithcm.backend.bookstore.dto.response.OrderItemResponse;
import ptithcm.backend.bookstore.dto.response.OrderResponse;
import ptithcm.backend.bookstore.dto.response.VoucherResponse;
import ptithcm.backend.bookstore.entity.BookOrder;
import ptithcm.backend.bookstore.entity.Category;
import ptithcm.backend.bookstore.entity.Order;
import ptithcm.backend.bookstore.entity.Voucher;

import java.util.List;
import java.util.stream.Collectors;

// componentModel = "spring" giúp @Autowired mapper này ở Service
@Mapper(componentModel = "spring")
public interface OrderMapper {
    Order toEntity(CreateOrderRequest request);
    @Mapping(source = "bookOrders", target = "items", qualifiedByName = "mapBookOrdersToItems")
    @Mapping(source = "staff.name", target = "staffName")
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "voucher", target = "voucher", qualifiedByName = "mapVoucher")
    OrderResponse toResponse(Order order);

    @Named("mapBookOrdersToItems")
    default List<OrderItemResponse> mapBookOrdersToItems(List<BookOrder> bookOrders) {
        if (bookOrders == null) {
            return null;
        }
        return bookOrders.stream()
                .map(bo -> OrderItemResponse.builder()
                        .bookId(bo.getBook().getBookId())
                        .bookTitle(bo.getBook().getTitle())
                        .quantity(bo.getQuantity())
                        .price(bo.getBook().getPrice())
                        .build())
                .collect(Collectors.toList());
    }

    @Named("mapVoucher")
    default VoucherResponse mapVoucher(Voucher voucher) {
        if (voucher == null) {
            return null;
        }
        return VoucherResponse.builder()
                .voucherId(voucher.getVoucherId())
                .voucherCode(voucher.getVoucherCode())
                .title(voucher.getTitle())
                .description(voucher.getDescription())
                .type(voucher.getType())
                .discountValue(voucher.getDiscountValue())
                .maxDiscountAmount(voucher.getMaxDiscountAmount())
                .minOrderValue(voucher.getMinOrderValue())
                .totalLimit(voucher.getTotalLimit())
                .usedCount(voucher.getUsedCount())
                .limitPerUser(voucher.getLimitPerUser())
                .startDate(voucher.getStartDate())
                .endDate(voucher.getEndDate())
                .isActive(voucher.getIsActive())
                .build();
    }
}
