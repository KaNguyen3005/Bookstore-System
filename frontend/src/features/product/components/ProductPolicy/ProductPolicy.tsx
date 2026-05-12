import React from "react";

import { FiChevronRight } from "react-icons/fi";
import "../../pages/ProductDetailPage/ProductDetailPage.css";

const ProductPolicy = () => {
  return (
    <div className="policy-list">
      <p className="policy-title">
        Chính sách ưu đãi của Katiia
      </p>

      <div className="policy-item">
        <span className="policy-icon">
          🚚
        </span>

        <div className="policy-text">
          <p>
            <strong>
              Thời gian giao hàng:
            </strong>{" "}
            giao nhanh, uy tín
          </p>
        </div>

        <FiChevronRight className="chevron" />
      </div>

      <div className="policy-item">
        <span className="policy-icon">
          🛡️
        </span>

        <div className="policy-text">
          <p>
            <strong>
              Chính sách đổi trả:
            </strong>{" "}
            đổi trả miễn phí toàn quốc
          </p>
        </div>

        <FiChevronRight className="chevron" />
      </div>
    </div>
  );
};

export default ProductPolicy;