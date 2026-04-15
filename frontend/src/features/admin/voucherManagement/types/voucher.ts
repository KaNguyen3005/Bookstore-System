export type VoucherStatus = 'active' | 'inactive' | 'expired';
export type DiscountType = 'freeship' | 'percent' | 'fixed';

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
}

export interface VoucherStats {
  total: number;
  active: number;
  used: number;         // Total usedCount across all vouchers
  expiringSoon: number; // Expires within 7 days
}
