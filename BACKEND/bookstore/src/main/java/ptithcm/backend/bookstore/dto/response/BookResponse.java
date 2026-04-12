package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import ptithcm.backend.bookstore.entity.Author;
import ptithcm.backend.bookstore.entity.Publisher;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponse {
    String title;
    Set<Author> authors = new HashSet<>();
    Publisher publisher;
    String isbn;
    String language;
    String description;
    Integer pageCount;
    String coverType; // Loại bìa
    String coverImgUrl; // Chỉ trả về Url để load ra
    Integer stockQuantity;
    BigDecimal price; // Chọn kiểu này để giúp cho nhiều mệnh giá tiền
    Float avgRating; //0 - 5
    Integer salePercent; // Đơn vị %
    Set<String> categories = new HashSet<>();
    List<ReviewResponse> reviews;
}
