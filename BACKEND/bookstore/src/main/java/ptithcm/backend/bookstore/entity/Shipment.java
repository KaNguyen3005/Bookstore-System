package ptithcm.backend.bookstore.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigInteger;
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
    Long shipment_id;

    @OneToOne
    @JoinColumn(name = "order_id")
    Order order;

    String trackingNumber;
    String carrierName;
    int status;
    LocalDateTime estimatedDeliveryDate;
    LocalDateTime actualDeliveryDate;

    String province;
    String district;
    String ward;
    String detailAddress;
    String customerName;
    String customerPhone;

}
