import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getOrderById,
  getMyOrderById,
  getMyOrders,
} from "../../../../services/orderApi";
import { useAuth } from "../../../../features/auth/hooks/useAuth";

import styles from "./PurchaseOrder.module.css";
import OrderModal from "../OrderModal/OrderModal";

const FALLBACK_BOOK_IMAGE = "/images/book-placeholder.svg";

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

const getOrderId = (order: any) =>
  order?.orderId ?? order?.order_id ?? order?.id;

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

const getOrderList = (data: any) => {
  const source = unwrapApiData(data);
  const content = Array.isArray(source)
    ? source
    : source?.content ?? source?.data ?? [];

  return Array.isArray(content) ? content : [];
};

const withNormalizedItems = (order: any) => ({
  ...order,
  orderId: getOrderId(order),
  items: getOrderItems(order),
});

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

const fetchOrderDetail = async (orderId: string | number) => {
  const myDetail = unwrapApiData(await getMyOrderById(orderId));

  if (getOrderItems(myDetail).length > 0) {
    return myDetail;
  }

  const detail = unwrapApiData(await getOrderById(orderId));

  return {
    ...myDetail,
    ...detail,
  };
};

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [active, setActive] = useState("ALL");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [detailLoadingId, setDetailLoadingId] = useState<string | number | null>(
    null,
  );

  const tabs = [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING", label: "Chờ xác nhận" },
    { key: "PICKING_UP", label: "Chờ lấy hàng" },
    { key: "SHIPPING", label: "Chờ giao hàng" },
    { key: "DELIVERED", label: "Đã giao" },
    { key: "RETURNED", label: "Trả hàng" },
    { key: "CANCELLED", label: "Đã hủy" },
  ];

  const statusMap: Record<string, string> = {
    CREATED: "Chờ xác nhận",
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Chờ lấy hàng",
    PICKING_UP: "Chờ lấy hàng",
    PROCESSING: "Chờ lấy hàng",
    PENDING_PAYMENT: "Chờ thanh toán",
    PAID: "Đã thanh toán",
    SHIPPING: "Đang giao hàng",
    COMPLETED: "Đã giao",
    DELIVERED: "Đã giao",
    REFUNDED: "Đã hoàn tiền",
    FAILED: "Thanh toán thất bại",
    RETURNED: "Trả hàng",
    CANCELLED: "Đã hủy",
    UNKNOWN: "Đang cập nhật",
  };

  const statusGroups: Record<string, string[]> = {
    PENDING: ["CREATED", "PENDING", "PENDING_PAYMENT"],
    PICKING_UP: ["CONFIRMED", "PROCESSING", "PICKING_UP", "PAID"],
    SHIPPING: ["SHIPPING"],
    DELIVERED: ["DELIVERED", "COMPLETED"],
    RETURNED: ["RETURNED", "REFUNDED", "FAILED"],
    CANCELLED: ["CANCELLED"],
  };

  // ================= LOAD ORDERS =================
  const loadOrders = async () => {
    try {
      setLoading(true);

      const result = await getMyOrders();
      const nextOrders = getOrderList(result).map(withNormalizedItems);
      const ordersWithDetails = await Promise.all(
        nextOrders.map(async (order: any) => {
          const orderId = getOrderId(order);

          if (!orderId || getOrderItems(order).length > 0) {
            return order;
          }

          try {
            const detail = await fetchOrderDetail(orderId);

            return withNormalizedItems({
              ...order,
              ...detail,
            });
          } catch (error) {
            console.error("Load order detail failed:", error);
            return order;
          }
        }),
      );

      setOrders(ordersWithDetails);
    } catch (error) {
      console.error("Load orders failed:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem("access_token"));

    if (!isAuthenticated && !hasToken) return;

    loadOrders();
  }, [isAuthenticated]);

  const handleViewDetail = async (order: any) => {
    const orderId = getOrderId(order);

    if (!orderId) {
      setSelectedOrder(withNormalizedItems(order));
      return;
    }

    try {
      setDetailLoadingId(orderId);

      const detail = await fetchOrderDetail(orderId);
      const nextOrder = withNormalizedItems({
        ...order,
        ...detail,
      });

      setOrders((prev) =>
        prev.map((item) =>
          String(getOrderId(item)) === String(orderId) ? nextOrder : item,
        ),
      );
      setSelectedOrder(nextOrder);
    } catch (error) {
      console.error("Load order detail failed:", error);
      setSelectedOrder(withNormalizedItems(order));
    } finally {
      setDetailLoadingId(null);
    }
  };

  // ================= ACTIONS =================
  const renderActions = (order: any) => {
    const status = order.status;

    switch (status) {
      case "PENDING":
      case "CREATED":
      case "PENDING_PAYMENT":
        return (
          <>
            <button className={styles.cancelBtn}>Hủy đơn</button>
            <button>Liên hệ</button>
            <button
              disabled={detailLoadingId === getOrderId(order)}
              onClick={() => handleViewDetail(order)}
            >
              {detailLoadingId === getOrderId(order)
                ? "Đang tải..."
                : "Xem chi tiết"}
            </button>
          </>
        );

      case "PICKING_UP":
      case "CONFIRMED":
      case "PROCESSING":
      case "PAID":
      case "SHIPPING":
        return (
          <>
            <button>Liên hệ shop</button>
            <button
              disabled={detailLoadingId === getOrderId(order)}
              onClick={() => handleViewDetail(order)}
            >
              {detailLoadingId === getOrderId(order)
                ? "Đang tải..."
                : "Xem chi tiết"}
            </button>
          </>
        );

      case "DELIVERED":
      case "COMPLETED":
        return (
          <>
            {order.items?.map((item: any) => (
              <div key={getItemId(item)}>
                {!item.hasReview ? (
                  <button
                    onClick={() =>
                      navigate(
                        `/product/${getItemBookId(item)}?orderId=${order.orderId}&itemId=${getItemId(item)}`
                      )
                    }
                  >
                    Đánh giá
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      navigate(
                        `/product/${getItemBookId(item)}?orderId=${order.orderId}&itemId=${getItemId(item)}&view=review`
                      )
                    }
                  >
                    Xem đánh giá
                  </button>
                )}
              </div>
            ))}

            <button>Mua lại</button>
            <button>Hoàn tiền</button>
            <button>Liên hệ</button>
            <button
              disabled={detailLoadingId === getOrderId(order)}
              onClick={() => handleViewDetail(order)}
            >
              {detailLoadingId === getOrderId(order)
                ? "Đang tải..."
                : "Xem chi tiết"}
            </button>
          </>
        );

      case "RETURNED":
      case "REFUNDED":
      case "FAILED":
      case "CANCELLED":
        return (
          <>
            <button>Mua lại</button>
            <button>Liên hệ</button>
            <button
              disabled={detailLoadingId === getOrderId(order)}
              onClick={() => handleViewDetail(order)}
            >
              {detailLoadingId === getOrderId(order)
                ? "Đang tải..."
                : "Xem chi tiết"}
            </button>
          </>
        );

      default:
        return (
          <button
            disabled={detailLoadingId === getOrderId(order)}
            onClick={() => handleViewDetail(order)}
          >
            {detailLoadingId === getOrderId(order)
              ? "Đang tải..."
              : "Xem chi tiết"}
          </button>
        );
    }
  };

  // ================= FILTER BY TAB (IMPORTANT FIX) =================
  const filteredOrders = useMemo(() => {
    if (active === "ALL") {
      return orders;
    }

    const group = statusGroups[active] || [active];

    return orders.filter((o) => group.includes(o.status));
  }, [orders, active]);

  // ================= UI =================
  return (
    <>
      <div className={styles.orderPage}>
        <div className={styles.orderHeader}>
          <h3>Đơn mua</h3>

          <div className={styles.orderTabs}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tab} ${
                  active === tab.key ? styles.active : ""
                }`}
                onClick={() => setActive(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.orderBox}>
          {loading ? (
            <p className={styles.emptyOrder}>Đang tải đơn hàng...</p>
          ) : filteredOrders.length === 0 ? (
            <div className={styles.emptyOrder}>
              <p>Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className={styles.orderList}>
              {filteredOrders.map((o, index) => {
                const firstItem = o.items?.[0];
                const orderTitle =
                  firstItem ? getItemTitle(firstItem) : `Đơn hàng #${o.orderId || index + 1}`;
                const orderImage = firstItem?.coverImgUrl || FALLBACK_BOOK_IMAGE;

                return (
                  <div key={o.orderId || index} className={styles.orderItem}>
                    {/* STATUS */}
                    <span
                      className={`${styles.shippingStatus} ${
                        o.status === "SHIPPING"
                          ? styles.blue
                          : o.status === "CANCELLED"
                          ? styles.red
                          : o.status === "DELIVERED" || o.status === "COMPLETED"
                          ? styles.green
                          : ""
                      }`}
                    >
                      Trạng thái: {statusMap[o.status] || o.status}
                    </span>

                    {/* ITEM */}
                    <div className={styles.orderTop}>
                      <img
                        src={orderImage}
                        alt={orderTitle}
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_BOOK_IMAGE;
                        }}
                      />

                      <div className={styles.orderInfo}>
                        <h4>{orderTitle}</h4>

                        {firstItem ? (
                          o.items.length > 1 ? (
                            <span>
                              Số lượng: {firstItem.quantity} (+{o.items.length - 1} sản phẩm khác)
                            </span>
                          ) : (
                            <span>Số lượng: {firstItem.quantity}</span>
                          )
                        ) : (
                          <span>Đang cập nhật thông tin sản phẩm</span>
                        )}
                      </div>

                      <div className={styles.orderPrice}>
                        <p>{getItemPrice(firstItem).toLocaleString()} đ</p>
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className={styles.orderBottom}>
                      <strong>
                        Thành tiền:{" "}
                        <span className={styles.totalPrice}>
                          {getOrderTotal(o).toLocaleString()} đ
                        </span>
                      </strong>

                      <div className={styles.orderActions}>
                        {renderActions(o)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <OrderModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
}
