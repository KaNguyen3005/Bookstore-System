import styles from "./OrderModal.module.css";
import { formatVietnamDateTime } from "../../../../utils/dateTime";

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

const getPaymentStatusLabel = (status: string) => {
  if (status === "SUCCESS") return "Đã thanh toán";

  const map: Record<string, string> = {
    PENDING: "Chờ thanh toán",
    PAID: "Đã thanh toán",
    UNPAID: "Chưa thanh toán",
    FAILED: "Thanh toán thất bại",
    REFUNDED: "Đã hoàn tiền",
    CANCELLED: "Đã hủy",
  };

  return map[status] || status;
};

const getPaymentMethodLabel = (method: string) => {
  const map: Record<string, string> = {
    COD: "Thanh toán khi nhận hàng",
    VNPAY: "VNPay",
  };

  return map[method] || method || "Chưa có";
};

const getOrderItemCoverImage = (item: any) =>
  item?.coverImage ||
  item?.coverImageUrl ||
  item?.coverImgUrl ||
  item?.book?.coverImage ||
  item?.book?.coverImageUrl ||
  item?.book?.coverImgUrl ||
  item?.image;

const getVoucherDiscountLabel = (order: any) => {
  const discountAmount = Number(order?.discountAmount || 0);

  if (discountAmount > 0) {
    return `-${formatPrice(discountAmount)} đ`;
  }

  const voucher = order?.voucher;

  if (!voucher) {
    return "0 đ";
  }

  if (voucher.type === "PERCENTAGE") {
    const maxDiscount =
      Number(voucher.maxDiscountAmount || 0) > 0
        ? `, tối đa ${formatPrice(voucher.maxDiscountAmount)} đ`
        : "";

    return `-${voucher.discountValue}%${maxDiscount}`;
  }

  return `-${formatPrice(voucher.discountValue)} đ`;
};

const formatVatRate = (value: unknown) => {
  const rate = Number(value || 0);
  const percent = rate > 1 ? rate : rate * 100;

  return Number.isInteger(percent) ? String(percent) : percent.toFixed(2);
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
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Chi tiết đơn hàng</h3>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Thông tin đơn hàng</div>

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
            <span>{getStatusLabel(order.status)}</span>
          </div>

          <div className={styles.row}>
            <span>Thanh toán</span>
            <span>{getPaymentStatusLabel(order.paymentStatus)}</span>
          </div>

          <div className={styles.row}>
            <span>Phương thức thanh toán</span>
            <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
          </div>

          <div className={styles.row}>
            <span>Ngày đặt</span>
            <span>
              {formatVietnamDateTime(order.createdAt)}
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Thông tin giao hàng</div>

          <div className={styles.row}>
            <span>Người nhận</span>
            <span>{address?.customerName}</span>
          </div>

          <div className={styles.row}>
            <span>Số điện thoại</span>
            <span>{address?.customerPhone}</span>
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

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Sản phẩm</div>

          {(order.items ?? []).map((item: any) => {
            const imageUrl = getOrderItemCoverImage(item);
            const title = item.bookTitle || item.title || "Sản phẩm";

            return (
              <div
                key={item.orderItemId || item.itemId || item.bookId}
                className={styles.item}
              >
                {imageUrl && <img src={imageUrl} alt={title} />}

                <div className={styles.itemInfo}>
                  <div className={styles.itemTitle}>{title}</div>
                  <div className={styles.itemQty}>SL: {item.quantity}</div>
                </div>

                <div className={styles.itemPrice}>{formatPrice(item.price)} đ</div>
              </div>
            );
          })}
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Tạm tính</span>
            <span>{formatPrice(order.subtotal)} đ</span>
          </div>

          <div className={styles.summaryRow}>
            <span>VAT ({formatVatRate(order.vatRate)}%)</span>
            <span>{formatPrice(order.vatAmount)} đ</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Giảm giá</span>
            <span>{getVoucherDiscountLabel(order)}</span>
          </div>

          <div className={styles.summaryRow}>
            <strong>Thành tiền</strong>
            <strong>{formatPrice(order.totalAmount)} đ</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
