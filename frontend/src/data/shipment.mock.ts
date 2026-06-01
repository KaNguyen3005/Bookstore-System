/**
 * Shared Shipping Methods and Address Mock Data
 * Used by checkout service
 */

import type { ShippingMethod, CheckoutAddress } from '../features/cart/types/Shipping';

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'fast',
    name: 'Nhanh',
    price: 30000,
    description: 'Vận chuyển trong nội thành Tp.HCM. Sẽ giao hàng trong ngày.',
    freeLabel: 'Miễn phí',
  },
  {
    id: 'locker',
    name: 'Tủ nhận hàng',
    price: 30000,
    description:
      'Nhận tại tủ locker thông minh. Thời gian nhận từ 1 Th01 - 5 Th01.',
    freeLabel: 'Miễn phí',
  },
];

export const MOCK_ADDRESS: CheckoutAddress = {
  fullname: 'Ngọc Thi',
  phone: '0702509305',
  detail: '97 Man Thiện, Thủ Đức, TPHCM',
  ward: 'Phường 9',
  district: 'Quận 3',
  city: 'TP. Hồ Chí Minh',
  isDefault: true,
};

export const getShippingMethods = async () => {
  return Promise.resolve({ data: SHIPPING_METHODS });
};

export const getAddress = async () => {
  return Promise.resolve({ data: MOCK_ADDRESS });
};
