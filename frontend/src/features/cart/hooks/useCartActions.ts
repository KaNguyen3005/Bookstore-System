import { useCart } from './useCart';
import { useRequireAuth } from '../../auth/hooks/useRequireAuth';
import { useNavigate } from 'react-router-dom';
import type { CartItemType } from '../types/cartItemType';
import { useToast } from '../../../shared/components/Toast/ToastProvider';

export const useCartActions = () => {
  const { addToCart } = useCart();
  const { handleProtectedAction } = useRequireAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const onAddToCart = (item: CartItemType) => {
    handleProtectedAction(() => {
      addToCart(item);
      showToast('Đã thêm vào giỏ hàng thành công!');
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
