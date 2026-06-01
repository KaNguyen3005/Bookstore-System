package ptithcm.backend.bookstore.enums;

public enum OrderStatus {
    PENDING_PAYMENT, // Waiting for online payment
    PENDING,        // Chờ xác nhận
    CONFIRMED,      // Đã xác nhận
    PROCESSING,     // Đang xử lý / đóng gói
    SHIPPING,       // Đang giao hàng
    DELIVERED,      // Đã giao hàng thành công
    COMPLETED,      // Hoàn thành (sau khi khách xác nhận nhận hàng)
    CANCELLED,      // Đã hủy
    REFUNDING,      // Đang hoàn tiền
    REFUNDED,        // Đã hoàn tiền
    PAYMENT_FAILED   // Thanh toán thất bại
}
