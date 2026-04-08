package ptithcm.backend.bookstore.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ptithcm.backend.bookstore.enums.OrderStatus;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="orders")
//Do sử dụng lombok nên không sử dụng @Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    Long orderId;

    // VAT Rate (Ví dụ: 0.05)
    @Builder.Default
    @Column(precision = 5, scale = 2, nullable = false)
    BigDecimal vatRate = new BigDecimal("0.05");

    // Tiền thuế
    @Column(precision = 12, scale = 2)
    BigDecimal vatAmount;

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    Voucher voucher;

    BigDecimal totalAmount;

    @OneToMany(mappedBy = "order")
    List<BookOrder> bookOrders;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    User staff;


    @ManyToOne
    @JoinColumn(name = "customer_id")
    User customer;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;

    OrderStatus status;



    @UpdateTimestamp
    LocalDateTime updatedAt;

    @Builder.Default
    LocalDateTime deletedAt = null;
}
