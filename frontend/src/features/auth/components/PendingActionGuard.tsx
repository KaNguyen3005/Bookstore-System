import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../../cart/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { type PendingAction } from '../hooks/useRequireAuth';
import { useToast } from '../../../shared/components/Toast/ToastProvider';

export const PendingActionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      const savedAction = sessionStorage.getItem('pendingAction');
      if (savedAction) {
        try {
          const action: PendingAction = JSON.parse(savedAction);

          // Execute based on type
          if (action.type === 'ADD_TO_CART') {
            addToCart(action.payload);
            showToast('Đã thêm vào giỏ hàng thành công!');
            console.log('Post-login: Executed pending ADD_TO_CART');
          } else if (action.type === 'BUY_NOW') {
            // Do NOT add to general cart
            navigate('/checkout', { state: { buyNowItem: action.payload } });
            console.log('Post-login: Executed pending BUY_NOW');
          } else if (action.type === 'CHECKOUT') {
            navigate('/checkout');
            console.log('Post-login: Executed pending CHECKOUT');
          }

          // Clear after execution
          sessionStorage.removeItem('pendingAction');
        } catch (e) {
          console.error('Failed to parse pending action', e);
        }
      }
    }
  }, [isAuthenticated, addToCart, navigate, showToast]);

  return <>{children}</>;
};
