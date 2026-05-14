import styles from "./OrderModal.module.css";

const FALLBACK_BOOK_IMAGE = "/images/book-placeholder.svg";

const getItemId = (item: any) =>
  item?.itemId ?? item?.orderItemId ?? item?.id ?? item?.bookId;

const getItemBookId = (item: any) =>
  item?.bookId ?? item?.book_id ?? item?.book?.bookId ?? item?.book?.id;

const getItemTitle = (item: any) =>
  item?.bookTitle ??
  item?.title ??
  item?.book_title ??
  item?.book?.title ??
  "Sản phẩm";

const getItemPrice = (item: any) =>
  Number(item?.price ?? item?.unitPrice ?? item?.unit_price ?? 0);

const getOrderTotal = (order: any) =>
  Number(order?.totalAmount ?? order?.total ?? order?.amount?.total ?? 0);

const getOrderSubtotal = (order: any) =>
  Number(order?.subtotal ?? order?.amount?.subtotal ?? 0);

const unwrapApiData = (data: any): any => {
  let source = data;

  while (
    source &&
    typeof source === "object" &&
    !Array.isArray(source) &&
    (source.result !== undefined || source.data !== undefined)
  ) {
    source = source.result ?? source.data;
  }

  return source;
};

const getOrderItems = (order: any) => {
  const items =
    order?.items ??
    order?.orderItems ??
    order?.order_items ??
    order?.orderDetails ??
    order?.orderItemResponses ??
    order?.orderItemResponseList ??
    order?.orderDetailResponses ??
    order?.orderDetailResponseList ??
    order?.details ??
    order?.bookItems ??
    order?.books ??
    [];

  const source = unwrapApiData(items);

  return Array.isArray(source)
    ? source
    : Array.isArray(source?.content)
    ? source.content
    : [];
};

export default function OrderModal({
  order,
  onClose,
}: {
  order: any;
  onClose: () => void;
}) {
  if (!order) return null;

const items = getOrderItems(order);
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
            <span>{order.orderId ?? order.order_id ?? order.id}</span>
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
            <div key={getItemId(item) || `${getItemBookId(item)}-${index}`} className={styles.item}>
              <img
                src={item.coverImgUrl || FALLBACK_BOOK_IMAGE}
                alt={getItemTitle(item)}
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_BOOK_IMAGE;
                }}
              />

              <div className={styles.itemInfo}>
                <div className={styles.itemTitle}>
                  {getItemTitle(item)}
                </div>
                <div className={styles.itemQty}>
                  SL: {item.quantity}
                </div>
              </div>

              <div className={styles.itemPrice}>
                {getItemPrice(item).toLocaleString()} đ
              </div>
            </div>
          ))}
        </div>

        {/* ===== TỔNG TIỀN ===== */}
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Tổng tiền hàng</span>
            <span>
              {getOrderSubtotal(order).toLocaleString()} đ
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
              {getOrderTotal(order).toLocaleString()} đ
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
