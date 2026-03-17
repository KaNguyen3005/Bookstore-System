import { useEffect, useState } from "react";
import "../../styles/Order.css";
import { getOrdersByStatus } from "../../services/orderService";

export default function Orders() {
  const [active, setActive] = useState("pending");
  const [orders, setOrders] = useState([]);

  const tabs = [
    { key: "pending", label: "Chờ xác nhận" },
    { key: "pickup", label: "Chờ lấy hàng" },
    { key: "shipping", label: "Chờ giao hàng" },
    { key: "delivered", label: "Đã giao" },
    { key: "return", label: "Trả hàng" },
    { key: "cancel", label: "Đã hủy" },
  ];

  useEffect(() => {
    loadOrders();
  }, [active]);

  const loadOrders = async () => {
    const data = await getOrdersByStatus(active);
    setOrders(data);
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
          <>
            <p>Bạn chưa có đơn hàng nào cả</p>
            <button>Mua sắm ngay</button>
          </>
        ) : (
          <div className="order-list">
            {orders.map((o) => (
              <div key={o.id} className="order-item">
                <h4>{o.name}</h4>
                <p>{o.price.toLocaleString()}đ</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}