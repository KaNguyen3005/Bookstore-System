# Một số lưu ý khi đọc code ở package này
- sử dụng fetch = FetchType.LAZY để giúp tăng hiệu năng giúp bảng không phải lúc nào cũng cần join
- Sử dụng @Getter và @Setter thay cho @Data giúp tránh lỗi tìm ẩn do @Data phát sinh thêm hàm hash() và equal()