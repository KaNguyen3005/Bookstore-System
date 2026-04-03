import { useCart } from './useCart';
import { useRequireAuth } from '../../auth/hooks/useRequireAuth';
import { useNavigate } from 'react-router-dom';
import type { CartItemType } from '../context/CartContext';

export const useCartActions = () => {
  const { addToCart } = useCart();
  const { handleProtectedAction } = useRequireAuth();
  const navigate = useNavigate();

  const onAddToCart = (item: CartItemType) => {
    handleProtectedAction(() => {
      addToCart(item);
      // No alert here as per PR requirement
      console.log('Product added to cart');
    }, { type: 'ADD_TO_CART', payload: item });
  };

  const onBuyNow = (item: CartItemType) => {
    handleProtectedAction(() => {
      // Navigate to checkout with the item in navigation state
      // This bypasses the persistent CartContext.selectedItems
      navigate('/checkout', { state: { buyNowItem: item } });
    }, { type: 'BUY_NOW', payload: item });
  };

  return { onAddToCart, onBuyNow };
};
