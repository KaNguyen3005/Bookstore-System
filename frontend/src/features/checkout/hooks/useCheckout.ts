/**
 * useCheckout — Custom Hook
 * Manages all checkout state in one place.
 * Components only call actions — no business logic in JSX.
 */

import { useState, useMemo, useCallback } from 'react';
import { useCart } from '../../cart/hooks/useCart';
import {
  calculateOrder,
  applyVoucher as applyVoucherService,
  createOrder as createOrderService,
} from '../services/checkoutService';
// import { orderApi } from '../../../services/orderApi'; // Using checkoutService instead
import type {
  ShippingMethodType,
  PaymentMethodId,
  CheckoutVoucher,
  CheckoutAddress,
  CheckoutTotals,
  CreateOrderResponse,
} from '../types';
import type { CartItemType } from '../../cart/context/CartContext';

interface UseCheckoutReturn {
  // State
  shippingMethod: ShippingMethodType;
  paymentMethod: PaymentMethodId | null;
  voucher: CheckoutVoucher | null;
  voucherCode: string;
  voucherError: string | null;
  voucherSuccess: string | null;
  selectedAddress: CheckoutAddress | null;
  selectedItems: CartItemType[];
  totals: CheckoutTotals;
  isSubmitting: boolean;
  isApplyingVoucher: boolean;
  orderError: string | null;

  // Actions
  setShippingMethod: (method: ShippingMethodType) => void;
  setPaymentMethod: (method: PaymentMethodId) => void;
  setVoucherCode: (code: string) => void;
  applyVoucherCode: () => Promise<void>;
  removeVoucher: () => void;
  setSelectedAddress: (address: CheckoutAddress) => void;
  placeOrder: () => Promise<CreateOrderResponse | null>;

  // Derived
  canPlaceOrder: boolean;
}

export const useCheckout = (initialItems?: CartItemType[]): UseCheckoutReturn => {
  const { selectedItems: cartSelectedItems, clearCart } = useCart();

  // If initialItems are provided (e.g. from Buy Now), use them. Otherwise use selectedItems from cart.
  const selectedItems = useMemo(() => initialItems || cartSelectedItems, [initialItems, cartSelectedItems]);

  // ── State ────────────────────────────────────────────────────────────────────
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethodType>('DELIVERY');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodId | null>(null);
  const [voucher, setVoucher] = useState<CheckoutVoucher | null>(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] =
    useState<CheckoutAddress | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // ── Derived Totals ───────────────────────────────────────────────────────────
  const totals: CheckoutTotals = useMemo(
    () => calculateOrder(selectedItems, shippingMethod, voucher),
    [selectedItems, shippingMethod, voucher]
  );

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleSetShippingMethod = useCallback(
    (method: ShippingMethodType) => {
      setShippingMethod(method);
    },
    []
  );

  const handleSetPaymentMethod = useCallback((method: PaymentMethodId) => {
    setPaymentMethod(method);
  }, []);

  const handleApplyVoucher = useCallback(async () => {
    if (!voucherCode.trim()) return;
    setVoucherError(null);
    setVoucherSuccess(null);
    setIsApplyingVoucher(true);

    try {
      const applied = await applyVoucherService(voucherCode, totals.subtotal);
      setVoucher(applied);
      setVoucherSuccess(`Áp dụng thành công! Giảm ${applied.discount_value.toLocaleString('vi-VN')}đ`);
    } catch (err) {
      const error = err as Error;
      setVoucherError(error.message);
      setVoucher(null);
    } finally {
      setIsApplyingVoucher(false);
    }
  }, [voucherCode, totals.subtotal]);

  const handleRemoveVoucher = useCallback(() => {
    setVoucher(null);
    setVoucherCode('');
    setVoucherError(null);
    setVoucherSuccess(null);
  }, []);

  const handlePlaceOrder = useCallback(async (): Promise<CreateOrderResponse | null> => {
    if (!paymentMethod || !selectedAddress) return null;

    setIsSubmitting(true);
    setOrderError(null);

    try {
      // Map UI state to the new Backend format:
      // { source: string, addressId: number, items: [{ bookId: number, quantity: number }], paymentMethod: string, voucherCode: string }
      const payload = {
        addressId: selectedAddress.address_id,
        items: selectedItems.map((item) => ({
          bookId: item.book_id,
          quantity: item.quantity,
        })),
        paymentMethod: paymentMethod,
        voucherCode: voucher?.code || '',
      };

      const response = await createOrderService(payload);

      // Backend returns { orderId } on success.
      if (response && response.orderId) {
        // Only clear cart if the order was placed from the general cart flow
        if (!initialItems) {
          clearCart();
        }
        return response;
      }
      return null;
    } catch (err) {
      const error = err as Error;
      setOrderError(error.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [paymentMethod, selectedAddress, selectedItems, voucher, clearCart, initialItems]);

  const canPlaceOrder =
    !!paymentMethod && !!selectedAddress && selectedItems.length > 0 && !isSubmitting;

  return {
    shippingMethod,
    paymentMethod,
    voucher,
    voucherCode,
    voucherError,
    voucherSuccess,
    selectedAddress,
    selectedItems,
    totals,
    isSubmitting,
    isApplyingVoucher,
    orderError,
    setShippingMethod: handleSetShippingMethod,
    setPaymentMethod: handleSetPaymentMethod,
    setVoucherCode,
    applyVoucherCode: handleApplyVoucher,
    removeVoucher: handleRemoveVoucher,
    setSelectedAddress,
    placeOrder: handlePlaceOrder,
    canPlaceOrder,
  };
};
