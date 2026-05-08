import React from 'react';
import type { CartItemType } from '../../../cart/types/cartItemType';
import './CheckoutCartItem.css';

interface CheckoutCartItemProps {
  item: CartItemType;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const CheckoutCartItem: React.FC<CheckoutCartItemProps> = ({ item }) => {
  const discountedPrice = item.book.price * (1 - item.book.salePercent / 100);
  const totalItemPrice = discountedPrice * item.quantity;

  return (
    <div className="cco-item">
      <div className="cco-item__image-wrapper">
        <img
          src={item.book.coverImgUrl}
          alt={item.book.title}
          className="cco-item__image"
        />
        <span className="cco-item__qty-badge">{item.quantity}</span>
      </div>

      <div className="cco-item__info">
        <p className="cco-item__title">{item.book.title}</p>
        <div className="cco-item__prices">
          <span className="cco-item__price-current">{formatPrice(discountedPrice)}</span>
          {item.book.salePercent > 0 && (
            <span className="cco-item__price-original">{formatPrice(item.book.price)}</span>
          )}
        </div>
        <p className="cco-item__meta">SL: {item.quantity}</p>
      </div>

      <div className="cco-item__total">
        {formatPrice(totalItemPrice)}
      </div>
    </div>
  );
};

export default CheckoutCartItem;
