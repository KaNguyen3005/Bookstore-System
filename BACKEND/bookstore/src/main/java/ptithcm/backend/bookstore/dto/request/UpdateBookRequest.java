package ptithcm.backend.bookstore.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateBookRequest {
    String title;
    Set<Integer> authorIds;
    Integer publisherId;
    String isbn;
    String language;
    String description;
    Integer pageCount;
    String coverType;
    MultipartFile coverImg;
    Integer stockQuantity;
    BigDecimal price;
    Float avgRating;
    Integer salePercent;
    Set<Integer> categories;
}
