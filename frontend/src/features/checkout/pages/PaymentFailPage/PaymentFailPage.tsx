import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiXCircle } from "react-icons/fi";
import "../PaymentSuccessPage/PaymentSuccessPage.css"; // Reuse some styles

const PaymentFailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason");
  const orderId = searchParams.get("orderId");

  return (
    <div className="payment-result payment-result--fail">
      <div className="payment-result__container">
        <FiXCircle className="payment-result__icon" />
        <h1 className="payment-result__title">Thanh toán thất bại</h1>
        <p className="payment-result__msg">
          {reason || "Đã có lỗi xảy ra trong quá trình thanh toán của bạn."}
        </p>
        
        {orderId && (
          <div className="payment-result__order-info">
            <span>Mã đơn hàng:</span>
            <strong>#{orderId}</strong>
          </div>
        )}

        <div className="payment-result__actions">
          <Link to="/" className="payment-result__btn payment-result__btn--secondary">
            Về trang chủ
          </Link>
          <Link to="/checkout" className="payment-result__btn payment-result__btn--primary">
            Thử lại thanh toán
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage;
