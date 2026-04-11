package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
        Long reviewId;
        Integer bookId;
        String username;
        Integer rating;
        String comment;
        LocalDateTime createdAt;
}
