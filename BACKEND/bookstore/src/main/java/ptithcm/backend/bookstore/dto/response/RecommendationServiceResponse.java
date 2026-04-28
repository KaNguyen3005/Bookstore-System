package ptithcm.backend.bookstore.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;
import ptithcm.backend.bookstore.dto.request.RecommendationItemDto;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationServiceResponse {
    private Long userId;
    private Integer bookId;
    private List<RecommendationItemDto> recommendations;
}