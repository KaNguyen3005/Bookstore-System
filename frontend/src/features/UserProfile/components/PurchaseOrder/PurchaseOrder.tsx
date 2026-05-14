import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyOrders } from "../../../../services/orderApi";
import { useAuth } from "../../../../features/auth/hooks/useAuth";

import styles from "./PurchaseOrder.module.css";
import OrderModal from "../OrderModal/OrderModal";

const FALLBACK_BOOK_IMAGE = "/images/book-placeholder.svg";

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [active, setActive] = useState("ALL");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

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

    const res = await getMyOrders();

    console.log("RAW API:", res);

    const nextOrders = Array.isArray(res?.result)
      ? res.result
      : [];

    console.log("FIRST ORDER FULL:", nextOrders?.[0]);
    console.log("ITEMS FIELD:", nextOrders?.[0]?.items);

    setOrders(nextOrders);
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
            <button onClick={() => setSelectedOrder(order)}>
              Xem chi tiết
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
            <button onClick={() => setSelectedOrder(order)}>
              Xem chi tiết
            </button>
          </>
        );

      case "DELIVERED":
      case "COMPLETED":
        return (
          <>
            {order.items?.map((item: any) => (
              <div key={item.bookId}>
                {!item.hasReview ? (
                  <button
                    onClick={() =>
                      navigate(
                        `/product/${item.bookId}?orderId=${order.orderId}&itemId=${item.bookId}`
                      )
                    }
                  >
                    Đánh giá
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      navigate(
                        `/product/${item.bookId}?orderId=${order.orderId}&itemId=${item.bookId}&view=review`
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
            <button onClick={() => setSelectedOrder(order)}>
              Xem chi tiết
            </button>
          </>
        );

      default:
        return (
          <button onClick={() => setSelectedOrder(order)}>
            Xem chi tiết
          </button>
        );
    }
  };

  // ================= FILTER =================
  const filteredOrders = useMemo(() => {
    if (active === "ALL") return orders;

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


                const orderImage =
                  firstItem?.bookImgs?.[0]?.imgUrl ||
                  FALLBACK_BOOK_IMAGE;

                const orderTitle =
                  firstItem?.bookTitle ||
                  `Đơn hàng #${o.orderId || index + 1}`;

                return (
                  <div key={o.orderId || index} className={styles.orderItem}>
                    <span
                      className={`${styles.shippingStatus} ${
                        o.status === "SHIPPING"
                          ? styles.blue
                          : o.status === "CANCELLED"
                          ? styles.red
                          : o.status === "DELIVERED" ||
                            o.status === "COMPLETED"
                          ? styles.green
                          : ""
                      }`}
                    >
                      Trạng thái: {statusMap[o.status] || o.status}
                    </span>

                    <div className={styles.orderTop}>
                      <img
                        src={orderImage}
                        alt={orderTitle}
                        onError={(e) =>
                          (e.currentTarget.src = FALLBACK_BOOK_IMAGE)
                        }
                      />

                      <div className={styles.orderInfo}>
                        <h4>{orderTitle}</h4>

                        {firstItem ? (
                          o.items.length > 1 ? (
                            <span>
                              Số lượng: {firstItem.quantity} (+{" "}
                              {o.items.length - 1} sản phẩm khác)
                            </span>
                          ) : (
                            <span>
                              Số lượng: {firstItem.quantity}
                            </span>
                          )
                        ) : (
                          <span>
                            Đang cập nhật thông tin sản phẩm
                          </span>
                        )}
                      </div>

                      <div className={styles.orderPrice}>
                        <p>
                          {(firstItem?.price || 0).toLocaleString()} đ
                        </p>
                      </div>
                    </div>

                    <div className={styles.orderBottom}>
                      <strong>
                        Thành tiền:{" "}
                        <span className={styles.totalPrice}>
                          {(o.totalAmount || 0).toLocaleString()} đ
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