package ptithcm.backend.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name="user_id")
    Long userId;
    String username;
    String password;
    String name;
    String email;
    String phone;
    boolean status;
    String gender;
    boolean isChangeAccount;

    @ManyToOne
    @JoinColumn(name = "role_id")
    Role role;

    long point;
    LocalDateTime dob;

    @ManyToMany()
    @JoinTable(
            name = "user_voucher",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "voucher_id")
    )
    List<Voucher> vouchers;

    @OneToMany(mappedBy = "customer")
    List<Review> reviews;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;

    String authProvider;   // LOCAL, GOOGLE
    String providerId;     // Google sub
    Boolean emailVerified;
    @OneToMany(mappedBy = "customer")
    List<InteractEvent> interactEvents;

    @UpdateTimestamp
    LocalDateTime updatedAt;
    LocalDateTime deletedAt;
}
