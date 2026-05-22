import React from "react";
import "../../pages/ProductDetailPage/ProductDetailPage.css";

interface Props {
  quantity: number;
  stock: number;
  setQuantity: React.Dispatch<
    React.SetStateAction<number>
  >;
}

const ProductQuantity: React.FC<Props> = ({
  quantity,
  stock,
  setQuantity,
}) => {
  return (
    <div className="qty-row">
      <span className="label">
        Số lượng
      </span>

      <div className="qty-selector">
        <button
          onClick={() =>
            setQuantity(
              Math.max(
                1,
                quantity - 1
              )
            )
          }
        >
          -
        </button>

        <input
          type="text"
          value={quantity}
          readOnly
        />

        <button
          onClick={() =>
            setQuantity(
              Math.min(
                stock,
                quantity + 1
              )
            )
          }
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductQuantity;