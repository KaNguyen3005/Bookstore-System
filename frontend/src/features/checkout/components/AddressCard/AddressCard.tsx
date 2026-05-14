import React from "react";

import type { CheckoutAddress } from "../../types";

import { FiMapPin, FiPhone, FiUser } from "react-icons/fi";

import "./AddressCard.css";

interface AddressCardProps {
  address: CheckoutAddress | null;

  onChangeAddress: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onChangeAddress,
}) => {
  console.log("selectedAddress:", address);

  return (
    <section className="address-card" aria-label="Địa chỉ giao hàng">
      <div className="address-card__header">
        <h2 className="address-card__title">Địa chỉ giao hàng</h2>

        <button
          id="btn-change-address"
          className="address-card__change-btn"
          onClick={onChangeAddress}
          type="button"
          aria-label="Thay đổi địa chỉ giao hàng"
        >
          Thay đổi
        </button>
      </div>

      {address ? (
        <div className="address-card__info">
          {/* NAME */}

          <div className="address-card__row">
            <FiUser className="address-card__icon" />

            <span className="address-card__name">
              {address?.customerName || ""}
            </span>
          </div>

          {/* PHONE */}

          <div className="address-card__row">
            <FiPhone className="address-card__icon" />

            <span>{address?.customerPhone || ""}</span>
          </div>

          {/* ADDRESS */}

          <div className="address-card__row">
            <FiMapPin className="address-card__icon" />

            <span className="address-card__address">
              {address?.detailAddress || ""}

              {address?.ward ? `, ${address.ward}` : ""}

              {address?.district ? `, ${address.district}` : ""}

              {address?.province ? `, ${address.province}` : ""}
            </span>
          </div>
        </div>
      ) : (
        <div className="address-card__empty">
          <p>Chưa có địa chỉ giao hàng.</p>

          <button
            id="btn-add-address"
            className="address-card__add-btn"
            onClick={onChangeAddress}
            type="button"
          >
            + Thêm địa chỉ
          </button>
        </div>
      )}
    </section>
  );
};

export default AddressCard;
