/**
 * Shared Payment Methods Mock Data
 * Used by checkout service
 */

import type { PaymentMethod } from '../features/cart/types/Payment';

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'cod',
    name: 'Thanh toán bằng tiền mặt khi nhận hàng',
    icon: 'https://cdn-icons-png.flaticon.com/512/2331/2331885.png',
  },
  {
    id: 'vnpay',
    name: 'VN PAY',
    icon: 'https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png',
  },
  {
    id: 'momo',
    name: 'Ví Momo',
    icon: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png',
  },
  {
    id: 'card',
    name: 'Visa/Master/JCB',
    icon: 'https://cdn-icons-png.flaticon.com/512/196/196578.png',
  },
  {
    id: 'atm',
    name: 'ATM/Internet banking',
    icon: 'https://cdn-icons-png.flaticon.com/512/3011/3011234.png',
  },
  {
    id: 'zalopay',
    name: 'Ví ZaloPay',
    icon: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png',
  },
];

export const getPaymentMethods = async () => {
  return Promise.resolve({ data: PAYMENT_METHODS });
};
