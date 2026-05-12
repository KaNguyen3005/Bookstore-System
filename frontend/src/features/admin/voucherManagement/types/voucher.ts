export type VoucherStatus = "active" | "inactive" | "expired";

export type DiscountType = "freeship" | "percent" | "fixed";

export interface Voucher {
  id: string;

  code: string;

  title: string;

  description: string;

  discountType: DiscountType;

  value: number;

  minOrder: number;

  maxDiscount?: number;

  startDate: string;

  endDate: string;

  usageLimit: number;

  usedCount: number;

  status: VoucherStatus;

  // ================= EXTRA =================

  limitPerUser?: number;

  minPoint?: number;
}

export interface VoucherStats {
  total: number;

  active: number;

  used: number;

  expiringSoon: number;
}

// ================= API TYPES =================

export type VoucherApiType = "FIXED" | "PERCENTAGE";

// ================= CREATE REQUEST =================

export interface CreateVoucherRequest {
  voucherCode: string;

  title: string;

  description: string;

  type: VoucherApiType;

  discountValue: number;

  maxDiscountAmount: number;

  minOrderValue: number;

  totalLimit: number;

  limitPerUser: number;

  minPoint: number;

  startDate: string;

  endDate: string;
}

// ================= UPDATE REQUEST =================

export interface UpdateVoucherRequest {
  voucherCode?: string;

  title?: string;

  description?: string;

  type?: VoucherApiType;

  discountValue?: number;

  maxDiscountAmount?: number;

  minOrderValue?: number;

  totalLimit?: number;

  limitPerUser?: number;

  minPoint?: number;

  startDate?: string;

  endDate?: string;
}
