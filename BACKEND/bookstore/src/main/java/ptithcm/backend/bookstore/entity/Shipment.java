package ptithcm.backend.bookstore.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import ptithcm.backend.bookstore.enums.ShippingStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "shipments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Shipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipment_id")
    Long shipmentId;

    @OneToOne
    @JoinColumn(name = "order_id")
    Order order;

    String trackingNumber;
    String carrierName;

    @Enumerated(EnumType.STRING)
    ShippingStatus status;
    LocalDateTime estimatedDeliveryDate;
    LocalDateTime actualDeliveryDate;


    @ManyToOne
    @JoinColumn(name = "address_id")
    Address address;

    Integer weight;
    Integer length;
    Integer width;
    Integer height;
}
