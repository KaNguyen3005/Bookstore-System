package ptithcm.backend.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ptithcm.backend.bookstore.enums.PaymentMethod;
import ptithcm.backend.bookstore.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    Long paymentId;

    @OneToOne
    @JoinColumn(name = "order_id")
    Order order;

    @Enumerated(EnumType.STRING)
    PaymentMethod method; // VNPAY, MOMO, ZALOPAY, COD

    @Enumerated(EnumType.STRING)
    PaymentStatus status; // PENDING, SUCCESS, FAILED, CANCELLED

    BigDecimal amount;
    String transactionId;  // Mã giao dịch từ VNPay trả về
    LocalDateTime paidAt;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;
}
