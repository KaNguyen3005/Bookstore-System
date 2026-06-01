import React from 'react';
import { useCart } from '../hooks/useCart';
import type{ CartItemType } from '../types/cartItemType';
import { FaTrash } from 'react-icons/fa';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { toggleSelect, updateQuantity, removeItem } = useCart();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.book.bookId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < item.book.stockQuantity) {
      updateQuantity(item.book.bookId, item.quantity + 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= item.book.stockQuantity) {
      updateQuantity(item.book.bookId, value);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      removeItem(item.book.bookId);
    }
  };

  const totalItemPrice = item.book.price * item.quantity;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className={`cart-item ${item.selected ? 'selected' : ''}`}>
      <div className="cart-item-checkbox">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => toggleSelect(item.book.bookId)}
        />
      </div>

      <div className="cart-item-image">
        <img src={item.book.coverImgUrl} alt={item.book.title} />
      </div>

      <div className="cart-item-details">
        <h3 className="cart-item-title">{item.book.title}</h3>
        <div className="cart-item-price-info">
          <span className="cart-item-current-price">
            {formatPrice(item.book.price)}
          </span>
        </div>
      </div>

      <div className="cart-item-quantity-wrapper">
        <div className="cart-item-quantity">
          <button onClick={handleDecrease} disabled={item.quantity <= 1}>
            -
          </button>

          <input
            type="number"
            value={item.quantity}
            onChange={handleQuantityChange}
            min={1}
            max={item.book.stockQuantity}
          />

          <button
            onClick={handleIncrease}
            disabled={item.quantity >= item.book.stockQuantity}
          >
            +
          </button>
        </div>

        <p className="cart-item-stock">
          Còn lại: {item.book.stockQuantity}
        </p>
      </div>

      <div className="cart-item-total">
        {formatPrice(totalItemPrice)}
      </div>

      <div className="cart-item-actions">
        <button
          onClick={handleDelete}
          className="cart-item-delete-btn"
          aria-label="Xóa sản phẩm"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
