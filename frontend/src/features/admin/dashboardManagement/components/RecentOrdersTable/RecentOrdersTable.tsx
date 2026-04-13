import React from "react";
import "./RecentOrdersTable.css";
import type { RecentOrder } from "../../types";

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Thành công":
      case "Đã giao":
        return { bg: "#dcfce7", text: "#166534" };
      case "Chờ xử lý":
      case "Đang xử lý":
        return { bg: "#fef3c7", text: "#92400e" };
      case "Hủy":
      case "Đã hủy":
        return { bg: "#fee2e2", text: "#991b1b" };
      default:
        return { bg: "#f3f4f6", text: "#374151" };
    }
  };

  return (
    <div className="recent-orders">
      <div className="recent-orders-header">
        <h3 className="recent-orders-title">Đơn hàng mới</h3>
        <button className="recent-orders-more-btn">...</button>
      </div>
      <table className="recent-orders-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Ngày</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const style = getStatusStyle(order.status);
            return (
              <tr key={order.order_id}>
                <td className="order-id">#{order.order_id}</td>
                <td>{order.date}</td>
                <td className="order-total">{order.total.toLocaleString()}đ</td>
                <td>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: style.bg,
                      color: style.text,
                    }}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="view-all-btn">
        Xem tất cả ↓
      </button>
    </div>
  );
};

export default RecentOrdersTable;
