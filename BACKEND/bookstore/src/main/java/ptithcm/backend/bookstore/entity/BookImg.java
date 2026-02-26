package ptithcm.backend.bookstore.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name="book_img")
//Do sử dụng lombok nên không sử dụng @Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookImg {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String bookImgId;

    @ManyToOne(fetch = FetchType.LAZY)
    Book book;

    String imgUrl;
}
