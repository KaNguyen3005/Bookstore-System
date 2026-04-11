package ptithcm.backend.bookstore.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GHNItemRequest {
    String name;
    Integer quantity;
    Integer price;
}