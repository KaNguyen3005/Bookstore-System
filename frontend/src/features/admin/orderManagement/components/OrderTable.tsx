import React from 'react';
import { Eye, Printer, CheckCircle } from 'lucide-react';

import type {
  Order,
  OrderStatus,
} from '../types/order';

import '../styles/OrderTable.css';

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  onViewDetail: (id: number) => void;
  onApprove: (id: number) => void;
  onUpdateStatus: (id: number, status: OrderStatus) => void;
}

export const OrderTable: React.FC<
  OrderTableProps
> = ({ orders, loading, onViewDetail, onApprove, onUpdateStatus }) => {
  // ================= FORMAT MONEY =================
  const formatCurrency = (
    amount: number
  ) => {
    return new Intl.NumberFormat(
      'vi-VN',
      {
        style: 'currency',
        currency: 'VND',
      }
    )
      .format(amount)
      .replace('₫', 'đ');
  };

  // ================= FORMAT DATE =================
  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString('vi-VN');
  };

  // ================= STATUS LABEL =================
  const getStatusLabel = (
    status: OrderStatus
  ): string => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận';

      case 'CONFIRMED':
        return 'Đã xác nhận';

      case 'PROCESSING':
        return 'Đang xử lý';

      case 'SHIPPING':
        return 'Đang giao';

      case 'DELIVERED':
        return 'Đã giao';

      case 'CANCELLED':
        return 'Đã hủy';

      default:
        return status;
    }
  };

  // ================= STATUS BADGE =================
  const getStatusBadgeClass = (
    status: OrderStatus
  ): string => {
    switch (status) {
      case 'PENDING':
        return 'order-table__badge--warning';

      case 'CONFIRMED':
      case 'PROCESSING':
        return 'order-table__badge--info';

      case 'SHIPPING':
        return 'order-table__badge--teal';

      case 'DELIVERED':
        return 'order-table__badge--success';

      case 'CANCELLED':
        return 'order-table__badge--danger';

      default:
        return 'order-table__badge--default';
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="order-table__loading">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="order-table__wrapper">
      <table className="order-table">
        <thead className="order-table__thead">
          <tr className="order-table__tr order-table__tr--header">
            <th className="order-table__th">
              <input
                type="checkbox"
                className="order-table__checkbox"
              />
            </th>

            <th className="order-table__th">
              Mã đơn
            </th>

            <th className="order-table__th">
              Khách hàng
            </th>

            <th className="order-table__th">
              Sản phẩm
            </th>

            <th className="order-table__th">
              Tổng tiền
            </th>

            <th className="order-table__th">
              Thanh toán
            </th>

            <th className="order-table__th">
              Ngày đặt
            </th>

            <th className="order-table__th">
              Trạng thái
            </th>

            <th className="order-table__th">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="order-table__tbody">
          {orders.map((order) => (
            <tr
              key={order.orderId}
              className="order-table__tr"
            >
              <td className="order-table__td">
                <input
                  type="checkbox"
                  className="order-table__checkbox"
                />
              </td>

              {/* ORDER ID */}
              <td className="order-table__td order-table__id">
                #{order.orderId || (order as any).id}
              </td>

              {/* CUSTOMER */}
              <td className="order-table__td">
                <div className="order-table__customer">
                  {order.customerName}
                </div>
              </td>

              {/* PRODUCTS */}
              <td className="order-table__td">
                <div className="order-table__products">
                  <span className="order-table__product-icon">
                    📦
                  </span>

                  <span>
                    {
                      order.items?.length ?? 0
                    }{' '}
                    sản phẩm
                  </span>
                </div>
              </td>

              {/* TOTAL */}
              <td className="order-table__td order-table__amount">
                {formatCurrency(
                  order.totalAmount
                )}
              </td>

              {/* PAYMENT */}
              <td className="order-table__td">
                <span className={`order-table__payment-status order-table__payment-status--${order.paymentStatus?.toLowerCase() ?? 'pending'}`}>
                  {order.paymentStatus ?? 'PENDING'}
                </span>
              </td>

              {/* DATE */}
              <td className="order-table__td">
                {formatDate(
                  order.createdAt
                )}
              </td>

              {/* STATUS */}
              <td className="order-table__td">
                <select 
                  className={`order-table__status-select ${getStatusBadgeClass(order.status)}`}
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.orderId, e.target.value as OrderStatus)}
                >
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="PROCESSING">Đang xử lý</option>
                  <option value="SHIPPING">Đang giao</option>
                  <option value="DELIVERED">Đã giao</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </td>

              {/* ACTIONS */}
              <td className="order-table__td">
                <div className="order-table__actions">
                  {order.status === 'PENDING' && (
                    <button 
                      className="order-table__action-btn order-table__action-btn--approve"
                      title="Phê duyệt"
                      onClick={() => onApprove(order.orderId)}
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  
                  <button 
                    className="order-table__action-btn"
                    title="Xem chi tiết"
                    onClick={() => onViewDetail(order.orderId)}
                  >
                    <Eye
                      size={16}
                      strokeWidth={2.5}
                    />
                  </button>

                  <button className="order-table__action-btn" title="In hóa đơn">
                    <Printer
                      size={16}
                      strokeWidth={2.5}
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {/* EMPTY */}
          {orders.length === 0 && (
            <tr className="order-table__tr">
              <td
                colSpan={9}
                className="order-table__td order-table__td--empty"
              >
                Không tìm thấy đơn hàng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};