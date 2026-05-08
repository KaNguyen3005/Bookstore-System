/**
 * Checkout Service
 * All business logic lives here — NO logic in components.
 * Coordinates between UI state and API Layer.
 */

import { voucherApi } from "./voucherApi";
import checkoutApi from "./checkoutApi";
import type { CartItemType } from "../../cart/types/cartItemType";
import type {
  CheckoutVoucher,
  CreateOrderResponse,
  CalculateOrderResponse,
  ShippingMethodType,
} from "../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const SHIPPING_FEE_DELIVERY = 30_000;
const SHIPPING_FEE_PICKUP = 0;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getItemPrice = (item: CartItemType): number =>
  item.book.price * (1 - item.book.salePercent / 100);

const calcSubtotal = (items: CartItemType[]): number =>
  items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

const calcShippingFee = (method: ShippingMethodType): number =>
  method === "DELIVERY" ? SHIPPING_FEE_DELIVERY : SHIPPING_FEE_PICKUP;

const calcDiscount = (
  subtotal: number,
  voucher: CheckoutVoucher | null,
): number => {
  if (!voucher) return 0;
  if (subtotal < voucher.min_order_value) return 0;
  return Math.min(voucher.discount_value, voucher.max_discount_amount);
};

// ─── calculateOrder ───────────────────────────────────────────────────────────

export const calculateOrder = (
  items: CartItemType[],
  shippingMethod: ShippingMethodType,
  voucher: CheckoutVoucher | null,
): CalculateOrderResponse => {
  const subtotal = calcSubtotal(items);
  const shipping_fee = calcShippingFee(shippingMethod);
  const discount = calcDiscount(subtotal, voucher);
  const total = subtotal - discount + shipping_fee;

  return { subtotal, shipping_fee, discount, total };
};

// ─── applyVoucher ─────────────────────────────────────────────────────────────

/**
 * Validate & apply voucher code.
 * Coordinates with voucherApi to fetch voucher data.
 */
export const applyVoucher = async (
  code: string,
  subtotal: number,
): Promise<CheckoutVoucher> => {
  try {
    const voucher = await voucherApi.validateVoucher(code);

    if (subtotal < voucher.min_order_value) {
      throw new Error(
        `Đơn hàng tối thiểu ${voucher.min_order_value.toLocaleString("vi-VN")}đ để áp dụng voucher này.`,
      );
    }

    return voucher;
  } catch (error) {
    throw error;
  }
};

// ─── createOrder ──────────────────────────────────────────────────────────────

/**
 * Submit order to backend.
 * Maps UI request format and coordinates with checkoutApi.
 */
export const createOrder = async (
  payload: any,
): Promise<CreateOrderResponse> => {
  try {
    // 1. Map to Backend Format:
    const mappedPayload = {
      source: "WEBSITE",

      address: {
        province: payload.address.province,
        district: payload.address.district,
        ward: payload.address.ward,

        detailAddress: payload.address.detailAddress,

        customerName: payload.address.customerName,

        customerPhone: payload.address.customerPhone,
      },

      items: payload.items.map((item: any) => ({
        bookId: item.bookId || item.book_id,
        quantity: item.quantity,
      })),

      paymentMethod: payload.paymentMethod || payload.payment_method,

      voucherCode: payload.voucherCode || "",
    };

    // 2. Call the API layer
    return checkoutApi.createOrder(mappedPayload);
  } catch (error) {
    throw error;
  }
};
