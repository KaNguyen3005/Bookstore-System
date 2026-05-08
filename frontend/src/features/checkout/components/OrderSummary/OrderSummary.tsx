import React from 'react';
import type { CheckoutTotals } from '../../types';
import './OrderSummary.css';

interface OrderSummaryProps {
  totals: CheckoutTotals;
  itemCount: number;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const OrderSummary: React.FC<OrderSummaryProps> = ({ totals, itemCount }) => {
  return (
    <section className="order-summary" aria-label="Tóm tắt đơn hàng">
      <div className="order-summary__header">
        <h2 className="order-summary__title">Đơn hàng</h2>
        <span className="order-summary__item-count">{itemCount} sản phẩm</span>
      </div>

      <div className="order-summary__rows">
        <div className="order-summary__row">
          <span>Tổng tiền hàng</span>
          <span>{formatPrice(totals.subtotal)}</span>
        </div>

        <div className="order-summary__row">
          <span>Phí vận chuyển</span>
          <span className={totals.shippingFee === 0 ? 'order-summary__free' : ''}>
            {totals.shippingFee === 0 ? 'Miễn phí' : formatPrice(totals.shippingFee)}
          </span>
        </div>

        {totals.discount > 0 && (
          <div className="order-summary__row order-summary__row--discount">
            <span>Giảm giá trực tiếp</span>
            <span>-{formatPrice(totals.discount)}</span>
          </div>
        )}

        {totals.shippingDiscount > 0 && (
          <div className="order-summary__row order-summary__row--discount">
            <span>Giảm giá phí vận chuyển</span>
            <span>-{formatPrice(totals.shippingDiscount)}</span>
          </div>
        )}
      </div>

      <div className="order-summary__divider" />

      <div className="order-summary__total">
        <span className="order-summary__total-label">Tổng tiền thanh toán</span>
        <span className="order-summary__total-amount">{formatPrice(totals.total)}</span>
      </div>

      <p className="order-summary__vat-note">
        (Giá này đã bao gồm thuế GTGT, phí đóng gói, phí vận chuyển và các chi phí phát sinh khác)
      </p>
    </section>
  );
};

export default OrderSummary;
