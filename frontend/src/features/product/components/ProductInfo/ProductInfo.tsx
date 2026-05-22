import React from "react";

import type { Book } from "../types/Book";
import "../../pages/ProductDetailPage/ProductDetailPage.css";

import ProductQuantity from "../ProductQuantity/ProductQuantity";

import {
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

import { FiShoppingCart } from "react-icons/fi";

interface Props {
  book: Book;
  publisherName: string;
  authorName: string;
  categories: string[];
  reviewsCount: number;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  isAdding: boolean;
  isBuying: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const ProductInfo: React.FC<Props> = ({
  book,
  publisherName,
  authorName,
  reviewsCount,
  quantity,
  setQuantity,
  isAdding,
  isBuying,
  onAddToCart,
  onBuyNow,
}) => {
  const renderRating = (
    rating: number = 0
  ) => {
    return Array.from(
      { length: 5 },
      (_, index) => {
        const star = index + 1;

        return star <=
          Math.round(rating) ? (
          <AiFillStar
            key={star}
            className="star filled"
          />
        ) : (
          <AiOutlineStar
            key={star}
            className="star"
          />
        );
      }
    );
  };

  return (
    <div className="product-card-white info-main-card">
      <h1 className="detail-title">
        {book.title}
      </h1>

      <div className="detail-meta-grid">
        <div className="meta-item">
          Nhà cung cấp:{" "}
          <span className="blue-text">
            {publisherName}
          </span>
        </div>

        <div className="meta-item">
          Tác giả:{" "}
          <strong>
            {authorName}
          </strong>
        </div>

        <div className="meta-item">
          Thể loại:{" "}
          <span>
            {book.categories?.length
              ? book.categories.join(", ")
              : "Đang cập nhật"}
          </span>
        </div>

        <div className="meta-item">
          Nhà xuất bản:{" "}
          <span>
            {publisherName}
          </span>
        </div>

        <div className="meta-item">
          Hình thức bìa:{" "}
          <strong>
            {book.coverType ||
              "Bìa mềm"}
          </strong>
        </div>
      </div>

      {/* RATING */}
      <div className="detail-rating-row">
        <div className="stars-row">
          {renderRating(
            book.avgRating || 0
          )}
        </div>

        <span className="rating-count">
          ({reviewsCount} đánh giá)
        </span>
      </div>

      {/* PRICE */}
      <div className="detail-price-row">
        <div className="current-price">
          {book.price
            ? `${book.price.toLocaleString(
                "vi-VN"
              )}đ`
            : "Liên hệ"}
        </div>
      </div>

      {/* QUANTITY */}
      <ProductQuantity
        quantity={quantity}
        setQuantity={setQuantity}
        stock={
          book.stockQuantity || 0
        }
      />

      {/* BUTTONS */}
      <div className="button-actions-horizontal">
        <button
          className={`outline-btn btn-flex ${
            isAdding
              ? "loading"
              : ""
          }`}
          onClick={onAddToCart}
          disabled={
            isAdding || isBuying
          }
        >
          <FiShoppingCart />

          {isAdding
            ? "Đang thêm..."
            : "Thêm vào giỏ hàng"}
        </button>

        <button
          className={`primary-btn btn-flex ${
            isBuying
              ? "loading"
              : ""
          }`}
          onClick={onBuyNow}
          disabled={
            isAdding || isBuying
          }
        >
          {isBuying
            ? "Đang xử lý..."
            : "Mua ngay"}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;