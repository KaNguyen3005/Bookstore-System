import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../../../auth/hooks/useAuth";

import type {
  CheckoutAddress,
  CheckoutVoucher,
} from "../../types";

import { useCheckout } from "../../hooks/useCheckout";
import { useAddressLogic } from "../../hooks/useAddressLogic";

import { voucherApi } from "../../services/voucherApi";

import CheckoutCartItem from "../../components/CheckoutCartItem/CheckoutCartItem";
import ShippingMethod from "../../components/ShippingMethod/ShippingMethod";
import PaymentMethod from "../../components/PaymentMethod/PaymentMethod";
import AddressCard from "../../components/AddressCard/AddressCard";
import VoucherInput from "../../components/VoucherInput/VoucherInput";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import AddressModal from "../../components/AddressModal/AddressModal";
import VoucherModal from "../../components/VoucherModal/VoucherModal";

import "./CheckoutPage.css";

const CheckoutPage: React.FC = () => {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const buyNowItem =
    location.state?.buyNowItem;

  const checkoutItems =
    location.state?.selectedItems || [];

  const { user } =
    useAuth();

  const {
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
    setShippingMethod,
    setPaymentMethod,
    setVoucherCode,
    applyVoucherCode,
    removeVoucher,
    setSelectedAddress,
    placeOrder,
    canPlaceOrder,
  } = useCheckout(
    buyNowItem
      ? [buyNowItem]
      : checkoutItems
  );

  // =========================
  // ADDRESS
  // =========================

  const handleDefaultAddressFound =
    useCallback(
      (
        addr: CheckoutAddress
      ) => {

        setSelectedAddress(
          addr
        );

      },
      [setSelectedAddress]
    );

  useAddressLogic(
    handleDefaultAddressFound
  );

  // =========================
  // MODAL STATE
  // =========================

  const [
    isAddressModalOpen,
    setIsAddressModalOpen,
  ] = useState(false);

  const [
    isVoucherModalOpen,
    setIsVoucherModalOpen,
  ] = useState(false);

  const [
    voucherList,
    setVoucherList,
  ] = useState<
    CheckoutVoucher[]
  >([]);

  const [
    loadingVouchers,
    setLoadingVouchers,
  ] = useState(false);

  // =========================
  // ORDER COMPLETED
  // =========================

  const [
    isOrderCompleted,
    setIsOrderCompleted,
  ] = useState(false);

  // =========================
  // VOUCHER
  // =========================

  const handleOpenVoucherList =
    async () => {

      setIsVoucherModalOpen(
        true
      );

      setLoadingVouchers(
        true
      );

      try {

        const data =
          await voucherApi.getActiveVouchers();

        setVoucherList(data);

      } catch (err) {

        console.error(
          "Load vouchers failed:",
          err
        );

      } finally {

        setLoadingVouchers(
          false
        );

      }
    };

  const handleSelectVoucher =
    async (
      v: CheckoutVoucher
    ) => {

      setIsVoucherModalOpen(
        false
      );

      await applyVoucherCode(
        v.voucherCode
      );
    };

  // =========================
  // REDIRECT CART
  // =========================

  useEffect(() => {

    if (
      selectedItems.length === 0 &&
      !isSubmitting &&
      !isOrderCompleted
    ) {

      navigate("/cart");

    }

  }, [
    selectedItems,
    navigate,
    isSubmitting,
    isOrderCompleted,
  ]);

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder =
    async () => {
      const result =
        await placeOrder();
      // =========================
      // COD SUCCESS
      // =========================

      if (
        result &&
        paymentMethod === "COD"
      ) {

        setIsOrderCompleted(
          true
        );

        navigate(
          `/order-success?orderId=${result.orderId}`
        );
      }

      // =========================
      // VNPAY
      // =========================
      // redirect handled inside useCheckout
    };

  // =========================
  // UI
  // =========================

  return (

    <main className="checkout-page">

      <div className="checkout-page__container">

        <h1 className="checkout-page__title">
          Trang thanh toán
        </h1>

        <div className="checkout-page__layout">

          {/* LEFT */}

          <div className="checkout-page__left">

            <section className="checkout-section">

              <h2 className="checkout-section__title">
                Kiểm tra đơn hàng
              </h2>

              <div className="checkout-items__list">

                {selectedItems.map(
                  (item: any) => (

                    <CheckoutCartItem
                      key={
                        item.book
                          .bookId
                      }
                      item={item}
                    />

                  )
                )}

              </div>

            </section>

            <section className="checkout-section">

              <ShippingMethod
                selected={
                  shippingMethod
                }
                onChange={
                  setShippingMethod
                }
              />

            </section>

            <section className="checkout-section">

              <PaymentMethod
                selected={
                  paymentMethod
                }
                onChange={
                  setPaymentMethod
                }
              />

            </section>

          </div>

          {/* RIGHT */}

          <div className="checkout-page__right">

            <AddressCard
              address={
                selectedAddress
              }
              onChangeAddress={() =>
                setIsAddressModalOpen(
                  true
                )
              }
            />

            <VoucherInput
              code={voucherCode}
              appliedVoucher={
                voucher
              }
              error={
                voucherError
              }
              success={
                voucherSuccess
              }
              isLoading={
                isApplyingVoucher
              }
              onChange={
                setVoucherCode
              }
              onApply={
                applyVoucherCode
              }
              onRemove={
                removeVoucher
              }
              onOpenVoucherList={
                handleOpenVoucherList
              }
            />

            <OrderSummary
              totals={totals}
              itemCount={
                selectedItems.length
              }
            />

            {orderError && (

              <div className="checkout-page__order-error">

                {orderError}

              </div>

            )}

            <button
              className={`checkout-page__place-order-btn ${
                !canPlaceOrder
                  ? "checkout-page__place-order-btn--disabled"
                  : ""
              }`}
              disabled={
                !canPlaceOrder ||
                isSubmitting
              }
              onClick={
                handlePlaceOrder
              }
            >

              {isSubmitting ? (

                <span className="checkout-page__spinner" />

              ) : null}

              {isSubmitting
                ? "Đang xử lý..."
                : "Đặt hàng"}

            </button>

          </div>

        </div>

      </div>

      {/* ADDRESS MODAL */}

      <AddressModal
        isOpen={
          isAddressModalOpen
        }
        currentAddress={
          selectedAddress
        }
        onSelect={
          setSelectedAddress
        }
        onClose={() =>
          setIsAddressModalOpen(
            false
          )
        }
      />

      {/* VOUCHER MODAL */}

      <VoucherModal
        isOpen={
          isVoucherModalOpen
        }
        vouchers={
          voucherList
        }
        currentVoucher={
          voucher
        }
        subtotal={
          totals.subtotal
        }
        onSelect={
          handleSelectVoucher
        }
        onClose={() =>
          setIsVoucherModalOpen(
            false
          )
        }
      />

    </main>
  );
};

export default CheckoutPage;