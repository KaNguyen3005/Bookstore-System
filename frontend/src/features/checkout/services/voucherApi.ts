import axiosClient from "../../../services/axiosClient";
import type { CheckoutVoucher } from "../types/index.ts";

const IS_MOCK = false;

const MOCK_VOUCHERS: CheckoutVoucher[] = [
  {
    voucherId: 1,
    voucherCode: "GIAM10K",
    title: "Giảm 10K",
    description: "Đơn từ 100K",
    type: "FIXED",
    discountValue: 10000,
    maxDiscountAmount: 10000,
    minOrderValue: 100000,
    totalLimit: 100,
    usedCount: 0,
    limitPerUser: 1,
    minPoint: 0,
    startDate: "2026-05-01T00:00:00.000Z",
    endDate: "2026-06-01T00:00:00.000Z",
    isActive: true,
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
  },

  {
    voucherId: 2,
    voucherCode: "GIAM50K",
    title: "Giảm 50K",
    description: "Đơn từ 300K",
    type: "FIXED",
    discountValue: 50000,
    maxDiscountAmount: 50000,
    minOrderValue: 300000,
    totalLimit: 100,
    usedCount: 0,
    limitPerUser: 1,
    minPoint: 0,
    startDate: "2026-05-01T00:00:00.000Z",
    endDate: "2026-06-01T00:00:00.000Z",
    isActive: true,
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
  },

  {
    voucherId: 3,
    voucherCode: "FREESHIP",
    title: "Free Ship",
    description: "Đơn từ 50K",
    type: "FIXED",
    discountValue: 30000,
    maxDiscountAmount: 30000,
    minOrderValue: 50000,
    totalLimit: 100,
    usedCount: 0,
    limitPerUser: 1,
    minPoint: 0,
    startDate: "2026-05-01T00:00:00.000Z",
    endDate: "2026-06-01T00:00:00.000Z",
    isActive: true,
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
  },
];


export const voucherApi = {
  // lấy toàn bộ voucher active
  getActiveVouchers: async (): Promise<CheckoutVoucher[]> => {
    if (IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_VOUCHERS);
        }, 500);
      });
    }

    const response = await axiosClient.get("/vouchers/active");

    return response.data.result;
  },

  // kiểm tra voucher theo code
  validateVoucher: async (code: string): Promise<CheckoutVoucher> => {
    if (IS_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const voucher = MOCK_VOUCHERS.find(
            (v) => v.voucherCode === code.trim().toUpperCase(),
          );

          if (!voucher) {
            reject(new Error("Mã giảm giá không tồn tại."));
          } else {
            resolve(voucher);
          }
        }, 500);
      });
    }

    const response = await axiosClient.get(`/vouchers/code/${code.trim()}`);

    return response.data.result;
  },
};
