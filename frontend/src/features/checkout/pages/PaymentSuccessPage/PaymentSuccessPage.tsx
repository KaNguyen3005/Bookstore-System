import React, { useEffect } from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { FiCheckCircle } from "react-icons/fi";

import "./PaymentSuccessPage.css";

const PaymentSuccessPage: React.FC = () => {

  const [searchParams] =
    useSearchParams();

  const navigate =
    useNavigate();

  // =========================
  // QUERY PARAMS
  // =========================

  const orderId =
    searchParams.get("orderId");

  const responseCode =
    searchParams.get(
      "vnp_ResponseCode"
    );

  // =========================
  // VERIFY PAYMENT
  // =========================

  useEffect(() => {

    // VNPay fail
    if (
      responseCode &&
      responseCode !== "00"
    ) {
      navigate("/payment/fail");
    }

  }, [
    responseCode,
    navigate,
  ]);

  return (

    <div className="payment-result payment-result--success">

      <div className="payment-result__container">

        <FiCheckCircle className="payment-result__icon" />

        <h1 className="payment-result__title">
          Thanh toán thành công!
        </h1>

        <p className="payment-result__msg">
          Cảm ơn bạn đã mua hàng.
          Đơn hàng của bạn đang được xử lý.
        </p>

        {/* ORDER ID */}

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

        {/* ACTIONS */}

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

export default PaymentSuccessPage;