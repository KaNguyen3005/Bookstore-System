/**
 * Shared Payment Methods Mock Data
 * Used by checkout service
 */

import type { PaymentMethod } from '../features/cart/types/Payment';

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'cod',
    name: 'Thanh toán bằng COD khi nhận hàng',
    icon: 'https://cdn-icons-png.flaticon.com/512/2331/2331885.png',
  },
  {
    id: 'vnpay',
    name: 'VN PAY',
    icon: 'https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png',
  },
];

export const getPaymentMethods = async () => {
  return Promise.resolve({ data: PAYMENT_METHODS });
};
