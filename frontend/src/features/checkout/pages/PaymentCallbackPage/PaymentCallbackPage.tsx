import { useEffect } from "react";

import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import { paymentApi } from "../../services/paymentApi";

import "./PaymentCallbackPage.css";

const PaymentCallbackPage = () => {

  const [params] =
    useSearchParams();

  const navigate =
    useNavigate();

  // =========================
  // QUERY PARAMS
  // =========================

  const paymentId =
    params.get("paymentId");

  const orderId =
    params.get("orderId");

  // =========================
  // VERIFY PAYMENT
  // =========================

  useEffect(() => {

    const verifyPayment =
      async () => {

        try {

          if (!paymentId) {

            navigate(
              "/payment/fail"
            );

            return;
          }

          const res =
            await paymentApi.getStatus(
              Number(paymentId)
            );

          const status =
            res?.result?.status;

          // SUCCESS

          if (
            status === "SUCCESS"
          ) {

            navigate(
              `/payment/success?orderId=${orderId || ""}`
            );

            return;
          }

          // FAIL

          navigate(
            `/payment/fail?orderId=${orderId || ""}`
          );

        } catch (error) {

          console.error(
            "Verify payment failed:",
            error
          );

          navigate(
            `/payment/fail?orderId=${orderId || ""}`
          );
        }
      };

    verifyPayment();

  }, [
    paymentId,
    orderId,
    navigate,
  ]);

  // =========================
  // UI
  // =========================

  return (

    <div className="payment-callback">

      <div className="payment-callback__container">

        <div className="payment-callback__loading">

          <div className="payment-callback__spinner" />

          <p>
            Đang xác thực thanh toán...
          </p>

          <span>
            Vui lòng không đóng trình duyệt
          </span>

        </div>

      </div>

    </div>
  );
};

export default PaymentCallbackPage;