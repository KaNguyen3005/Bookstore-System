package ptithcm.backend.bookstore.service;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * Helper class để lưu trữ thông tin kích thước và trọng lượng của shipment
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShipmentDimensions {
    /**
     * Trọng lượng tổng (kg)
     */
    Double weight;

    /**
     * Chiều dài (cm) - lớn nhất giữa các sách
     */
    Integer length;

    /**
     * Chiều rộng (cm) - lớn nhất giữa các sách
     */
    Integer width;

    /**
     * Chiều cao (cm) - tổng chiều cao khi xếp chồng
     */
    Integer height;
}

