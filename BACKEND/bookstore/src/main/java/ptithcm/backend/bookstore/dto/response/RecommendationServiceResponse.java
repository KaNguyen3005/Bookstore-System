package ptithcm.backend.bookstore.dto.response;


import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;
import ptithcm.backend.bookstore.dto.request.RecommendationItemDto;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecommendationServiceResponse {
    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("book_id")
    private Integer bookId;

    @JsonAlias({"recommendations", "related_books"})
    private List<RecommendationItemDto> recommendations;
}
