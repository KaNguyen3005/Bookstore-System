import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSummary: React.FC = () => {
  const { calculateTotal, selectedItems } = useCart();
  const navigate = useNavigate();
  const { subtotal, discount, total } = calculateTotal();

  const handleCheckout = () => {
    if (selectedItems.length > 0) {
      // In a real app, this might navigate to a checkout page with state
      navigate('/checkout');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="cart-summary-card">
      <h3 className="cart-summary-title">Tóm tắt đơn hàng</h3>
      
      <div className="cart-summary-row">
        <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      
      {discount > 0 && (
        <div className="cart-summary-row discount">
          <span>Giảm giá</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}
      
      <div className="cart-summary-divider"></div>
      
      <div className="cart-summary-row total">
        <span>Tổng cộng</span>
        <span className="cart-summary-total-price">{formatPrice(total)}</span>
      </div>
      <p className="cart-summary-vat-note">(Đã bao gồm VAT nếu có)</p>

      <button 
        className={`cart-summary-checkout-btn ${selectedItems.length === 0 ? 'disabled' : ''}`}
        disabled={selectedItems.length === 0}
        onClick={handleCheckout}
      >
        Mua Hàng
      </button>
    </div>
  );
};

export default CartSummary;
