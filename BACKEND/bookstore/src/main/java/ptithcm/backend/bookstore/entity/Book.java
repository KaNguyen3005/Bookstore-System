package ptithcm.backend.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="books")
//Do sử dụng lombok nên không sử dụng @Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="book_id")
    @EqualsAndHashCode.Include
    Integer bookId;

    @Column(nullable = false)
    String title;

    @ManyToMany
    @JoinTable(
            name="book_author",
            joinColumns=@JoinColumn(name="book_id"),
            inverseJoinColumns = @JoinColumn(name="author_id")
    )
    Set<Author> authors = new HashSet<>();


    @ManyToOne
    @JoinColumn(name = "publisher_id") // Rõ ràng khóa ngoại
    Publisher publisher;

    @Column(unique = true)
    String isbn;
    String language;

    @Column(columnDefinition = "TEXT")
    String description;
    int pageCount;
    String coverType;
    String coverImageUrl = "https://res-console.cloudinary.com/duqhdj1ff/thumbnails/v1/image/upload/v1772180359/OWM0ZjVjODMtMGNhMi00ZGU1LThjNzUtYzI2ZDE3NzQ1NDQz/drilldown";
    int stockQuantity = 0;
    BigDecimal price; // Chọn kiểu nàm,y để giúp cho nhiều mệnh giá tiền
    float avgRating; //0 - 5
    int salePercent = 0; // Đơn vị %

    @ManyToMany
    @JoinTable(
            name = "book_category",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    Set<Category> categories = new HashSet<>();
    @Builder.Default
    Boolean isActive = true;
    Integer width;
    Integer length;
    Integer height;
    Double weight;
    String publicIdCoverImage;
    @OneToMany(mappedBy = "book")
    List<BookCart> bookCarts;

    @OneToMany(mappedBy = "book")
    List<BookOrder> bookOrders;

    @OneToMany(mappedBy = "book")
    List<InteractEvent> interactEvents;

    @OneToMany(mappedBy = "book")
    List<BookImg> bookImgs;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;
    LocalDateTime deletedAt;
}
