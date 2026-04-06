import axiosClient from '../../../services/axiosClient';
import type { CheckoutVoucher } from '../types';

const IS_MOCK = true;

const MOCK_VOUCHERS: CheckoutVoucher[] = [
  { voucher_id: 1, code: 'GIAM10K', discount_value: 10_000, max_discount_amount: 10_000, min_order_value: 100_000 },
  { voucher_id: 2, code: 'GIAM50K', discount_value: 50_000, max_discount_amount: 50_000, min_order_value: 300_000 },
  { voucher_id: 3, code: 'FREESHIP', discount_value: 30_000, max_discount_amount: 30_000, min_order_value: 50_000 },
];

export const voucherApi = {
  validateVoucher: async (code: string): Promise<CheckoutVoucher> => {
    if (IS_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const voucher = MOCK_VOUCHERS.find((v) => v.code === code.trim().toUpperCase());
          if (!voucher) {
            reject(new Error('Mã giảm giá không tồn tại.'));
          } else {
            resolve(voucher);
          }
        }, 500);
      });
    }
    return axiosClient.post('/vouchers/validate', { code });
  }
};
