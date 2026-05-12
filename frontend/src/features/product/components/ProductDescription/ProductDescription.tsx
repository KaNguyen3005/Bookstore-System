import React from "react";

import "../../pages/ProductDetailPage/ProductDetailPage.css";

interface Props {
  title: string;
  description?: string;
  authorName: string;
}

const ProductDescription: React.FC<Props> = ({
  title,
  description,
  authorName,
}) => {
  return (
    <div className="product-card-white mt-4 description-section">
      <h3 className="card-title">
        Mô tả sản phẩm
      </h3>

      <div className="description-content">
        <p>
          <strong>{title}</strong>
        </p>

        <p>
          {description ||
            `Đây là tác phẩm nổi bật của tác giả ${authorName}.`}
        </p>
      </div>
    </div>
  );
};

export default ProductDescription;