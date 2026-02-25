package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;
import ptithcm.backend.bookstore.entity.Author;
import ptithcm.backend.bookstore.entity.Publisher;
import ptithcm.backend.bookstore.entity.Supplier;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponse {
    String title;
    Set<Author> authors = new HashSet<>();
    Supplier supplier;
    Publisher publisher;
    String isbn;
    String language;
    String description;
    int pageCount;
    String coverType; // Loại bìa
    String coverImgUrl; // Chỉ trả về Url để load ra
    int stockQuantity = 0;
    BigDecimal price; // Chọn kiểu này để giúp cho nhiều mệnh giá tiền
    float avgRating; //0 - 5
    int salePercent = 0; // Đơn vị %
    Set<String> categoryIds = new HashSet<>();
}
