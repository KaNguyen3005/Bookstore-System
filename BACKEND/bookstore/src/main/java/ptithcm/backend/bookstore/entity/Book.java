package ptithcm.backend.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="book")
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
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="book_id")
    @EqualsAndHashCode.Include
    String bookId;

    @Column(nullable = false)
    String title;

    @ManyToMany
    @JoinTable(
            name="book_author",
            joinColumns=@JoinColumn(name="book_id"),
            inverseJoinColumns = @JoinColumn(name="author_id")
    )
    Set<Author> authors = new HashSet<>();

    @ManyToOne(fetch = FetchType.EAGER) // Tối ưu hiệu năng
    @JoinColumn(name = "supplier_id")  // Rõ ràng khóa ngoại
    Supplier supplier;

    @ManyToOne(fetch = FetchType.EAGER) // Tối ưu hiệu năng
    @JoinColumn(name = "publisher_id") // Rõ ràng khóa ngoại
    Publisher publisher;

    @Column(unique = true)
    String isbn;
    String language;

    @Column(columnDefinition = "TEXT")
    String description;
    int pageCount;
    String coverType;
    String coverImage;
    int stockQuantity = 0;

    BigDecimal price; // Chọn kiểu nàm,y để giúp cho nhiều mệnh giá tiền
    float avgRating; //0 - 5
    int salePercent = 0; // Đơn vị %
    @ManyToMany
    Set<Categories> categories = new HashSet<>();
}
