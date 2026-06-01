/**
 * Shared Voucher Mock Data
 * Used by order service
 */

import type { Voucher } from '../features/cart/types/Voucher';

export const getMockVoucher = (code: string): Voucher => ({
  code: code,
  discountAmount: 10000,
  minOrderValue: 100000,
  description: 'Giảm 10k',
});

export const getVoucher = async (code: string) => {
  const voucher = getMockVoucher(code);
  return Promise.resolve({ data: voucher });
};
