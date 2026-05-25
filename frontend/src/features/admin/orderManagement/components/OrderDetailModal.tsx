import React, { useEffect, useState } from 'react';
import { X, Package, Clock, CreditCard, MapPin, Phone } from 'lucide-react';
import type { Order } from '../types/order';
import { orderService } from '../services/orderService';
import './OrderDetailModal.css';
import { formatVietnamDateTime } from '../../../../utils/dateTime';

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

  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0).replace('₫', 'đ');
  };

  const getLineTotal = (item: Order['items'][number]) => {
    return item.lineTotal ?? item.price * item.quantity;
  };
  
//Lấy dữ liệu khách hàng hiện lên FE
  const customerAddress = order?.shipment?.address;
  const shippingSnapshot = order?.shipping;
  const receiverName =
    customerAddress?.customerName || shippingSnapshot?.receiverName || order?.customerName;
  const receiverPhone =
    customerAddress?.customerPhone || shippingSnapshot?.receiverPhone;
  const shippingAddress = [
    customerAddress?.detailAddress || shippingSnapshot?.line1,
    shippingSnapshot?.line2,
    customerAddress?.ward || shippingSnapshot?.ward,
    customerAddress?.district || shippingSnapshot?.district,
    customerAddress?.province || shippingSnapshot?.city,
    shippingSnapshot?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const itemsSubtotal =
    order?.items.reduce((sum, item) => sum + getLineTotal(item), 0) ?? 0;
  const subtotal = itemsSubtotal > 0 ? itemsSubtotal : order?.subtotal || 0;
  const vatRate = order?.vatRate || 0;
  const vatAmount = order?.vatAmount ?? subtotal * vatRate;
  const totalAmount = order?.totalAmount ?? subtotal + vatAmount;
  const vatPercent = vatRate > 1 ? vatRate : vatRate * 100;

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
                    <Clock size={16} /> Trạng thái & Thời gian
                  </div>
                  <div className="order-detail-modal__info">
                    <p><strong>Trạng thái:</strong> {order.status}</p>
                    <p><strong>Ngày đặt:</strong> {formatVietnamDateTime(order.createdAt)}</p>
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

              <div className="order-detail-modal__shipping-section">
                <div className="order-detail-modal__section-title">
                  <MapPin size={16} /> Thông tin giao hàng
                </div>
                <div className="order-detail-modal__shipping-grid">
                  <div className="order-detail-modal__info">
                    <p><strong>Người nhận:</strong> {receiverName || 'Chưa có thông tin'}</p>
                    <p className="order-detail-modal__phone">
                      <Phone size={14} />
                      <strong>Số điện thoại:</strong> {receiverPhone || 'Chưa có thông tin'}
                    </p>
                    <p><strong>Nhân viên xử lý:</strong> {order.staffName || 'Chưa phân công'}</p>
                  </div>
                  <div className="order-detail-modal__info">
                    <p><strong>Địa chỉ:</strong> {shippingAddress || 'Chưa có thông tin'}</p>
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
                    {order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.bookTitle}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-right">{formatCurrency(item.price)}</td>
                          <td className="text-right">{formatCurrency(getLineTotal(item))}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center">
                          Chưa có dữ liệu sản phẩm từ API
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="order-detail-modal__summary">
                <div className="order-detail-modal__summary-row">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="order-detail-modal__summary-row">
                  <span>VAT ({vatPercent}%):</span>
                  <span>{formatCurrency(vatAmount)}</span>
                </div>
                <div className="order-detail-modal__summary-row order-detail-modal__summary-row--total">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(totalAmount)}</span>
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
