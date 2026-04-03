/**
 * Checkout Feature Types
 * Mapped strictly to DB schema
 */

// ─── Payment ──────────────────────────────────────────────────────────────────

export type PaymentMethodId = 'COD' | 'VNPAY' | 'MOMO' | 'CARD' | 'ATM' | 'ZALOPAY';

export type PaymentStatus = 'PENDING' | 'PAID';

// ─── Shipping ─────────────────────────────────────────────────────────────────

export type ShippingMethodType = 'DELIVERY' | 'PICKUP';

// ─── Address (maps to DB: address table) ─────────────────────────────────────

export interface CheckoutAddress {
  address_id: number;
  province: string;
  district: string;
  ward: string;
  detail_address: string;
  customer_name: string;
  customer_phone: string;
  is_default?: boolean;
}

// ─── Voucher (maps to DB: voucher table) ─────────────────────────────────────

export interface CheckoutVoucher {
  voucher_id: number;
  code: string;
  discount_value: number;
  max_discount_amount: number;
  min_order_value: number;
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
  order_id: number;
  total_amount: number;
  payment_url?: string;
}

export interface CalculateOrderResponse {
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
}

// ─── Internal UI State ────────────────────────────────────────────────────────

export interface CheckoutTotals {
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
}
