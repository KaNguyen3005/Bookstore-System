import { useEffect, useState } from "react";

import { getMyOrdersByStatus } from "../../../../services/orderApi";
import { useAuth } from "../../../../features/auth/hooks/useAuth";

import styles from "./PurchaseOrder.module.css";
import OrderModal from "../OrderModal/OrderModal";



export default function Orders() {
  const { user } = useAuth();

  const [active, setActive] = useState("PENDING");
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [showSad, setShowSad] = useState(false);

  const tabs = [
    { key: "PENDING", label: "Chờ xác nhận" },
    { key: "PICKING_UP", label: "Chờ lấy hàng" },
    { key: "SHIPPING", label: "Chờ giao hàng" },
    { key: "DELIVERED", label: "Đã giao" },
    { key: "RETURNED", label: "Trả hàng" },
    { key: "CANCELLED", label: "Đã hủy" },
  ];

  // LOAD ORDERS (FIXED)
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

  // INIT + reload when tab changes (FIXED IMPORTANT)
  useEffect(() => {
    if (!user) return;
    loadOrders();
  }, [user, active]);

  // FILTER (GIỮ NGUYÊN LOGIC)
  useEffect(() => {
    const filtered = orders.filter((o) => o.status === active);
    setFilteredOrders(filtered);
  }, [orders, active]);

  // ACTION BUTTONS (GIỮ NGUYÊN)
  const renderActions = (order: any) => {
    switch (order.status) {
      case "PENDING":
        return (
          <>
            <button className={styles.cancelBtn}>
              Hủy đơn
            </button>

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
              {filteredOrders.map((o) => (
                <div key={o.orderId} className={styles.orderItem}>
                  {o.items?.map((item: any) => (
                    <div key={item.bookId} className={styles.orderTop}>
                      <img src="/images/book.png" alt={item.bookTitle} />

                      <div className={styles.orderInfo}>
                        <h4>{item.bookTitle}</h4>
                        <span>Số lượng: {item.quantity}</span>
                      </div>

                      <div className={styles.orderPrice}>
                        <p>{(item.price || 0).toLocaleString()} đ</p>
                      </div>
                    </div>
                  ))}

                  <div className={styles.orderBottom}>
                    <strong>
                      {(o.totalAmount || 0).toLocaleString()} đ
                    </strong>

                    <div className={styles.orderActions}>
                      {renderActions(o)}
                    </div>
                  </div>
                </div>
              ))}
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