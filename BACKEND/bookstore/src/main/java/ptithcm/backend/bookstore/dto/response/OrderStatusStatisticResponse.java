package ptithcm.backend.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatusStatisticResponse {
    String status;      // pending, confirmed, shipping, completed, cancelled
    Long count;         // Số lượng đơn hàng với trạng thái này
}

