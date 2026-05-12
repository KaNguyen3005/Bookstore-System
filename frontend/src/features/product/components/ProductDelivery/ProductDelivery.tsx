import React from "react";
import "../../pages/ProductDetailPage/ProductDetailPage.css";
import { TbTruckDelivery } from "react-icons/tb";

const ProductDelivery = () => {
  return (
    <div className="product-card-white mt-4 delivery-info-card">
      <h3 className="card-title">
        Thông tin vận chuyển
      </h3>

      <div className="delivery-location">
        <TbTruckDelivery className="delivery-icon" />

        <div className="location-text">
          Giao hàng đến{" "}
          <strong>
            TP. Hồ Chí Minh
          </strong>{" "}
          <span className="change-link">
            Thay đổi
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductDelivery;