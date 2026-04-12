package ptithcm.backend.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import ptithcm.backend.bookstore.configuration.GHNConfig;
import ptithcm.backend.bookstore.dto.request.GHNCreateOrderRequest;
import ptithcm.backend.bookstore.dto.request.GHNItemRequest;
import ptithcm.backend.bookstore.dto.response.GHNCreateOrderResponse;
import ptithcm.backend.bookstore.entity.Order;
import ptithcm.backend.bookstore.entity.Shipment;
import ptithcm.backend.bookstore.enums.ShippingStatus;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.repository.ShipmentRepository;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class GHNService {

    ShipmentRepository shipmentRepository;
    RestClient restClient;
    GHNConfig ghnConfig;
    String BASE_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data";

    String GHN_CREATE_ORDER_URL =
            "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create";

    public String createShippingOrder(Order order) {

        Shipment shipment = shipmentRepository.findByOrder_OrderId(order.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.SHIPMENT_NOT_FOUND));

        GHNCreateOrderRequest requestBody = GHNCreateOrderRequest.builder()
                .payment_type_id(1)
                .note("Tạo đơn giao hàng cho order #" + order.getOrderId())
                .required_note("KHONGCHOXEMHANG")
                .from_name("Shop Book")
                .from_phone("0900000000")
                .from_address("123 Đường ABC")
                .from_ward_name("Phường Linh Trung")
                .from_district_name("Thủ Đức")
                .from_province_name("Hồ Chí Minh")
                .to_name(shipment.getCustomerName())
                .to_phone(shipment.getCustomerPhone())
                .to_address(shipment.getDetailAddress())
                .to_ward_name(shipment.getWard())
                .to_district_name(shipment.getDistrict())
                .to_province_name(shipment.getProvince())

                .weight(shipment.getWeight() != null ? shipment.getWeight() : 1000)
                .length(shipment.getLength() != null ? shipment.getLength() : 20)
                .width(shipment.getWidth() != null ? shipment.getWidth() : 15)
                .height(shipment.getHeight() != null ? shipment.getHeight() : 10)
                .service_type_id(2)

                .items(order.getBookOrders().stream()
                        .map(item -> GHNItemRequest.builder()
                                .name(item.getBook().getTitle())
                                .quantity(item.getQuantity())
                                .price(item.getBook().getPrice().intValue())
                                .build())
                        .toList())
                .build();

        GHNCreateOrderResponse response = restClient.post()
                .uri(GHN_CREATE_ORDER_URL)
                .header("Token", ghnConfig.getToken())
                .header("ShopId", ghnConfig.getShopId())
                .body(requestBody)
                .retrieve()
                .body(GHNCreateOrderResponse.class);


        if (response == null || response.getData() == null || response.getData().getOrder_code() == null) {
            log.error("GHN create order failed. response={}", response);
            throw new AppException(ErrorCode.GHN_CREATE_ORDER_FAILED);
        }

        String ghnOrderCode = response.getData().getOrder_code();
        log.info("GHN order created successfully. orderId={}, ghnOrderCode={}", order.getOrderId(), ghnOrderCode);
        shipment.setTrackingNumber(ghnOrderCode);
        shipmentRepository.save(shipment);
        return ghnOrderCode;
    }

    public String getOrderStatus(String orderCode) {
        Map<String, Object> request = Map.of(
                "order_code", orderCode
        );

        Map<String, Object> response = restClient.post()
                .uri("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail")
                .header("Token", ghnConfig.getToken())
                .header("ShopId", ghnConfig.getShopId())
                .body(request)
                .retrieve()
                .body(Map.class);

        Map<String, Object> data = (Map<String, Object>) response.get("data");

        return (String) data.get("status");
    }

    public ShippingStatus mapStatus(String ghnStatus) {
        return switch (ghnStatus) {
            case "ready_to_pick" -> ShippingStatus.READY_TO_SHIP;
            case "picking", "money_collect_picking" -> ShippingStatus.PICKING_UP;
            case "transporting" -> ShippingStatus.IN_TRANSIT;
            case "delivered" -> ShippingStatus.DELIVERED;
            case "delivery_fail", "returned" -> ShippingStatus.DELIVERY_FAILED;
            default -> null;
        };
    }

    public void updateShipment(Shipment shipment, String ghnStatus) {

        ShippingStatus newStatus = mapStatus(ghnStatus);

        if (newStatus == null) return;

        if (shipment.getStatus() == newStatus) return; // tránh update lại

        shipment.setStatus(newStatus);
    }

    public List<Map<String, Object>> getProvinces() {
        Map<String, Object> response = restClient.get()
                .uri(BASE_URL + "/province")
                .header("Token", ghnConfig.getToken())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        return (List<Map<String, Object>>) response.get("data");
    }

    public List<Map<String, Object>> getDistricts(Integer provinceId) {
        Map<String, Object> response = restClient.post()
                .uri(BASE_URL + "/district")
                .header("Token", ghnConfig.getToken())
                .body(Map.of("province_id", provinceId))
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        return (List<Map<String, Object>>) response.get("data");
    }

    public List<Map<String, Object>> getWards(Integer districtId) {
        Map<String, Object> response = restClient.post()
                .uri(BASE_URL + "/ward")
                .header("Token", ghnConfig.getToken())
                .body(Map.of("district_id", districtId))
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        return (List<Map<String, Object>>) response.get("data");
    }
}