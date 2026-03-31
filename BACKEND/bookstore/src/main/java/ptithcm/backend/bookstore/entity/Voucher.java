package ptithcm.backend.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ptithcm.backend.bookstore.enums.VoucherType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="order")
//Do sử dụng lombok nên không sử dụng @Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String voucherId;

    @Column(nullable = false, unique = true)
    String voucherCode;

    String title;

    @Column(columnDefinition = "TEXT")
    String description;

    @Enumerated(EnumType.STRING)
    VoucherType type;

    // Sử dụng BigDecimal cho tiền tệ và tỷ lệ %
    @Column(precision = 19, scale = 2)
    BigDecimal discountValue;

    @Column(precision = 19, scale = 2)
    BigDecimal maxDiscountAmount;

    @Column(precision = 19, scale = 2)
    BigDecimal minOrderValue;

    Integer totalLimit;

    @Builder.Default
    Integer usedCount = 0;

    @Builder.Default
    Integer limitPerUser = 1;

    @ManyToMany(mappedBy = "vouchers")
    List<User> users;

    LocalDateTime startDate;
    LocalDateTime endDate;

    @Builder.Default
    Boolean isActive = true;

    // Audit fields
    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;

    @Builder.Default
    LocalDateTime deletedAt = null;
}