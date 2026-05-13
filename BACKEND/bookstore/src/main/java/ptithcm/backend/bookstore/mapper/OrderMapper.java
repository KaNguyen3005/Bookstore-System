package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import ptithcm.backend.bookstore.dto.request.CreateOrderRequest;
import ptithcm.backend.bookstore.dto.response.*;
import ptithcm.backend.bookstore.entity.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

// componentModel = "spring" giúp @Autowired mapper này ở Service
@Mapper(componentModel = "spring")
public interface OrderMapper {
    Order toEntity(CreateOrderRequest request);

    @Mapping(source = "bookOrders", target = "items", qualifiedByName = "mapBookOrdersToItems")
    @Mapping(source = "bookOrders", target = "subtotal", qualifiedByName = "calculateSubtotal")
    @Mapping(target = "vatAmount", expression = "java(resolveVatAmount(order))")
    @Mapping(source = "staff.name", target = "staffName")
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "voucher", target = "voucher", qualifiedByName = "mapVoucher")
    @Mapping(source = "shipment", target = "shipment", qualifiedByName = "mapShipment")
    @Mapping(target = "paymentStatus", expression = "java(order.getPayment() != null ? order.getPayment().getStatus() : null)")
    OrderResponse toResponse(Order order);

    @Named("calculateSubtotal")
    default BigDecimal calculateSubtotal(List<BookOrder> bookOrders) {
        if (bookOrders == null) {
            return null;
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (BookOrder bo : bookOrders) {
            if (bo == null || bo.getBook() == null || bo.getBook().getPrice() == null || bo.getQuantity() == null) {
                continue;
            }
            subtotal = subtotal.add(bo.getBook().getPrice().multiply(BigDecimal.valueOf(bo.getQuantity())));
        }
        return subtotal.setScale(2, RoundingMode.HALF_UP);
    }

    default BigDecimal resolveVatAmount(Order order) {
        if (order == null) {
            return null;
        }
        if (order.getVatAmount() != null) {
            return order.getVatAmount();
        }
        if (order.getVatRate() == null || order.getTotalAmount() == null) {
            return null;
        }

        // Fallback: giả sử totalAmount đã bao gồm VAT (như luồng create())
        BigDecimal divisor = BigDecimal.ONE.add(order.getVatRate());
        BigDecimal amountBeforeVat = order.getTotalAmount().divide(divisor, 2, RoundingMode.HALF_UP);
        return order.getTotalAmount().subtract(amountBeforeVat).setScale(2, RoundingMode.HALF_UP);
    }

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
                        .rate(bo.getRate())
                        .content(bo.getContent())
                        .unit(bo.getUnit())
                        .bookImgs(mapBookImages(bo.getBook().getBookImgs()))
                        .build())
                .collect(Collectors.toList());
    }

    @Named("mapBookImages")
    default List<BookImgResponse> mapBookImages(List<BookImg> bookImgs) {
        if (bookImgs == null || bookImgs.isEmpty()) {
            return List.of();
        }
        return bookImgs.stream()
                .map(img -> BookImgResponse.builder()
                        .imgUrl(img.getImgUrl())
                        .publicId(img.getPublicId())
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

    @Named("mapShipment")
    default ShipmentResponse mapShipment(Shipment shipment) {
        if (shipment == null) {
            return null;
        }
        return ShipmentResponse.builder()
                .shipmentId(shipment.getShipmentId())
                .trackingNumber(shipment.getTrackingNumber())
                .status(shipment.getStatus())
                .weight(shipment.getWeight())
                .length(shipment.getLength())
                .width(shipment.getWidth())
                .height(shipment.getHeight())
                .estimatedDeliveryDate(shipment.getEstimatedDeliveryDate())
                .actualDeliveryDate(shipment.getActualDeliveryDate())
                .address(shipment.getAddress() != null ?
                        AddressResponse.builder()
                                .addressId(shipment.getAddress().getAddressId())
                                .province(shipment.getAddress().getProvince())
                                .district(shipment.getAddress().getDistrict())
                                .ward(shipment.getAddress().getWard())
                                .detailAddress(shipment.getAddress().getDetailAddress())
                                .customerName(shipment.getAddress().getCustomerName())
                                .customerPhone(shipment.getAddress().getCustomerPhone())
                                .isDefault(shipment.getAddress().getIsDefault())
                                .build()
                        : null)
                .build();
    }
}


