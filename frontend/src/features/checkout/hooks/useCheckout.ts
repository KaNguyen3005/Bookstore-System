/**
 * useCheckout — Custom Hook
 * Manages all checkout state in one place.
 * Components only call actions — no business logic in JSX.
 */

import {
  useState,
  useMemo,
  useCallback,
} from "react";

import { useCart } from "../../cart/hooks/useCart";

import {
  calculateOrder,
  applyVoucher as applyVoucherService,
  createOrder as createOrderService,
} from "../services/checkoutService";

import type {
  ShippingMethodType,
  PaymentMethodId,
  CheckoutVoucher,
  CheckoutAddress,
  CheckoutTotals,
  CreateOrderResponse,
} from "../types";

import type { CartItemType } from "../../cart/types/cartItemType";

import { paymentApi } from "../services/paymentApi";
import { saveLocalOrderFallback } from "../../../services/orderApi";

interface UseCheckoutReturn {

  // =========================
  // STATE
  // =========================

  shippingMethod: ShippingMethodType;

  paymentMethod:
    PaymentMethodId | null;

  voucher:
    CheckoutVoucher | null;

  voucherCode: string;

  voucherError:
    string | null;

  voucherSuccess:
    string | null;

  selectedAddress:
    CheckoutAddress | null;

  selectedItems:
    CartItemType[];

  totals:
    CheckoutTotals;

  isSubmitting: boolean;

  isApplyingVoucher:
    boolean;

  orderError:
    string | null;

  // =========================
  // ACTIONS
  // =========================

  setShippingMethod:
    (
      method:
        ShippingMethodType
    ) => void;

  setPaymentMethod:
    (
      method:
        PaymentMethodId
    ) => void;

  setVoucherCode:
    (
      code: string
    ) => void;

  applyVoucherCode:
    (
      code?: string
    ) => Promise<void>;

  removeVoucher:
    () => void;

  setSelectedAddress:
    (
      address:
        CheckoutAddress
    ) => void;

  placeOrder:
    () => Promise<
      CreateOrderResponse | null
    >;

  // =========================
  // DERIVED
  // =========================

  canPlaceOrder: boolean;
}

