import React, { useEffect, useState } from 'react';
import { X, Package, Clock, User, Calendar, CreditCard } from 'lucide-react';
import type { Order } from '../types/order';
import { orderService } from '../services/orderService';
import './OrderDetailModal.css';

interface OrderDetailModalProps {
  orderId: number | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  onClose,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const data = await orderService.getOrderById(orderId);
          setOrder(data);
        } catch (error) {
          console.error('Error fetching order detail:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [orderId]);

  if (!orderId) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
  };

  return (
    <div className="order-detail-modal">
      <div className="order-detail-modal__overlay" onClick={onClose} />
      <div className="order-detail-modal__content">
        <div className="order-detail-modal__header">
          <h2>Chi tiết đơn hàng #{orderId}</h2>
          <button className="order-detail-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="order-detail-modal__body">
          {loading ? (
            <div className="order-detail-modal__loading">Đang tải thông tin...</div>
          ) : order ? (
            <>
              <div className="order-detail-modal__grid">
                <div className="order-detail-modal__section">
                  <div className="order-detail-modal__section-title">
                    <User size={16} /> Thông tin khách hàng
                  </div>
                  <div className="order-detail-modal__info">
                    <p><strong>Khách hàng:</strong> {order.customerName}</p>
                    <p><strong>Nhân viên xử lý:</strong> {order.staffName || 'Chưa phân công'}</p>
                  </div>
                </div>

                <div className="order-detail-modal__section">
                  <div className="order-detail-modal__section-title">
                    <Clock size={16} /> Trạng thái & Thời gian
                  </div>
                  <div className="order-detail-modal__info">
                    <p><strong>Trạng thái:</strong> {order.status}</p>
                    <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                <div className="order-detail-modal__section">
                  <div className="order-detail-modal__section-title">
                    <CreditCard size={16} /> Thanh toán
                  </div>
                  <div className="order-detail-modal__info">
                    <p><strong>Trạng thái TT:</strong> {order.paymentStatus}</p>
                    <p><strong>Voucher:</strong> {order.voucher?.voucherCode || 'Không sử dụng'}</p>
                  </div>
                </div>
              </div>

              <div className="order-detail-modal__items-section">
                <div className="order-detail-modal__section-title">
                  <Package size={16} /> Danh sách sản phẩm
                </div>
                <table className="order-detail-modal__table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-center">Số lượng</th>
                      <th className="text-right">Đơn giá</th>
                      <th className="text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.bookTitle}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-right">{formatCurrency(item.price)}</td>
                        <td className="text-right">{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="order-detail-modal__summary">
                <div className="order-detail-modal__summary-row">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="order-detail-modal__summary-row">
                  <span>VAT ({order.vatRate * 100}%):</span>
                  <span>{formatCurrency(order.vatAmount)}</span>
                </div>
                <div className="order-detail-modal__summary-row order-detail-modal__summary-row--total">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="order-detail-modal__error">Không tìm thấy thông tin đơn hàng</div>
          )}
        </div>

        <div className="order-detail-modal__footer">
          <button className="ui-btn ui-btn-outline" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};
