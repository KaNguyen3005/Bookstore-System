import axiosClient from '../../../../services/axiosClient';
import type { Voucher, VoucherStats } from '../types/voucher';
import { mockVouchers } from '../data/mockVouchers';

const IS_MOCK = true;

export const voucherService = {
  getVouchers: async (): Promise<Voucher[]> => {
    if (IS_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockVouchers;
    }
    const response = await axiosClient.get('/admin/vouchers');
    return response as unknown as Voucher[];
  },

  getStats: async (vouchers: Voucher[]): Promise<VoucherStats> => {
    if (IS_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const parseDate = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day);
      };

      return {
        total: vouchers.length,
        active: vouchers.filter((v) => v.status === 'active').length,
        used: vouchers.reduce((sum, v) => sum + v.usedCount, 0),
        expiringSoon: vouchers.filter((v) => {
          const endDate = parseDate(v.endDate);
          return v.status === 'active' && endDate <= sevenDaysFromNow && endDate >= now;
        }).length,
      };
    }
    const response = await axiosClient.get('/admin/vouchers/stats');
    return response as unknown as VoucherStats;
  },

  createVoucher: async (voucher: Omit<Voucher, 'id'>): Promise<Voucher> => {
    if (IS_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { ...voucher, id: `V${Date.now()}` };
    }
    const response = await axiosClient.post('/admin/vouchers', voucher);
    return response as unknown as Voucher;
  },

  deleteVoucher: async (id: string): Promise<void> => {
    if (IS_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return;
    }
    await axiosClient.delete(`/admin/vouchers/${id}`);
  },
};

export default voucherService;
