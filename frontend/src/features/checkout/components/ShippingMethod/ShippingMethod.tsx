import React from 'react';
import type { ShippingMethodType } from '../../types';
import { FaTruck, FaStore } from 'react-icons/fa';
import './ShippingMethod.css';

interface ShippingOption {
  id: ShippingMethodType;
  label: string;
  description: string;
  fee: number;
  icon: React.ReactNode;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'DELIVERY',
    label: 'Giao hàng nhanh',
    description: 'Giao trong nội thành. Dự kiến giao trong ngày.',
    fee: 30_000,
    icon: <FaTruck size={22} />,
  },
  {
    id: 'PICKUP',
    label: 'Tự nhận hàng',
    description: 'Nhận tại cửa hàng KATIIA. Miễn phí vận chuyển.',
    fee: 0,
    icon: <FaStore size={22} />,
  },
];

interface ShippingMethodProps {
  selected: ShippingMethodType;
  onChange: (method: ShippingMethodType) => void;
}

const formatPrice = (price: number): string =>
  price === 0
    ? 'Miễn phí'
    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const ShippingMethod: React.FC<ShippingMethodProps> = ({ selected, onChange }) => {
  return (
    <section className="shipping-method" aria-label="Phương thức vận chuyển">
      <h2 className="shipping-method__title">Chọn phương thức vận chuyển</h2>
      <div className="shipping-method__options">
        {SHIPPING_OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              id={`shipping-${option.id.toLowerCase()}`}
              className={`shipping-method__card ${isSelected ? 'shipping-method__card--active' : ''}`}
              onClick={() => onChange(option.id)}
              aria-pressed={isSelected}
              type="button"
            >
              <div className="shipping-method__card-icon">{option.icon}</div>
              <div className="shipping-method__card-body">
                <p className="shipping-method__card-label">{option.label}</p>
                <p className="shipping-method__card-desc">{option.description}</p>
              </div>
              <div className={`shipping-method__card-fee ${option.fee === 0 ? 'free' : ''}`}>
                {formatPrice(option.fee)}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ShippingMethod;
