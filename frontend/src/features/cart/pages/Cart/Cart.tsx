import React from 'react';
import { useCart } from '../../hooks/useCart';
import CartItem from '../../components/CartItem';
import CartSummary from '../../components/CartSummary';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart: React.FC = () => {
  const { cartItems, selectAll } = useCart();

  const isAllSelected = cartItems.length > 0 && cartItems.every(item => item.selected);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    selectAll(e.target.checked);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-state">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" 
          alt="Giỏ hàng trống" 
          className="cart-empty-img"
        />
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Kiến thức là kho báu, hãy thêm sách vào giỏ hàng ngay!</p>
        <Link to="/" className="cart-continue-btn">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h1 className="cart-page-title">Giỏ hàng</h1>
      
      <div className="cart-layout">
        <div className="cart-items-section">
          <div className="cart-items-header">
            <div className="cart-select-all">
              <input 
                type="checkbox" 
                id="selectAll" 
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
              <label htmlFor="selectAll">Chọn tất cả ({cartItems.length} sản phẩm)</label>
            </div>
            <div className="cart-header-labels">
              <span>Đơn giá</span>
              <span>Số lượng</span>
              <span>Thành tiền</span>
              <span className="cart-header-action"><span className="visually-hidden">Thao tác</span></span>
            </div>
          </div>
          
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <CartItem key={item.book_id} item={item} />
            ))}
          </div>
        </div>
        
        <div className="cart-summary-section">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default Cart;
