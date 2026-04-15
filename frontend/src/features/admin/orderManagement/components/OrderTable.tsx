import React from 'react';
import { Eye, Printer } from 'lucide-react';
import type { Order, OrderStatus } from '../types/order';
import '../styles/OrderTable.css';

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
}

export const OrderTable: React.FC<OrderTableProps> = ({ orders, loading }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
  };

  const getStatusBadgeClass = (status: OrderStatus): string => {
    switch (status) {
      case 'Chờ xác nhận': return 'order-table__badge--warning';
      case 'Đã xác nhận': return 'order-table__badge--info';
      case 'Đang giao': return 'order-table__badge--teal';
      case 'Đã giao': return 'order-table__badge--success';
      case 'Đã hủy': return 'order-table__badge--danger';
      default: return 'order-table__badge--default';
    }
  };

  if (loading) {
    return <div className="order-table__loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="order-table__wrapper">
      <table className="order-table">
        <thead className="order-table__thead">
          <tr className="order-table__tr order-table__tr--header">
            <th className="order-table__th">
              <input type="checkbox" className="order-table__checkbox" />
            </th>
            <th className="order-table__th">Mã đơn</th>
            <th className="order-table__th">Khách hàng</th>
            <th className="order-table__th">SĐT</th>
            <th className="order-table__th">Sản phẩm</th>
            <th className="order-table__th">Tổng tiền</th>
            <th className="order-table__th">Thanh toán</th>
            <th className="order-table__th">Ngày đặt</th>
            <th className="order-table__th">Trạng thái</th>
            <th className="order-table__th">Thao tác</th>
          </tr>
        </thead>
        <tbody className="order-table__tbody">
          {orders.map((order) => (
            <tr key={order.id} className="order-table__tr">
              <td className="order-table__td">
                <input type="checkbox" className="order-table__checkbox" />
              </td>
              <td className="order-table__td order-table__id">{order.id}</td>
              <td className="order-table__td">
                <div className="order-table__customer">{order.customerName}</div>
              </td>
              <td className="order-table__td">{order.phoneNumber}</td>
              <td className="order-table__td">
                <div className="order-table__products">
                  <span className="order-table__product-icon">📦</span>
                  <span>{order.productCount} sản phẩm</span>
                </div>
              </td>
              <td className="order-table__td order-table__amount">
                {formatCurrency(order.totalAmount)}
              </td>
              <td className="order-table__td" style={{maxWidth: '80px', whiteSpace: 'normal'}}>{order.paymentMethod}</td>
              <td className="order-table__td">{order.orderDate}</td>
              <td className="order-table__td">
                <span className={`order-table__badge ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="order-table__td">
                <div className="order-table__actions">
                  <button className="order-table__action-btn">
                    <Eye size={16} strokeWidth={2.5} />
                  </button>
                  <button className="order-table__action-btn">
                    <Printer size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr className="order-table__tr">
              <td colSpan={10} className="order-table__td order-table__td--empty">
                Không tìm thấy đơn hàng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
