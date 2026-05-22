package ptithcm.backend.bookstore.enums;

/**
 * PaymentMethod Enum
 * Phương thức thanh toán được hỗ trợ
 *
 * - COD: Thanh toán tiền mặt khi nhận hàng (Cash On Delivery)
 * - VNPAY: Thanh toán qua cổng VNPAY
 *
 * Cập nhật 22/05/2026: Chỉ giữ 2 loại COD và VNPAY
 */
public enum PaymentMethod {
    COD,    // Tiền mặt khi nhận hàng
    VNPAY   // VNPay gateway
}
