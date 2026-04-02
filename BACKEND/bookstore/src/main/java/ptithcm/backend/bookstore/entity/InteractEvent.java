package ptithcm.backend.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigInteger;
import java.time.LocalDateTime;

@Entity
@Table(name="interact_events")
//Do sử dụng lombok nên không sử dụng @Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InteractEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name =  "interact_event_id")
    Long interactEventId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User customer;

    @ManyToOne
    @JoinColumn(name = "book_id")
    Book book;

    String eventType;

    LocalDateTime eventTime;

    int value;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;
    LocalDateTime deletedAt;
}
