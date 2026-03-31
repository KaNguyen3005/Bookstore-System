import { useEffect, useState } from "react";
import { getOrdersByStatus } from "../../services/orderService";
import "../../styles/PurchaseOrder.css";

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

const renderActions = (status: string) => {
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
          <button>Yêu cầu Trả Hàng/Hoàn Tiền</button>
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
            <>
              <p>Bạn chưa có đơn hàng nào cả</p>
              <button>Mua sắm ngay</button>
            </>
          ) : (
            <div className="order-list">
              {orders.map((o) => (
                <div key={o.id} className="order-item">

                  {/* TOP */}
                  <div className="order-top">
                    <img src={o.image} alt={o.name} className="order-img" />

                    <div className="order-info">
                      <h4>{o.name}</h4>
                      <span>x{o.quantity || 1}</span>
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
                      Tổng số tiền ({o.quantity || 1} sản phẩm):{" "}
                      <strong>
                        {(o.price * (o.quantity || 1)).toLocaleString()}đ
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