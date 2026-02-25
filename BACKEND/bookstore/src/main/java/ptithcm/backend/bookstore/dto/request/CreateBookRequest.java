package ptithcm.backend.bookstore.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;


import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookRequest {
    String title;
    Set<String> authorIds = new HashSet<>();
    String supplierId;
    String publisherId;
    String isbn;
    String language;
    String description;
    int pageCount;
    String coverType; // Loại bìa
    MultipartFile coverImg;
    int stockQuantity = 0;
    BigDecimal price; // Chọn kiểu này để giúp cho nhiều mệnh giá tiền
    float avgRating; //0 - 5
    int salePercent = 0; // Đơn vị %
    Set<String> categoryIds = new HashSet<>();
}
