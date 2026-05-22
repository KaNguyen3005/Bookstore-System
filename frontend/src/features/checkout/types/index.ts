/**
 * Checkout Feature Types
 * Mapped strictly to DB schema
 */

// ─── Payment ──────────────────────────────────────────────────────────────────

export type PaymentMethodId =
  | "COD"
  | "VNPAY"

export type PaymentStatus = "PENDING" | "PAID";

// ─── Shipping ─────────────────────────────────────────────────────────────────

export type ShippingMethodType = "DELIVERY" | "PICKUP";

// ─── Address (maps to DB: address table) ─────────────────────────────────────
export interface CheckoutAddress {
  addressId: number;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  customerName: string;
  customerPhone: string;
  isDefault: boolean;
}

// ─── Voucher (maps to DB: voucher table) ─────────────────────────────────────

export interface CheckoutVoucher {
  voucherId: number;
  voucherCode: string;
  title: string;
  description: string;
  type: "FIXED" | "PERCENT";
  discountValue: number;
  maxDiscountAmount: number;
  minOrderValue: number;
  totalLimit: number;
  usedCount: number;
  limitPerUser: number;
  minPoint: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Order API Request/Response ───────────────────────────────────────────────

export interface OrderItem {
  book_id: number;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderRequest {
  customer_id: number;
  voucher_id?: number;
  shipping_method: ShippingMethodType;
  payment_method: PaymentMethodId;
  address: {
    province: string;
    district: string;
    ward: string;
    detail_address: string;
    customer_name: string;
    customer_phone: string;
  };
  items: OrderItem[];
}

export interface CreateOrderResponse {
  orderId: number;
}

export interface CalculateOrderResponse {
  subtotal: number;
  shippingFee: number;
  discount: number;
  shippingDiscount: number;
  total: number;
}

// ─── Internal UI State ────────────────────────────────────────────────────────

export interface CheckoutTotals {
  subtotal: number;
  shippingFee: number;
  discount: number;
  shippingDiscount: number;
  total: number;
}
