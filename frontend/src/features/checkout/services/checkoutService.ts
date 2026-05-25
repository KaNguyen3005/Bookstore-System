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
const VAT_RATE = 0.05;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getItemPrice = (item: CartItemType): number => item.book.price;

const calcSubtotal = (items: CartItemType[]): number =>
  items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

const calcShippingFee = (method: ShippingMethodType): number =>
  method === "DELIVERY" ? SHIPPING_FEE_DELIVERY : SHIPPING_FEE_PICKUP;

const normalizeMoney = (value?: number | null): number =>
  Number.isFinite(value) ? Number(value) : 0;

const calcVoucherDiscount = (
  subtotal: number,
  voucher: CheckoutVoucher,
): number => {
  if (voucher.type === "PERCENTAGE") {
    const rawDiscount = subtotal * (normalizeMoney(voucher.discountValue) / 100);
    const maxDiscount = normalizeMoney(voucher.maxDiscountAmount);

    return maxDiscount > 0 ? Math.min(rawDiscount, maxDiscount) : rawDiscount;
  }

  return Math.min(normalizeMoney(voucher.discountValue), subtotal);
};

// ─── calculateOrder ───────────────────────────────────────────────────────────

export const calculateOrder = (
  items: CartItemType[],
  shippingMethod: ShippingMethodType,
  voucher: CheckoutVoucher | null,
): CalculateOrderResponse => {
  const subtotal = calcSubtotal(items);
  const shippingFee = calcShippingFee(shippingMethod);
  
  let discount = 0;
  let shippingDiscount = 0;

  if (voucher && subtotal >= voucher.minOrderValue) {
    const isFreeship = voucher.voucherCode.toLowerCase().includes("freeship");
    const calcVal = calcVoucherDiscount(subtotal, voucher);

    if (isFreeship) {
      shippingDiscount = Math.min(calcVal, shippingFee);
    } else {
      discount = Math.min(calcVal, subtotal);
    }
  }

  const amountAfterDiscount = Math.max(subtotal - discount, 0);
  const vat = Math.ceil(amountAfterDiscount * VAT_RATE);
  const total =
    amountAfterDiscount + vat + Math.max(shippingFee - shippingDiscount, 0);

  return { subtotal, vat, shippingFee, discount, shippingDiscount, total };
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

    if (subtotal < voucher.minOrderValue) {
      throw new Error(
        `Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString("vi-VN")}đ để áp dụng voucher này.`,
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

      addressId: payload.addressId,
      shippingAddressId: payload.addressId,

      items: payload.items.map((item: any) => ({
        bookId: item.bookId || item.book_id,
        quantity: item.quantity,
      })),

      paymentMethod:
        (payload.paymentMethod || payload.payment_method) === "VNPAY"
          ? "VNPAY"
          : payload.paymentMethod || payload.payment_method,

      voucherCode: payload.voucherCode || "",
    };

    // 2. Call the API layer
    return checkoutApi.createOrder(mappedPayload);
  } catch (error) {
    throw error;
  }
};
