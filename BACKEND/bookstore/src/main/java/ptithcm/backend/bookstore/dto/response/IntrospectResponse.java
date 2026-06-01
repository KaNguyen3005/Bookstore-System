package ptithcm.backend.bookstore.dto.response;


/*
 * IntrospectResponse:
 * Class DTO dùng để nhận kết quả trả về từ endpoint introspection
 * nhằm kiểm tra tính hợp lệ của token.
 */

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
// Lombok tự sinh: Getter, Setter, toString(), equals(), hashCode()

@NoArgsConstructor
// Lombok sinh constructor không tham số

@AllArgsConstructor
// Lombok sinh constructor đầy đủ tham số

@Builder
// Lombok hỗ trợ tạo object theo Builder Pattern

@FieldDefaults(level = AccessLevel.PRIVATE)
// Tự động đặt modifier 'private' cho tất cả field

public class IntrospectResponse {

    /*
     * valid biểu thị trạng thái của token:
     * true  → token hợp lệ (chưa hết hạn, chưa logout, đúng chữ ký)
     * false → token không hợp lệ
     *
     * Vì dùng @Data và kiểu primitive boolean,
     * Lombok sẽ tự sinh getter:
     *    public boolean isValid()
     */
    boolean valid;
}