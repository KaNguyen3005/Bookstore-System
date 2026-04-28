package ptithcm.backend.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.annotation.Nullable;
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
    Boolean status;
    String gender;
    Boolean isChangeAccount;

    @ManyToOne
    @JoinColumn(name = "role_id")
    Role role;

    @Column(nullable = false)
    String tier = "BRONZE"; // Bronze, Silver, Gold

    @Column(nullable = false)
    Long point = 0L;

    LocalDateTime dob;

    @ManyToMany()
    @JoinTable(
            name = "user_voucher",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "voucher_id")
    )
    List<Voucher> vouchers;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;
    String avatarUrl;
    String authProvider;   // LOCAL, GOOGLE
    String providerId;     // Google sub
    Boolean emailVerified;
    @OneToMany(mappedBy = "customer")
    List<InteractEvent> interactEvents;
    String publicIdAvatar;
    @UpdateTimestamp
    LocalDateTime updatedAt;
    LocalDateTime deletedAt;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = true; // Mặc định là active
        }
        if(point == null) {
            point = 0L; // Mặc định điểm là 0
        }
        if(tier == null) {
            tier = "BRONZE"; // Mặc định là hạng Bronze
        }
        if (isChangeAccount == null) {
            isChangeAccount = false; // Mặc định chưa đổi tài khoản
        }
    }
}
