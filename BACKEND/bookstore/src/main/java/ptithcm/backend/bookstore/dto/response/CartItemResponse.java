package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import ptithcm.backend.bookstore.entity.Book;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {
    BookResponse book;
    Integer quantity;
    Long bookCartId;
}
