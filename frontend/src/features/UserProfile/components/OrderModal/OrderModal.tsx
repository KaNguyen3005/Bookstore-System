import styles from "./OrderModal.module.css";

const FALLBACK_BOOK_IMAGE = "/images/book-placeholder.svg";

export default function OrderModal({
  order,
  onClose,
}: {
  order: any;
  onClose: () => void;
}) {
  if (!order) return null;

const items = Array.isArray(order.items) ? order.items : [];
const totalQuantity =
  items.reduce(
    (sum: number, item: any) => sum + (item.quantity || 0),
    0
  ) || 0;
const customerName =
  order.customerName || order.shipping?.receiverName || "Chưa có";
const phone =
  order.phone || order.shipping?.receiverPhone || "N/A";
const address =
  order.address ||
  [
    order.shipping?.line1,
    order.shipping?.ward,
    order.shipping?.district,
    order.shipping?.city,
  ]
    .filter(Boolean)
    .join(", ") ||
  "N/A";

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
            <span>{customerName}</span>
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
            <span>{order.paymentStatus || order.payment?.status || "N/A"}</span>
          </div>

          <div className={styles.row}>
            <span>Vận chuyển</span>
            <span>{order.shippingStatus || "N/A"}</span>
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
            <span>{customerName}</span>
          </div>

          <div className={styles.row}>
            <span>Số điện thoại</span>
            <span>{phone}</span>
          </div>

          <div className={styles.row}>
            <span>Địa chỉ</span>
            <span>{address}</span>
          </div>
        </div>

        {/* ===== SẢN PHẨM ===== */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Sản phẩm</div>

          <div className={styles.itemTotal}>
            Tổng số sản phẩm: {totalQuantity}
          </div>

          {items.length === 0 && (
            <div className={styles.emptyItems}>
              Đang cập nhật thông tin sản phẩm
            </div>
          )}

          {items.map((item: any, index: number) => (
            <div key={item.itemId || `${item.bookId}-${index}`} className={styles.item}>
              <img
                src={item.coverImgUrl || FALLBACK_BOOK_IMAGE}
                alt={item.bookTitle}
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_BOOK_IMAGE;
                }}
              />

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
