import styles from "./OrderModal.module.css";

const formatPrice = (value: number) => {
  return Number(value || 0).toLocaleString("vi-VN");
};

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    CREATED: "Chờ xác nhận",
    PENDING: "Chờ xác nhận",
    PENDING_PAYMENT: "Chờ thanh toán",
    CONFIRMED: "Chờ lấy hàng",
    PROCESSING: "Chờ lấy hàng",
    PICKING_UP: "Chờ lấy hàng",
    SHIPPING: "Đang giao hàng",
    DELIVERED: "Đã giao",
    COMPLETED: "Đã giao",
    RETURNED: "Trả hàng",
    REFUNDED: "Đã hoàn tiền",
    FAILED: "Thanh toán thất bại",
    CANCELLED: "Đã hủy",
  };

  return map[status] || status;
};

export default function OrderModal({
  order,
  onClose,
}: {
  order: any;
  onClose: () => void;
}) {
  if (!order) return null;

  const shipment = order.shipment;
  const address = shipment?.address;

  return (
    <div
      className={styles.modal}
      onClick={onClose}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={styles.title}>
          Chi tiết đơn hàng
        </h3>

        {/* INFO */}
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
            <span>{order.customerName}</span>
          </div>

          <div className={styles.row}>
            <span>Trạng thái</span>
            <span>
              {getStatusLabel(order.status)}
            </span>
          </div>

          <div className={styles.row}>
            <span>Thanh toán</span>
            <span>{order.paymentStatus}</span>
          </div>

          <div className={styles.row}>
            <span>Ngày đặt</span>
            <span>
              {new Date(
                order.createdAt
              ).toLocaleString()}
            </span>
          </div>
        </div>

        {/* SHIPPING */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Thông tin giao hàng
          </div>

          <div className={styles.row}>
            <span>Người nhận</span>
            <span>
              {address?.customerName}
            </span>
          </div>

          <div className={styles.row}>
            <span>Số điện thoại</span>
            <span>
              {address?.customerPhone}
            </span>
          </div>

          <div className={styles.row}>
            <span>Địa chỉ</span>
            <span>
              {[
                address?.detailAddress,
                address?.ward,
                address?.district,
                address?.province,
              ]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        </div>

        {/* ITEMS */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Sản phẩm
          </div>

          {(order.items ?? []).map((item: any) => {
            const imageUrl = item.coverImageUrl;
            const title = item.bookTitle || item.title || "Sản phẩm";

            return (
            <div
              key={item.itemId || item.bookId}
              className={styles.item}
            >
              {imageUrl && <img src={imageUrl} alt={title} />}

              <div className={styles.itemInfo}>
                <div className={styles.itemTitle}>
                  {title}
                </div>

                <div className={styles.itemQty}>
                  SL: {item.quantity}
                </div>
              </div>

              <div className={styles.itemPrice}>
                {formatPrice(item.price)} đ
              </div>
            </div>
            );
          })}
        </div>

        {/* SUMMARY */}
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Tạm tính</span>

            <span>
              {formatPrice(order.subtotal)} đ
            </span>
          </div>

          <div className={styles.summaryRow}>
            <span>
              VAT ({order.vatRate}%)
            </span>

            <span>
              {formatPrice(order.vatAmount)} đ
            </span>
          </div>

          <div className={styles.summaryRow}>
            <span>Giảm giá</span>

            <span>
              {formatPrice(
                order.voucher?.discountValue
              )}{" "}
              đ
            </span>
          </div>
          <div className={styles.summaryRow}>
            <strong>Thành tiền</strong>
            <strong>
              {formatPrice(order.totalAmount)} đ
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
