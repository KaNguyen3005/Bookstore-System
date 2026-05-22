package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import ptithcm.backend.bookstore.dto.request.CreateOrderRequest;
import ptithcm.backend.bookstore.dto.response.*;
import ptithcm.backend.bookstore.entity.*;
import ptithcm.backend.bookstore.enums.VoucherType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

// componentModel = "spring" giúp @Autowired mapper này ở Service
@Mapper(componentModel = "spring")
public interface OrderMapper {
    BigDecimal DEFAULT_VAT_RATE = new BigDecimal("0.05");

    Order toEntity(CreateOrderRequest request);

    @Mapping(source = "bookOrders", target = "items", qualifiedByName = "mapBookOrdersToItems")
    @Mapping(source = "bookOrders", target = "subtotal", qualifiedByName = "calculateSubtotal")
    @Mapping(target = "discountAmount", expression = "java(calculateDiscountAmount(order))")
    @Mapping(target = "amountAfterDiscount", expression = "java(calculateAmountAfterDiscount(order))")
    @Mapping(target = "tierRate", expression = "java(resolveTierRate(order))")
    @Mapping(target = "vatRate", expression = "java(resolveVatRate(order))")
    @Mapping(target = "vatAmount", expression = "java(resolveVatAmount(order))")
    @Mapping(target = "totalAmount", expression = "java(calculateTotalAmount(order))")
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
        if (order.getBookOrders() == null) {
            return order.getVatAmount() != null ? roundVatAmount(order.getVatAmount()) : null;
        }

        BigDecimal vatRate = resolveVatRate(order);
        if (vatRate == null) {
            return null;
        }

        BigDecimal taxableAmount = calculateAmountAfterDiscount(order);
        if (taxableAmount == null) {
            return null;
        }

        return roundVatAmount(taxableAmount.multiply(vatRate));
    }

    default BigDecimal resolveVatRate(Order order) {
        if (order == null || order.getVatRate() == null || order.getVatRate().compareTo(BigDecimal.ZERO) == 0) {
            return DEFAULT_VAT_RATE;
        }
        return order.getVatRate();
    }

    default BigDecimal resolveTierRate(Order order) {
        if (order == null || order.getTierRate() == null) {
            return BigDecimal.ZERO;
        }
        return order.getTierRate();
    }

    default BigDecimal calculateDiscountAmount(Order order) {
        if (order == null || order.getBookOrders() == null) {
            return null;
        }

        BigDecimal subtotal = calculateSubtotal(order.getBookOrders());
        BigDecimal amountAfterDiscount = calculateAmountAfterDiscount(order);
        if (subtotal == null || amountAfterDiscount == null) {
            return null;
        }

        return subtotal.subtract(amountAfterDiscount)
                .max(BigDecimal.ZERO)
                .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Tính totalAmount = subtotal + vatAmount
     */
    default BigDecimal calculateTotalAmount(Order order) {
        if (order == null || order.getBookOrders() == null) {
            return null;
        }

        BigDecimal amountAfterDiscount = calculateAmountAfterDiscount(order);
        if (amountAfterDiscount == null) {
            return null;
        }

        BigDecimal vatAmount = resolveVatAmount(order);
        if (vatAmount == null) {
            vatAmount = BigDecimal.ZERO;
        }

        return amountAfterDiscount.add(vatAmount).setScale(2, RoundingMode.HALF_UP);
    }

    default BigDecimal calculateAmountAfterDiscount(Order order) {
        if (order == null || order.getBookOrders() == null) {
            return null;
        }

        BigDecimal subtotal = calculateSubtotal(order.getBookOrders());
        if (subtotal == null) {
            return null;
        }

        Voucher voucher = order.getVoucher();
        BigDecimal fixedDiscountAmount = BigDecimal.ZERO;
        BigDecimal voucherPercentRate = BigDecimal.ZERO;

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
        BigDecimal percentDiscountAmount = calculatePercentDiscountAmount(
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

    default BigDecimal calculatePercentDiscountAmount(
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

    default BigDecimal roundVatAmount(BigDecimal vatAmount) {
        if (vatAmount == null) {
            return null;
        }
        return vatAmount.setScale(0, RoundingMode.CEILING);
    }


    @Named("mapBookOrdersToItems")
    default List<OrderItemResponse> mapBookOrdersToItems(List<BookOrder> bookOrders) {
        if (bookOrders == null) {
            return null;
        }
        return bookOrders.stream()
                .map(bo -> OrderItemResponse.builder()
                        .orderItemId(bo.getBookOrderId())
                        .bookId(bo.getBook().getBookId())
                        .bookTitle(bo.getBook().getTitle())
                        .quantity(bo.getQuantity())
                        .price(bo.getBook().getPrice())
                        .rate(bo.getRate())
                        .content(bo.getContent())
                        .coverImageUrl(bo.getBook().getCoverImageUrl())
                        .unit(bo.getUnit())
                        .bookImgs(mapBookImages(bo.getBook().getBookImgs()))
                        .hasRating(bo.getRate() != null && bo.getRate() > 0)
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


