import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getMyOrdersByStatus } from "../../../../services/orderApi";
import { useAuth } from "../../../../features/auth/hooks/useAuth";

import styles from "./PurchaseOrder.module.css";
import OrderModal from "../OrderModal/OrderModal";

export default function Orders() {
  const { user } = useAuth();
  const { orderId } = useParams();

  const [active, setActive] = useState("PENDING");
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const tabs = [
    { key: "PENDING", label: "Chờ xác nhận" },
    { key: "PICKING_UP", label: "Chờ lấy hàng" },
    { key: "SHIPPING", label: "Chờ giao hàng" },
    { key: "DELIVERED", label: "Đã giao" },
    { key: "RETURNED", label: "Trả hàng" },
    { key: "CANCELLED", label: "Đã hủy" },
  ];

  const statusMap: Record<string, string> = {
    PENDING: "Chờ xác nhận",
    PICKING_UP: "Chờ lấy hàng",
    SHIPPING: "Đang giao hàng",
    DELIVERED: "Đã giao",
    RETURNED: "Trả hàng",
    CANCELLED: "Đã hủy",
  };

  // ================= LOAD ORDERS =================
  const loadOrders = async () => {
    try {
      setLoading(true);

      const result = await getMyOrdersByStatus(active);

      setOrders(result || []);
    } catch (error) {
      console.error("Load orders failed:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= INIT / RELOAD =================
  useEffect(() => {
    if (!user) return;
    loadOrders();
  }, [user, active]);

  // ================= FILTER ORDERS =================
  useEffect(() => {
    const filtered = orders.filter((o) => o.status === active);
    setFilteredOrders(filtered);
  }, [orders, active]);

  // ================= AUTO OPEN ORDER FROM URL =================
  useEffect(() => {
    if (!orderId || orders.length === 0) return;

    const foundOrder = orders.find((o) => String(o.orderId) === orderId);

    if (foundOrder) {
      setSelectedOrder(foundOrder);
      setActive(foundOrder.status); // optional: auto switch tab
    }
  }, [orderId, orders]);

  // ================= ACTION BUTTONS =================
  const renderActions = (order: any) => {
    switch (order.status) {
      case "PENDING":
        return (
          <>
            <button className={styles.cancelBtn}>Hủy đơn</button>
            <button>Liên hệ</button>
            <button onClick={() => setSelectedOrder(order)}>
              Xem chi tiết
            </button>
          </>
        );

      case "DELIVERED":
        return (
          <>
            <button>Đánh giá</button>
            <button>Mua lại</button>
            <button>Hoàn tiền</button>
            <button>Liên hệ</button>
            <button onClick={() => setSelectedOrder(order)}>
              Xem chi tiết
            </button>
          </>
        );

      case "RETURNED":
      case "CANCELLED":
        return (
          <>
            <button>Mua lại</button>
            <button>Liên hệ</button>
            <button onClick={() => setSelectedOrder(order)}>
              Xem chi tiết
            </button>
          </>
        );

      default:
        return (
          <>
            <button>Liên hệ</button>
            <button onClick={() => setSelectedOrder(order)}>
              Xem chi tiết
            </button>
          </>
        );
    }
  };

  return (
    <>
      <div className={styles.orderPage}>
        {/* HEADER */}
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

        {/* CONTENT */}
        <div className={styles.orderBox}>
          {loading ? (
            <p className={styles.emptyOrder}>Đang tải đơn hàng...</p>
          ) : filteredOrders.length === 0 ? (
            <div className={styles.emptyOrder}>
              <p>Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className={styles.orderList}>
              {filteredOrders.map((o) => {
                const firstItem = o.items?.[0];

                return (
                  <div key={o.orderId} className={styles.orderItem}>
                    {/* STATUS */}
                    <span
                      className={`${styles.shippingStatus} ${
                        o.status === "SHIPPING"
                          ? styles.blue
                          : o.status === "CANCELLED"
                            ? styles.red
                            : o.status === "DELIVERED"
                              ? styles.green
                              : ""
                      }`}
                    >
                      Trạng thái: {statusMap[o.status] || o.status}
                    </span>

                    {/* ITEM PREVIEW */}
                    {firstItem && (
                      <div className={styles.orderTop}>
                        <img src="/images/book.png" alt={firstItem.bookTitle} />

                        <div className={styles.orderInfo}>
                          <h4>{firstItem.bookTitle}</h4>

                          {o.items.length > 1 ? (
                            <span>
                              Số lượng: {firstItem.quantity} (+
                              {o.items.length - 1} sản phẩm khác)
                            </span>
                          ) : (
                            <span>Số lượng: {firstItem.quantity}</span>
                          )}
                        </div>

                        <div className={styles.orderPrice}>
                          <p>{(firstItem.price || 0).toLocaleString()} đ</p>
                        </div>
                      </div>
                    )}

                    {/* BOTTOM */}
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

      {/* MODAL */}
      <OrderModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
}
