import React from "react";
import "./orderSuccessPage.css";
import {
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import { FiPackage } from "react-icons/fi";
const OrderSuccessPage: React.FC = () => {

  const location =
    useLocation();
  const [searchParams] =
    useSearchParams();

  const orderId =
    location.state?.orderId ??
    searchParams.get("orderId");

  return (

    <div className="payment-result payment-result--success">

      <div className="payment-result__container">

        <FiPackage className="payment-result__icon" />

        <h1 className="payment-result__title">
          Đặt hàng thành công!
        </h1>

        <p className="payment-result__msg">
          Đơn hàng của bạn đã được ghi nhận.
          Bạn sẽ thanh toán khi nhận hàng.
        </p>

        {orderId && (

          <div className="payment-result__order-info">

            <span>
              Mã đơn hàng:
            </span>

            <strong>
              #{orderId}
            </strong>

          </div>

        )}

        <div className="payment-result__actions">

          <Link
            to="/"
            className="payment-result__btn payment-result__btn--secondary"
          >
            Về trang chủ
          </Link>

          <Link
            to="/profile/purchaseorder"
            className="payment-result__btn payment-result__btn--primary"
          >
            Xem đơn hàng
          </Link>

        </div>

      </div>

    </div>
  );
};

export default OrderSuccessPage;
