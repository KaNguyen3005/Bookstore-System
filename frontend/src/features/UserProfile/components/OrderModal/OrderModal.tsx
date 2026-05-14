import styles from "./OrderModal.module.css";

import {
  FALLBACK_BOOK_IMAGE,
  formatPrice,
  getStatusLabel,
} from "../../../../utils/order.utils";

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

          {order.items.map((item: any) => (
            <div
              key={item.itemId}
              className={styles.item}
            >
              <img
                src={
                  item.image ||
                  FALLBACK_BOOK_IMAGE
                }
                alt={item.title}
              />

              <div className={styles.itemInfo}>
                <div className={styles.itemTitle}>
                  {item.title}
                </div>

                <div className={styles.itemQty}>
                  SL: {item.quantity}
                </div>
              </div>

              <div className={styles.itemPrice}>
                {formatPrice(item.price)} đ
              </div>
            </div>
          ))}
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