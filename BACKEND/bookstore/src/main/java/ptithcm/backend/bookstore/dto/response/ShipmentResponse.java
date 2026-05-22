package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import ptithcm.backend.bookstore.enums.ShippingStatus;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentResponse {
    Long shipmentId;
    String trackingNumber;
    ShippingStatus status;
    AddressResponse address;
    Integer weight;
    Integer length;
    Integer width;
    Integer height;
    LocalDateTime estimatedDeliveryDate;
    LocalDateTime actualDeliveryDate;
}

