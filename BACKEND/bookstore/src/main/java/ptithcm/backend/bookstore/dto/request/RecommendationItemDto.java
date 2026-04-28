package ptithcm.backend.bookstore.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationItemDto {
    private Integer bookId;
    private Double score;
    private String reason;
}