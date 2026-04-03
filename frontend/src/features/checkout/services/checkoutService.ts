/**
 * Checkout Service
 * All business logic lives here — NO logic in components.
 * TODO: Replace mock responses with real API calls (axios/fetch).
 */

import type { CartItemType } from '../../cart/context/CartContext';
import type {
  CheckoutVoucher,
  CreateOrderRequest,
  CreateOrderResponse,
  CalculateOrderResponse,
  ShippingMethodType,
} from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const SHIPPING_FEE_DELIVERY = 30_000;
const SHIPPING_FEE_PICKUP = 0;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getItemPrice = (item: CartItemType): number =>
  item.price * (1 - item.sale_percent / 100);

const calcSubtotal = (items: CartItemType[]): number =>
  items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

const calcShippingFee = (method: ShippingMethodType): number =>
  method === 'DELIVERY' ? SHIPPING_FEE_DELIVERY : SHIPPING_FEE_PICKUP;

const calcDiscount = (
  subtotal: number,
  voucher: CheckoutVoucher | null
): number => {
  if (!voucher) return 0;
  if (subtotal < voucher.min_order_value) return 0;
  return Math.min(voucher.discount_value, voucher.max_discount_amount);
};

// ─── calculateOrder ───────────────────────────────────────────────────────────

export const calculateOrder = (
  items: CartItemType[],
  shippingMethod: ShippingMethodType,
  voucher: CheckoutVoucher | null
): CalculateOrderResponse => {
  const subtotal = calcSubtotal(items);
  const shipping_fee = calcShippingFee(shippingMethod);
  const discount = calcDiscount(subtotal, voucher);
  const total = subtotal - discount + shipping_fee;

  return { subtotal, shipping_fee, discount, total };
};

// ─── applyVoucher ─────────────────────────────────────────────────────────────

/**
 * Validate & apply voucher code.
 * Returns voucher object if valid, throws error string if not.
 * TODO: Replace with real API call: POST /api/vouchers/validate
 */
export const applyVoucher = async (
  code: string,
  subtotal: number
): Promise<CheckoutVoucher> => {
  try {
    // Mock voucher database
    const MOCK_VOUCHERS: CheckoutVoucher[] = [
      {
        voucher_id: 1,
        code: 'GIAM10K',
        discount_value: 10_000,
        max_discount_amount: 10_000,
        min_order_value: 100_000,
      },
      {
        voucher_id: 2,
        code: 'GIAM50K',
        discount_value: 50_000,
        max_discount_amount: 50_000,
        min_order_value: 300_000,
      },
      {
        voucher_id: 3,
        code: 'FREESHIP',
        discount_value: 30_000,
        max_discount_amount: 30_000,
        min_order_value: 50_000,
      },
    ];

    const voucher = MOCK_VOUCHERS.find(
      (v) => v.code === code.trim().toUpperCase()
    );

    if (!voucher) {
      throw new Error('Mã giảm giá không tồn tại.');
    }

    if (subtotal < voucher.min_order_value) {
      throw new Error(
        `Đơn hàng tối thiểu ${voucher.min_order_value.toLocaleString('vi-VN')}đ để áp dụng voucher này.`
      );
    }

    return Promise.resolve(voucher);
  } catch (error) {
    throw error;
  }
};

// ─── createOrder ──────────────────────────────────────────────────────────────

/**
 * Submit order to backend.
 * TODO: Replace mock with: POST /api/orders
 */
export const createOrder = async (
  payload: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const mockResponse: CreateOrderResponse = {
      order_id: Math.floor(Math.random() * 900_000) + 100_000,
      total_amount:
        payload.items.reduce(
          (sum, item) => sum + item.unit_price * item.quantity,
          0
        ),
      payment_url:
        payload.payment_method !== 'COD'
          ? `https://payment.example.com/pay?order=${Date.now()}`
          : undefined,
    };

    return mockResponse;
  } catch (error) {
    throw error;
  }
};
