import React, { useEffect, useState } from "react";
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
  const [inputValue, setInputValue] = useState(String(quantity));
  const maxQuantity = Math.max(1, stock);

  useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  const clampQuantity = (value: number) =>
    Math.min(maxQuantity, Math.max(1, value));

  const updateQuantity = (value: number) => {
    const nextQuantity = clampQuantity(value);

    setQuantity(nextQuantity);
    setInputValue(String(nextQuantity));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    if (nextValue === "") {
      setInputValue("");
      return;
    }

    if (!/^\d+$/.test(nextValue)) return;

    setInputValue(nextValue);
    setQuantity(clampQuantity(Number(nextValue)));
  };

  const handleInputBlur = () => {
    updateQuantity(inputValue === "" ? 1 : Number(inputValue));
  };

  return (
    <div className="qty-row">
      <span className="label">
        Số lượng
      </span>

      <div className="qty-selector">
        <button
          onClick={() => updateQuantity(quantity - 1)}
          disabled={quantity <= 1}
        >
          -
        </button>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          aria-label="Số lượng"
        />

        <button
          onClick={() => updateQuantity(quantity + 1)}
          disabled={quantity >= maxQuantity || stock <= 0}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductQuantity;