export const useCheckout = (
  initialItems?: CartItemType[],
): UseCheckoutReturn => {

  const {
    selectedItems:
      cartSelectedItems,

    removePurchasedItems,
  } = useCart();

  // =========================
  // SELECTED ITEMS
  // =========================

  const selectedItems =
    useMemo(
      () =>
        initialItems ||
        cartSelectedItems,

      [
        initialItems,
        cartSelectedItems,
      ],
    );

  // =========================
  // STATE
  // =========================

  const [
    shippingMethod,
    setShippingMethod,
  ] =
    useState<ShippingMethodType>(
      "DELIVERY"
    );

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<
      PaymentMethodId | null
    >(null);

  const [
    voucher,
    setVoucher,
  ] =
    useState<
      CheckoutVoucher | null
    >(null);

  const [
    voucherCode,
    setVoucherCode,
  ] = useState("");

  const [
    voucherError,
    setVoucherError,
  ] =
    useState<string | null>(
      null
    );

  const [
    voucherSuccess,
    setVoucherSuccess,
  ] =
    useState<string | null>(
      null
    );

  const [
    selectedAddress,
    setSelectedAddress,
  ] =
    useState<
      CheckoutAddress | null
    >(null);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    isApplyingVoucher,
    setIsApplyingVoucher,
  ] = useState(false);

  const [
    orderError,
    setOrderError,
  ] =
    useState<string | null>(
      null
    );

  // =========================
  // TOTALS
  // =========================

  const totals:
    CheckoutTotals =
    useMemo(
      () =>
        calculateOrder(
          selectedItems,
          shippingMethod,
          voucher
        ),

      [
        selectedItems,
        shippingMethod,
        voucher,
      ],
    );

  // =========================
  // SHIPPING
  // =========================

  const handleSetShippingMethod =
    useCallback(
      (
        method:
          ShippingMethodType
      ) => {

        setShippingMethod(
          method
        );

      },
      [],
    );

  // =========================
  // PAYMENT
  // =========================

  const handleSetPaymentMethod =
    useCallback(
      (
        method:
          PaymentMethodId
      ) => {

        setPaymentMethod(
          method
        );

      },
      [],
    );

  // =========================
  // APPLY VOUCHER
  // =========================

  const handleApplyVoucher =
    useCallback(
      async (
        code?: string
      ) => {

        const targetCode =
          code || voucherCode;

        if (
          !targetCode.trim()
        ) {
          return;
        }

        setVoucherError(
          null
        );

        setVoucherSuccess(
          null
        );

        setIsApplyingVoucher(
          true
        );

        try {

          const applied =
            await applyVoucherService(
              targetCode,
              totals.subtotal
            );

          setVoucher(applied);

          setVoucherSuccess(
            `Áp dụng thành công! Giảm ${applied.discountValue.toLocaleString(
              "vi-VN"
            )}đ`
          );

          if (code) {
            setVoucherCode(
              code
            );
          }

        } catch (err) {

          const error =
            err as Error;

          setVoucherError(
            error.message
          );

          setVoucher(null);

        } finally {

          setIsApplyingVoucher(
            false
          );

        }
      },
      [
        voucherCode,
        totals.subtotal,
      ],
    );

  // =========================
  // REMOVE VOUCHER
  // =========================

  const handleRemoveVoucher =
    useCallback(() => {

      setVoucher(null);

      setVoucherCode("");

      setVoucherError(
        null
      );

      setVoucherSuccess(
        null
      );

    }, []);

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder =
    useCallback(
      async (): Promise<
        CreateOrderResponse | null
      > => {

        if (
          !paymentMethod ||
          !selectedAddress
        ) {
          return null;

        }
        console.log("here");

        setIsSubmitting(
          true
        );

        setOrderError(
          null
        );

        try {

          // =========================
          // CREATE ORDER PAYLOAD
          // =========================

          const orderPayload = {

            addressId:
              selectedAddress?.addressId,

            items:
              selectedItems.map(
                (item) => ({

                  bookId:
                    item.book.bookId,

                  quantity:
                    item.quantity,

                  note: "",

                })
              ),

            paymentMethod,

            voucherCode:
              voucher?.voucherCode ||
              "",
          };

          console.log(
            "ORDER PAYLOAD:",
            orderPayload
          );

          // =========================
          // CREATE ORDER
          // =========================
       
          const order =
            await createOrderService(
              orderPayload
            );
       

          if (
            !order?.orderId
          ) {
            console.log("create order 3");

            throw new Error(
              "Create order failed"
            );

          }

          saveLocalOrderFallback({
            order,
            items: selectedItems,
            totals,
            paymentMethod,
          });

          // =========================
          // COD FLOW
          // =========================

          if (
            paymentMethod ===
            "COD"
          ) {

            if (
              !initialItems
            ) {

              removePurchasedItems(
                selectedItems.map(
                  (item) =>
                    item.book.bookId
                )
              );

            }

            return order;
          }

          // =========================
          // VNPAY FLOW
          // =========================

          if (
            paymentMethod ===
            "VNPAY"
          ) {

            const paymentRes =
              await paymentApi.checkout(
                {
                  orderId:
                    order.orderId,

                  paymentMethod:
                    "VNPAY",
                }
              );
              console.log("paymentRes", paymentRes);

            const redirectUrl =
              paymentRes?.result
                ?.redirectUrl;

            if (
              !redirectUrl
            ) {

              throw new Error(
                "Không nhận được link thanh toán VNPay"
              );

            }

            // remove cart
            if (
              !initialItems
            ) {

              removePurchasedItems(
                selectedItems.map(
                  (item) =>
                    item.book.bookId
                )
              );

            }

            // redirect
            window.location.href =
              redirectUrl;

            return null;
          }

          return order;

        } catch (err) {

          const error =
            err as any;

          setOrderError(
            error?.response?.data?.message ||
              error?.response?.data?.error ||
              error.message ||
              "Đặt hàng thất bại"
          );

          return null;

        } finally {

          setIsSubmitting(
            false
          );

        }
      },
      [
        paymentMethod,
        selectedAddress,
        selectedItems,
        voucher,
        removePurchasedItems,
        initialItems,
      ],
    );

  // =========================
  // CAN PLACE ORDER
  // =========================

  const canPlaceOrder =

    !!paymentMethod &&

    !!selectedAddress &&

    selectedItems.length > 0 &&

    !isSubmitting;

  return {

    shippingMethod,

    paymentMethod,

    voucher,

    voucherCode,

    voucherError,

    voucherSuccess,

    selectedAddress,

    selectedItems,

    totals,

    isSubmitting,

    isApplyingVoucher,

    orderError,

    setShippingMethod:
      handleSetShippingMethod,

    setPaymentMethod:
      handleSetPaymentMethod,

    setVoucherCode,

    applyVoucherCode:
      handleApplyVoucher,

    removeVoucher:
      handleRemoveVoucher,

    setSelectedAddress,

    placeOrder:
      handlePlaceOrder,

    canPlaceOrder,
  };
};
