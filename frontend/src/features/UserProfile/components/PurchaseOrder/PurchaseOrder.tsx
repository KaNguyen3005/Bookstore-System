import { useEffect, useState } from "react";
import { getOrdersByStatus } from "../../../../services/PurchaseOrderService";
import "./PurchaseOrder.css";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import type { Order, OrderStatus } from "../../../../data/orders";

export default function Orders() {
  const { user } = useAuth();

  const [active, setActive] = useState<OrderStatus>("pending");
  const [orders, setOrders] = useState<Order[]>([]);

  const tabs: { key: OrderStatus; label: string }[] = [
    { key: "pending", label: "Chờ xác nhận" },
    { key: "pickup", label: "Chờ lấy hàng" },
    { key: "shipping", label: "Chờ giao hàng" },
    { key: "delivered", label: "Đã giao" },
    { key: "return", label: "Trả hàng" },
    { key: "cancel", label: "Đã hủy" },
  ];

  const loadOrders = async (status: OrderStatus, userId: number) => {
    const data = await getOrdersByStatus(status, userId);
    setOrders(data);
  };

  useEffect(() => {
    if (!user?.user_id) return;

    loadOrders(active, user.user_id);
  }, [user?.user_id, active]);

  const renderActions = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <button>Hủy đơn</button>;

      case "pickup":
      case "shipping":
        return null;

      case "delivered":
        return (
          <>
            <button>Đánh giá</button>
            <button>Mua lại</button>
            <button>Trả hàng/Hoàn tiền</button>
          </>
        );

      case "return":
      case "cancel":
        return <button>Mua lại</button>;

      default:
        return null;
    }
  };

  return (
    <div className="order-page">
      <div className="order-header">
        <h3>Đơn mua</h3>

        <div className="order-tabs">
          {tabs.map((tab) => (
            <span
              key={tab.key}
              className={`tab ${active === tab.key ? "active" : ""}`}
              onClick={() => setActive(tab.key)}
            >
              {tab.label}
            </span>
          ))}
        </div>
      </div>

      <div className="order-box">
        {orders.length === 0 ? (
          <div>
            <p>Bạn chưa có đơn hàng nào</p>
            <button>Mua sắm ngay</button>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((o) => (
              <div key={`${o.id}-${o.user_id}`} className="order-item">
                {/* TOP */}
                <div className="order-top">
                  <img src={o.image} alt={o.name} className="order-img" />

                  <div className="order-info">
                    <h4>{o.name}</h4>
                    <span>x{o.quantity}</span>
                  </div>

                  <div className="order-price">
                    <p className="new-price">
                      {o.price.toLocaleString()}đ
                    </p>
                    <p className="old-price">
                      {(o.price + 30000).toLocaleString()}đ
                    </p>
                  </div>
                </div>

                {/* BOTTOM */}
                <div className="order-bottom">
                  <p>
                    Tổng tiền:{" "}
                    <strong>
                      {(o.price * o.quantity).toLocaleString()}đ
                    </strong>
                  </p>

                  <div className="order-actions">
                    {renderActions(o.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}