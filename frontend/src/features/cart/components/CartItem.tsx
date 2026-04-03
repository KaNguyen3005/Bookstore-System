import React from 'react';
import { useCart } from '../hooks/useCart';
import { type CartItemType } from '../context/CartContext';
import { FaTrash } from 'react-icons/fa';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { toggleSelect, updateQuantity, removeItem } = useCart();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.book_id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < item.stock_quantity) {
      updateQuantity(item.book_id, item.quantity + 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= item.stock_quantity) {
      updateQuantity(item.book_id, value);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      removeItem(item.book_id);
    }
  };

  const currentPrice = item.price * (1 - item.sale_percent / 100);
  const totalItemPrice = currentPrice * item.quantity;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className={`cart-item ${item.selected ? 'selected' : ''}`}>
      <div className="cart-item-checkbox">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => toggleSelect(item.book_id)}
        />
      </div>

      <div className="cart-item-image">
        <img src={item.cover_image_url} alt={item.title} />
      </div>

      <div className="cart-item-details">
        <h3 className="cart-item-title">{item.title}</h3>
        <div className="cart-item-price-info">
          <span className="cart-item-current-price">{formatPrice(currentPrice)}</span>
          {item.sale_percent > 0 && (
            <span className="cart-item-original-price">{formatPrice(item.price)}</span>
          )}
        </div>
      </div>

      <div className="cart-item-quantity-wrapper">
        <div className="cart-item-quantity">
          <button onClick={handleDecrease} disabled={item.quantity <= 1}>-</button>
          <input
            type="number"
            value={item.quantity}
            onChange={handleQuantityChange}
            min={1}
            max={item.stock_quantity}
          />
          <button onClick={handleIncrease} disabled={item.quantity >= item.stock_quantity}>+</button>
        </div>
        <p className="cart-item-stock">Còn lại: {item.stock_quantity}</p>
      </div>

      <div className="cart-item-total">
        {formatPrice(totalItemPrice)}
      </div>

      <div className="cart-item-actions">
        <button onClick={handleDelete} className="cart-item-delete-btn" aria-label="Xóa sản phẩm">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
