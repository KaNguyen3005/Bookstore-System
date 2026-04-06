package ptithcm.backend.bookstore.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

// Lombok: tự động sinh getter cho tất cả field
@Getter

// Lombok: tự động sinh setter cho tất cả field
@Setter

// Lombok: hỗ trợ Builder pattern để tạo object dễ đọc, dễ mở rộng
@Builder

// Lombok: sinh constructor không tham số (cần cho JPA)
@NoArgsConstructor

// Lombok: sinh constructor đầy đủ tham số
@AllArgsConstructor

// Lombok: thiết lập mức truy cập mặc định cho field là private
@FieldDefaults(level = AccessLevel.PRIVATE)

// Đánh dấu đây là một Entity, tương ứng với một bảng trong database
@Entity
public class InvalidatedToken {
    // Khóa chính của bảng
    // Lưu ID của token (thường là jti trong JWT)
    @Id
    String id;

    // Thời điểm token hết hạn
    // Dùng để dọn dẹp (cleanup) các token đã bị vô hiệu hóa
    Date expiryTime;
}