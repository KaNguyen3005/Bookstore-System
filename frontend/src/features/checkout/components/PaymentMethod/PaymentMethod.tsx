import React from 'react';
import { PAYMENT_METHODS } from '../../../../data/payment.mock';
import type { PaymentMethodId } from '../../types';
import './PaymentMethod.css';

interface PaymentMethodProps {
  selected: PaymentMethodId | null;
  onChange: (method: PaymentMethodId) => void;
}

// Maps data/payment.mock id strings → PaymentMethodId enum
const ID_MAP: Record<string, PaymentMethodId> = {
  cod: 'COD',
  vnpay: 'VNPAY',
  momo: 'MOMO',
  card: 'CARD',
  atm: 'ATM',
  zalopay: 'ZALOPAY',
};

const PaymentMethod: React.FC<PaymentMethodProps> = ({ selected, onChange }) => {
  return (
    <section className="payment-method" aria-label="Phương thức thanh toán">
      <h2 className="payment-method__title">Chọn phương thức thanh toán</h2>
      <div className="payment-method__list" role="radiogroup" aria-label="Danh sách phương thức thanh toán">
        {PAYMENT_METHODS.map((method) => {
          const methodId = ID_MAP[method.id];
          const isSelected = selected === methodId;

          return (
            <label
              key={method.id}
              id={`payment-label-${method.id}`}
              className={`payment-method__item ${isSelected ? 'payment-method__item--active' : ''}`}
              htmlFor={`payment-radio-${method.id}`}
            >
              <input
                id={`payment-radio-${method.id}`}
                type="radio"
                name="payment_method"
                value={methodId}
                checked={isSelected}
                onChange={() => onChange(methodId)}
                className="payment-method__radio"
                aria-label={method.name}
              />
              <img
                src={method.icon}
                alt={method.name}
                className="payment-method__icon"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="payment-method__name">{method.name}</span>
              {isSelected && <span className="payment-method__check">✓</span>}
            </label>
          );
        })}
      </div>
    </section>
  );
};

export default PaymentMethod;
