/**
 * Voucher Types - Cart Feature
 */

export interface Voucher {
  code: string;
  discountAmount: number;
  minOrderValue: number;
  description: string;
}
