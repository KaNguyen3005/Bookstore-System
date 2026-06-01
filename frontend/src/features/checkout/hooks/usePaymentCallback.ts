import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { paymentApi } from "../services/paymentApi";

export const usePaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const isVerifying = useRef(false);

  useEffect(() => {
    if (isVerifying.current) return;
    isVerifying.current = true;

    const run = async () => {
      try {
        const orderId = searchParams.get("orderId");
        const paymentId = searchParams.get("paymentId");

        // =====================
        // 1. VALIDATE INPUT
        // =====================
        if (!orderId) {
          navigate("/payment/fail?reason=missing-order", { replace: true });
          return;
        }

        // =====================
        // 2. BACKEND VERIFY (TRUST BACKEND)
        // =====================
        let isSuccess = false;

        if (paymentId) {
          const res = await paymentApi.getStatus(Number(paymentId));
          const status = res?.result?.status;

          isSuccess = status === "SUCCESS";
        } else {
          // fallback nếu không có paymentId
          isSuccess = searchParams.get("status") === "success";
        }

        // =====================
        // 3. SMALL UX DELAY
        // =====================
        await new Promise((r) => setTimeout(r, 1000));

        // =====================
        // 4. REDIRECT FINAL
        // =====================
        if (isSuccess) {
          navigate(`/payment/success?orderId=${orderId}`, {
            replace: true,
          });
        } else {
          navigate(`/payment/fail?orderId=${orderId}`, {
            replace: true,
          });
        }
      } catch (err) {
        console.error("Payment callback error:", err);
        navigate("/payment/fail", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [searchParams, navigate]);

  return { isLoading };
};

