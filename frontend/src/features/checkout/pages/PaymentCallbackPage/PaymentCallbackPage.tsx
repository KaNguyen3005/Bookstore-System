import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import paymentApi from "../../services/paymentApi";

const PaymentCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const paymentId = params.get("paymentId");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId) return;

      const res = await paymentApi.getStatus(Number(paymentId));

      const status = res?.result?.status;

      if (status === "SUCCESS") {
        navigate("/payment/success");
      } else {
        navigate("/payment/fail");
      }
    };

    verifyPayment();
  }, [paymentId]);

  return <div>Đang xác thực thanh toán...</div>;
};

export default PaymentCallback;
