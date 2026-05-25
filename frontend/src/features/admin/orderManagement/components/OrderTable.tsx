import React from 'react';
import { Eye, Printer, CheckCircle, Truck, Ban } from 'lucide-react';

import type {
  Order,
  OrderStatus,
} from '../types/order';

import '../styles/OrderTable.css';
import { formatVietnamDate } from '../../../../utils/dateTime';

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  allowedTransitions: Record<OrderStatus, OrderStatus[]>;
  onViewDetail: (id: number) => void;
  onApprove: (id: number) => void;
  onUpdateStatus: (id: number, current: OrderStatus, next: OrderStatus) => void;
  onPrintInvoice: (id: number) => void;
}

export const OrderTable: React.FC<
  OrderTableProps
> = ({ orders, loading, allowedTransitions, onViewDetail, onApprove, onUpdateStatus, onPrintInvoice }) => {
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

  // ================= ACTIONS =================
  const handleAction = (orderId: number, current: OrderStatus, next: OrderStatus, label: string) => {
    if (window.confirm(`Bạn có chắc muốn chuyển đơn hàng sang trạng thái "${label}"?`)) {
      onUpdateStatus(orderId, current, next);
    }
  };

  // ================= FORMAT DATE =================
  const formatDate = (
    date: string
  ) => {
    return formatVietnamDate(date);
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
          {orders.map((order) => {
            const possibleNext = allowedTransitions[order.status] || [];

            return (
              <tr
                key={order.orderId}
                className="order-table__tr"
              >
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
                  {formatCurrency(order.totalAmount)}
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
                  <span className={`order-table__badge ${getStatusBadgeClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="order-table__td">
                  <div className="order-table__actions">
                    {/* CONFIRM / APPROVE */}
                    {possibleNext.includes('CONFIRMED') && (
                      <button 
                        className="order-table__action-btn order-table__action-btn--approve"
                        title="Xác nhận đơn hàng"
                        onClick={() => {
                          if (window.confirm('Bạn có chắc muốn phê duyệt đơn hàng này?')) {
                            onApprove(order.orderId);
                          }
                        }}
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}

                    {/* MARK AS SHIPPING */}
                    {possibleNext.includes('SHIPPING') && (
                      <button 
                        className="order-table__action-btn order-table__action-btn--teal"
                        title="Bắt đầu giao hàng"
                        onClick={() => handleAction(order.orderId, order.status, 'SHIPPING', 'Đang giao')}
                      >
                        <Truck size={16} />
                      </button>
                    )}

                    {/* MARK AS DELIVERED */}
                    {possibleNext.includes('DELIVERED') && (
                      <button 
                        className="order-table__action-btn order-table__action-btn--success"
                        title="Đã giao hàng"
                        onClick={() => handleAction(order.orderId, order.status, 'DELIVERED', 'Hoàn thành')}
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}

                    {/* CANCEL */}
                    {possibleNext.includes('CANCELLED') && (
                      <button 
                        className="order-table__action-btn order-table__action-btn--danger"
                        title="Hủy đơn hàng"
                        onClick={() => handleAction(order.orderId, order.status, 'CANCELLED', 'Hủy bỏ')}
                      >
                        <Ban size={16} />
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

                    <button
                      className="order-table__action-btn"
                      title="In hóa đơn"
                      onClick={() => onPrintInvoice(order.orderId)}
                    >
                      <Printer
                        size={16}
                        strokeWidth={2.5}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {/* EMPTY */}
          {orders.length === 0 && (
            <tr className="order-table__tr">
              <td
                colSpan={8}
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
