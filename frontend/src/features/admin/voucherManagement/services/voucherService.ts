import axiosClient from "../../../../services/axiosClient";
import type { Voucher, VoucherStats } from "../types/voucher";

const IS_MOCK = false;

const mapVoucher = (item: any): Voucher => ({
  id: String(item.voucherId),
  code: item.voucherCode,
  title: item.title,
  description: item.description,
  discountType:
    item.type === "PERCENTAGE"
      ? "percent"
      : item.type === "FIXED"
        ? "fixed"
        : "freeship",
  value: item.discountValue,
  minOrder: item.minOrderValue,
  maxDiscount: item.maxDiscountAmount || undefined,
  startDate: item.startDate,
  endDate: item.endDate,
  usageLimit: item.totalLimit,
  usedCount: item.usedCount,
  status: item.isActive ? "active" : "inactive",
});

export const voucherService = {
  // ================= GET ALL =================
  getVouchers: async (): Promise<Voucher[]> => {
    const res = await axiosClient.get("/vouchers");
    const items = res.data.result || [];
    return items.map(mapVoucher);
  },

  // ================= ACTIVE =================
  getActiveVouchers: async (): Promise<Voucher[]> => {
    const res = await axiosClient.get("/vouchers/active");
    const items = res.data.result || [];
    return items.map(mapVoucher);
  },

  // ================= INACTIVE (NEW) =================
  getInactiveVouchers: async (): Promise<Voucher[]> => {
    const res = await axiosClient.get("/vouchers/inactive");
    const items = res.data.result || [];
    return items.map(mapVoucher);
  },

  // ================= GET BY ID =================
  getVoucherById: async (id: string): Promise<Voucher> => {
    const res = await axiosClient.get(`/vouchers/${id}`);
    return mapVoucher(res.data.result);
  },

  // ================= GET BY CODE =================
  getVoucherByCode: async (code: string): Promise<Voucher> => {
    const res = await axiosClient.get(`/vouchers/code/${code}`);
    return mapVoucher(res.data.result);
  },

  // ================= CREATE =================
  createVoucher: async (voucher: Omit<Voucher, "id">): Promise<Voucher> => {
    const res = await axiosClient.post("/vouchers", voucher);
    return mapVoucher(res.data.result);
  },

  // ================= UPDATE =================
  updateVoucher: async (
    id: string,
    data: Partial<Voucher>,
  ): Promise<Voucher> => {
    const res = await axiosClient.patch(`/vouchers/${id}`, data);
    return mapVoucher(res.data.result);
  },

  // ================= DELETE =================
  deleteVoucher: async (id: string): Promise<void> => {
    await axiosClient.delete(`/vouchers/${id}`);
  },

  // ================= STATS =================
  getStats: async (vouchers: Voucher[]): Promise<VoucherStats> => {
    const total = vouchers.length;
    const active = vouchers.filter((v) => v.status === "active").length;
    const used = vouchers.reduce((sum, v) => sum + v.usedCount, 0);

    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    const expiringSoon = vouchers.filter((v) => {
      if (v.status !== "active") return false;
      const end = new Date(v.endDate);
      return end > now && end <= sevenDaysLater;
    }).length;

    return {
      total,
      active,
      used,
      expiringSoon,
    };
  },
};
