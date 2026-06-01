package ptithcm.backend.bookstore.enums;

public enum ShippingStatus {
    PICKING_UP,     // Đơn hàng đang được lấy hàng
    READY_TO_SHIP,  // Đơn hàng đã sẵn sàng để giao
    DELIVERED,      // Đơn hàng đã được giao thành công
    RETURNING,       // Đơn hàng đã được trả lại
    CANCELLED,       // Đơn hàng đã bị hủy
    PENDING,        // Đơn hàng đang chờ xử lý hoặc chưa được giao
    IN_TRANSIT,     // Đơn hàng đang trong quá trình vận chuyển
    OUT_FOR_DELIVERY, // Đơn hàng đang được giao đến khách hàng
    DELIVERY_FAILED  // Đơn hàng giao thất bại
}
