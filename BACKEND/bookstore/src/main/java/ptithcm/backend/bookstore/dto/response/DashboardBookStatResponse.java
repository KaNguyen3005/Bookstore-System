package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardBookStatResponse {
    Integer bookId;
    String title;
    String coverImageUrl;
    Float avgRating;
    Integer stockQuantity;
    Long totalQuantitySold;
    Long reviewCount;
}
