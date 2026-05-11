import styles from "./OrderModal.module.css";

export default function OrderModal({
  order,
  onClose,
}: {
  order: any;
  onClose: () => void;
}) {
  if (!order) return null;

const totalQuantity =
  order.items?.reduce(
    (sum: number, item: any) => sum + (item.quantity || 0),
    0
  ) || 0;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={styles.title}>Chi tiết đơn hàng</h3>

        {/* ===== THÔNG TIN ĐƠN HÀNG ===== */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Thông tin đơn hàng
          </div>

          <div className={styles.row}>
            <span>Mã đơn hàng</span>
            <span>{order.orderId}</span>
          </div>

          <div className={styles.row}>
            <span>Khách hàng</span>
            <span>{order.customerName || "Chưa có"}</span>
          </div>

          <div className={styles.row}>
            <span>Nhân viên</span>
            <span>{order.staffName || "Chưa có"}</span>
          </div>

          <div className={styles.row}>
            <span>Trạng thái</span>
            <span>{order.status}</span>
          </div>

          <div className={styles.row}>
            <span>Thanh toán</span>
            <span>{order.paymentStatus}</span>
          </div>

          <div className={styles.row}>
            <span>Vận chuyển</span>
            <span>{order.shippingStatus}</span>
          </div>

          <div className={styles.row}>
            <span>Ngày đặt</span>
            <span>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* ===== THÔNG TIN GIAO HÀNG ===== */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Thông tin giao hàng
          </div>

          <div className={styles.row}>
            <span>Họ tên</span>
            <span>{order.customerName || "N/A"}</span>
          </div>

          <div className={styles.row}>
            <span>Số điện thoại</span>
            <span>{order.phone || "N/A"}</span>
          </div>

          <div className={styles.row}>
            <span>Địa chỉ</span>
            <span>{order.address || "N/A"}</span>
          </div>
        </div>

        {/* ===== SẢN PHẨM ===== */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Sản phẩm</div>

          <div className={styles.itemTotal}>
            Tổng số sản phẩm: {totalQuantity}
          </div>

          {order.items?.map((item: any) => (
            <div key={item.bookId} className={styles.item}>
              <img src="/images/book.png" alt={item.bookTitle} />

              <div className={styles.itemInfo}>
                <div className={styles.itemTitle}>
                  {item.bookTitle}
                </div>
                <div className={styles.itemQty}>
                  SL: {item.quantity}
                </div>
              </div>

              <div className={styles.itemPrice}>
                {(item.price || 0).toLocaleString()} đ
              </div>
            </div>
          ))}
        </div>

        {/* ===== TỔNG TIỀN ===== */}
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Tổng tiền hàng</span>
            <span>
              {(order.subtotal || 0).toLocaleString()} đ
            </span>
          </div>

          <div className={styles.summaryRow}>
            <span>VAT ({order.vatRate || 0}%)</span>
            <span>
              {(order.vatAmount || 0).toLocaleString()} đ
            </span>
          </div>

          <div className={styles.summaryRow}>
            <span>Giảm giá</span>
            <span>
              {order.voucher?.discountValue || 0}
            </span>
          </div>

          <div className={styles.summaryRow}>
            <strong>Thành tiền</strong>
            <strong>
              {(order.totalAmount || 0).toLocaleString()} đ
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}