import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/hooks/useAuth";
import type { CheckoutAddress } from "../../types";
import { useCheckout } from "../../hooks/useCheckout";
import { useAddressList } from "../../hooks/useAddressList";

import CheckoutCartItem from "../../components/CheckoutCartItem/CheckoutCartItem";
import ShippingMethod from "../../components/ShippingMethod/ShippingMethod";
import PaymentMethod from "../../components/PaymentMethod/PaymentMethod";
import AddressCard from "../../components/AddressCard/AddressCard";
import VoucherInput from "../../components/VoucherInput/VoucherInput";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import AddressModal from "../../components/AddressModal/AddressModal";

import "./CheckoutPage.css";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // High-priority direct purchase item
  const buyNowItem = location.state?.buyNowItem;
  const checkoutItems = location.state?.selectedItems || [];
  const { user } = useAuth();

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
  } = useCheckout(buyNowItem ? [buyNowItem] : checkoutItems);

  // Use useCallback so we don't recreate this function on every render, which would trigger the useEffect in useAddressList endlessly
  const handleDefaultAddressFound = useCallback(
    (addr: CheckoutAddress) => {
      setSelectedAddress(addr);
    },
    [setSelectedAddress],
  );

  const { addresses } = useAddressList(handleDefaultAddressFound)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<{
    orderId: number | string;
    total: number;
  } | null>(null);

  // Redirect if checkout items are empty
  useEffect(() => {
    if (selectedItems.length === 0 && !orderSuccessData) {
      navigate("/cart");
    }
  }, [selectedItems, navigate, orderSuccessData]);

  const handlePlaceOrder = async () => {
    const result = await placeOrder();
    if (result) {
      setOrderSuccessData({ orderId: result.orderId, total: totals.total });
      setTimeout(() => navigate("/"), 4000);
    }
  };

  if (orderSuccessData) {
    return (
      <div className="checkout-success">
        <div className="checkout-success__content">
          <div className="checkout-success__icon">✓</div>
          <h2 className="checkout-success__title">Đặt hàng thành công!</h2>
          <p className="checkout-success__msg">
            Cảm ơn bạn đã mua hàng tại KATIIA. Đơn hàng{" "}
            <strong>#{orderSuccessData.orderId}</strong> của bạn đang được xử
            lý.
          </p>
          <p className="checkout-success__msg">
            Tổng thanh toán:{" "}
            <strong>{orderSuccessData.total.toLocaleString("vi-VN")} đ</strong>
          </p>
          <p className="checkout-success__redirect">
            Đang chuyển về trang chủ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="checkout-page" aria-label="Trang thanh toán">
      <div className="checkout-page__container">
        <h1 className="checkout-page__title">Trang thanh toán</h1>

        <div className="checkout-page__layout">
          {/* ── LEFT COLUMN ─────────────────────────────────────── */}
          <div className="checkout-page__left">
            {/* 1. Kiểm tra đơn hàng */}
            <section
              className="checkout-section"
              aria-label="Kiểm tra đơn hàng"
            >
              <h2 className="checkout-section__title">Kiểm tra đơn hàng</h2>
              <div className="checkout-items__list">
                {selectedItems.map((item: any) => (
                  <CheckoutCartItem key={item.book.bookId} item={item} />
                ))}
              </div>
            </section>

            {/* 2. Phương thức vận chuyển */}
            <section className="checkout-section">
              <ShippingMethod
                selected={shippingMethod}
                onChange={setShippingMethod}
              />
            </section>

            {/* 3. Phương thức thanh toán */}
            <section className="checkout-section">
              <PaymentMethod
                selected={paymentMethod}
                onChange={setPaymentMethod}
              />
            </section>
          </div>

          {/* ── RIGHT COLUMN ─────────────────────────────────────── */}
          <div className="checkout-page__right">
            {/* 1. Địa chỉ giao hàng */}
            <AddressCard
              address={selectedAddress}
              onChangeAddress={() => setIsAddressModalOpen(true)}
            />

            {/* 2. Voucher */}
            <VoucherInput
              code={voucherCode}
              appliedVoucher={voucher}
              error={voucherError}
              success={voucherSuccess}
              isLoading={isApplyingVoucher}
              onChange={setVoucherCode}
              onApply={applyVoucherCode}
              onRemove={removeVoucher}
            />

            {/* 3. Order Summary */}
            <OrderSummary totals={totals} itemCount={selectedItems.length} />

            {/* 4. Error */}
            {orderError && (
              <div className="checkout-page__order-error" role="alert">
                {orderError}
              </div>
            )}

            {/* Validation hints */}
            {!selectedAddress && (
              <p className="checkout-page__hint">
                ⚠ Vui lòng chọn địa chỉ giao hàng
              </p>
            )}
            {!paymentMethod && (
              <p className="checkout-page__hint">
                ⚠ Vui lòng chọn phương thức thanh toán
              </p>
            )}

            {/* 5. Nút Đặt hàng */}
            <button
              id="btn-place-order"
              className={`checkout-page__place-order-btn ${!canPlaceOrder ? "checkout-page__place-order-btn--disabled" : ""}`}
              onClick={handlePlaceOrder}
              disabled={!canPlaceOrder}
              type="button"
              aria-label="Đặt hàng"
            >
              {isSubmitting ? (
                <span className="checkout-page__spinner" aria-hidden="true" />
              ) : null}
              {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
            </button>

            <p className="checkout-page__terms">
              Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo{" "}
              <a href="/terms" className="checkout-page__terms-link">
                Điều khoản KATIIA
              </a>
            </p>
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        addresses={addresses}
        currentAddress={selectedAddress}
        onSelect={setSelectedAddress}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </main>
  );
};

export default CheckoutPage;
