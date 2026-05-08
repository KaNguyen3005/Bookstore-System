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
  if (subtotal < voucher.minOrderValue) return 0;
  return Math.min(voucher.discountValue, voucher.maxDiscountAmount);
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
    
    let calcVal = 0;
    if (voucher.type === "PERCENT") {
      calcVal = subtotal * (voucher.discountValue / 100);
      if (voucher.maxDiscountAmount > 0) {
        calcVal = Math.min(calcVal, voucher.maxDiscountAmount);
      }
    } else {
      calcVal = voucher.discountValue;
    }

    if (isFreeship) {
      shippingDiscount = Math.min(calcVal, shippingFee);
    } else {
      discount = calcVal;
    }
  }

  const total = subtotal - discount + (shippingFee - shippingDiscount);

  return { subtotal, shippingFee, discount, shippingDiscount, total };
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
