import React, { useEffect, useState } from "react";

import type { CheckoutAddress } from "../../types";
import { FiX, FiCheck } from "react-icons/fi";
import "./AddressModal.css";

interface AddressModalProps {
  isOpen: boolean;
  addresses: CheckoutAddress[];
  currentAddress: CheckoutAddress | null;
  onSelect: (address: CheckoutAddress) => void;
  onClose: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  addresses,
  currentAddress,
  onSelect,
  onClose,
}) => {
  const [selected, setSelected] = useState<CheckoutAddress | null>(
    currentAddress,
  );

  useEffect(() => {
    setSelected(currentAddress);
  }, [currentAddress]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="addr-modal__overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Chọn địa chỉ giao hàng"
    >
      <div
        className="addr-modal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="addr-modal__header">
          <h3 className="addr-modal__title">Chọn địa chỉ giao hàng</h3>
          <button
            id="btn-close-address-modal"
            className="addr-modal__close"
            onClick={onClose}
            type="button"
            aria-label="Đóng"
          >
            <FiX />
          </button>
        </div>

        <div className="addr-modal__list">
          {addresses.map((addr, index) => {
            const isChosen =
              selected?.detailAddress === addr.detailAddress &&
              selected?.customerPhone === addr.customerPhone;
            return (
              <button
                key={index}
                id={`addr-option-${index}`}
                className={`addr-modal__item ${isChosen ? "addr-modal__item--active" : ""}`}
                onClick={() => setSelected(addr)}
                type="button"
              >
                <div className="addr-modal__item-info">
                  <div className="addr-modal__item-top">
                    <span className="addr-modal__item-name">
                      {addr.customerName}
                    </span>
                    <span className="addr-modal__item-phone">
                      {addr.customerPhone}
                    </span>
                    {addr.isDefault && (
                      <span className="addr-modal__default-badge">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="addr-modal__item-addr">
                    {addr.detailAddress}, {addr.ward}, {addr.district},{" "}
                    {addr.province}
                  </p>
                </div>
                {isChosen && <FiCheck className="addr-modal__item-check" />}
              </button>
            );
          })}
        </div>

        <div className="addr-modal__footer">
          <button
            id="btn-cancel-address"
            className="addr-modal__cancel-btn"
            onClick={onClose}
            type="button"
          >
            Hủy
          </button>
          <button
            id="btn-confirm-address"
            className="addr-modal__confirm-btn"
            onClick={handleConfirm}
            disabled={!selected}
            type="button"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
