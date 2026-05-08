import React, { useState } from "react";
import { FiX, FiInfo, FiGift, FiCheck } from "react-icons/fi";
import type { CheckoutVoucher } from "../../types";
import { voucherApi } from "../../services/voucherApi";
import "./VoucherModal.css";

interface VoucherModalProps {
  isOpen: boolean;
  vouchers: CheckoutVoucher[];
  currentVoucher: CheckoutVoucher | null;
  subtotal: number;
  onSelect: (voucher: CheckoutVoucher) => void;
  onClose: () => void;
}

const VoucherModal: React.FC<VoucherModalProps> = ({
  isOpen,
  vouchers,
  currentVoucher,
  subtotal,
  onSelect,
  onClose,
}) => {
  const [customCode, setCustomCode] = useState("");
  const [error, setError] = useState("");
  const [localVouchers, setLocalVouchers] = useState<CheckoutVoucher[]>(vouchers);
  const [applying, setApplying] = useState(false);

  React.useEffect(() => {
    setLocalVouchers(vouchers);
  }, [vouchers]);

  if (!isOpen) return null;

  const handleApplyCustomCode = async () => {
    if (!customCode.trim()) return;
    setApplying(true);
    setError("");
    try {
      const voucher = await voucherApi.validateVoucher(customCode);
      if (!localVouchers.find((v) => v.voucherId === voucher.voucherId)) {
        setLocalVouchers([voucher, ...localVouchers]);
      }
      setCustomCode("");
    } catch (err: any) {
      setError(err.message || "Mã không hợp lệ");
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}`;
  };

  const formatValue = (v: CheckoutVoucher) => {
    if (v.voucherCode.toLowerCase().includes("freeship")) return "Miễn phí vận chuyển";
    if (v.type === "PERCENT") return `Giảm ${v.discountValue}%`;
    return `Giảm ${v.discountValue.toLocaleString("vi-VN")}đ`;
  };

  // Grouping vouchers
  const shippingVouchers = localVouchers.filter(v => v.voucherCode.toLowerCase().includes("freeship"));
  const discountVouchers = localVouchers.filter(v => !v.voucherCode.toLowerCase().includes("freeship"));

  const renderVoucherCard = (v: CheckoutVoucher) => {
    const isFreeShip = v.voucherCode.toLowerCase().includes("freeship");
    const isDisabled = subtotal < v.minOrderValue;
    const isSelected = currentVoucher?.voucherId === v.voucherId;

    return (
      <div
        key={v.voucherId}
        className={`voucher-card ${isDisabled ? "voucher-card--disabled" : ""} ${isSelected ? "voucher-card--selected" : ""}`}
        onClick={() => !isDisabled && onSelect(v)}
      >
        <div className={`voucher-card__left ${isFreeShip ? "is-freeship" : "is-discount"}`}>
          <div className="voucher-card__zigzag"></div>
          <div className="voucher-card__stub-content">
            {isFreeShip ? (
              <>
                <span className="voucher-card__stub-title">FREE SHIP</span>
                <span className="voucher-card__stub-sub">Mã vận chuyển</span>
              </>
            ) : (
              <>
                <FiGift className="voucher-card__stub-icon" />
                <span className="voucher-card__stub-sub">KaTiLa</span>
              </>
            )}
          </div>
        </div>
        
        <div className="voucher-card__divider">
          <div className="voucher-card__cutout voucher-card__cutout--top"></div>
          <div className="voucher-card__dashed"></div>
          <div className="voucher-card__cutout voucher-card__cutout--bottom"></div>
        </div>

        <div className="voucher-card__right">
          <div className="voucher-card__info">
            <div className="voucher-card__main-row">
              <span className="voucher-card__main-val">{formatValue(v)}</span>
              {v.totalLimit - v.usedCount < 10 && (
                <span className="voucher-card__badge">Số lượng có hạn</span>
              )}
            </div>
            <div className="voucher-card__condition">
              Đơn tối thiểu {v.minOrderValue.toLocaleString("vi-VN")}đ
            </div>
            <div className="voucher-card__expiry">
              Hạn dùng: {formatDate(v.endDate)}
            </div>
          </div>
          <div className="voucher-card__selection">
            <div className={`voucher-card__radio ${isSelected ? "active" : ""}`}>
              {isSelected && <FiCheck />}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="voucher-modal__overlay" onClick={onClose}>
      <div className="voucher-modal__container" onClick={(e) => e.stopPropagation()}>
        <div className="voucher-modal__header">
          <h3 className="voucher-modal__title">Chọn KaTiLa Voucher</h3>
          <button className="voucher-modal__close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="voucher-modal__search">
          <div className="voucher-modal__input-group">
            <input
              type="text"
              placeholder="Nhập mã KaTiLa voucher"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
            />
            <button
              onClick={handleApplyCustomCode}
              disabled={applying || !customCode.trim()}
            >
              Áp dụng
            </button>
          </div>
          {error && <p className="voucher-modal__error">{error}</p>}
        </div>

        <div className="voucher-modal__content">
          {shippingVouchers.length > 0 && (
            <>
              <h4 className="voucher-modal__section-title">Ưu đãi phí vận chuyển</h4>
              <div className="voucher-modal__list">
                {shippingVouchers.map(renderVoucherCard)}
              </div>
            </>
          )}

          {discountVouchers.length > 0 && (
            <>
              <h4 className="voucher-modal__section-title">Mã giảm giá/hoàn Xu</h4>
              <div className="voucher-modal__list">
                {discountVouchers.map(renderVoucherCard)}
              </div>
            </>
          )}
        </div>

        <div className="voucher-modal__footer">
          <button className="voucher-modal__confirm-btn" onClick={onClose}>
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherModal;
