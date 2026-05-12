import { Link } from "react-router-dom";
import type { MouseEvent } from "react";

import { useCartActions } from "../../cart/hooks/useCartActions";
import type { Book } from "../types/Book";
import type { CartItemType } from "../../cart/types/cartItemType";

import "./ProductCard.css";

interface ProductCardProps {
  book: Book;
}

const ProductCard = ({ book }: ProductCardProps) => {
  const { onAddToCart } = useCartActions();

  // ================= SAFE DATA =================
  const rating = book.avgRating ?? 0;
  const roundedRating = Math.round(rating);
  const price = book.price ?? 0;

  const stars = Array.from({ length: 5 }, (_, i) => i < roundedRating);

  // ================= HANDLER =================
  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const item: CartItemType = {
      book: {
        bookId: book.bookId,
        title: book.title,
        price: book.price ?? 0,
        salePercent: book.salePercent ?? 0,
        coverImgUrl: book.coverImgUrl,
        stockQuantity: book.stockQuantity ?? 0,
      },
      quantity: 1,
      selected: true,
    };

    onAddToCart(item);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${book.bookId}`} className="product-card__link">
        {/* ================= COVER ================= */}
        <div className="product-card__cover">
          <img
            src={
              book.coverImgUrl ||
              `https://picsum.photos/seed/book${book.bookId}/200/280`
            }
            alt={book.title}
          />
        </div>

        {/* ================= CONTENT ================= */}
        <div className="product-card__content">
          <h3 className="product-card__title" title={book.title}>
            {book.title}
          </h3>

          {/* ================= RATING ================= */}
          <div className="product-card__rating">
            {rating > 0 ? (
              <>
                {stars.map((isFilled, index) => (
                  <span
                    key={index}
                    className={`product-card__star ${
                      isFilled ? "product-card__star--filled" : ""
                    }`}
                  >
                    ★
                  </span>
                ))}

                {book.reviewCount !== undefined && (
                  <span className="product-card__review-count">
                    ({book.reviewCount})
                  </span>
                )}
              </>
            ) : (
              <span className="product-card__no-rating">
                Chưa có đánh giá
              </span>
            )}
          </div>

          {/* ================= PRICE ================= */}
          <div className="product-card__price-container">
            <div className="product-card__price">
              <span className="product-card__price-current">
                {price.toLocaleString("vi-VN")} đ
              </span>

              {book.oldPrice && (
                <span className="product-card__price-old">
                  {book.oldPrice.toLocaleString("vi-VN")} đ
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* ================= ADD TO CART ================= */}
      <button className="product-card__btn" onClick={handleAddToCart}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        Thêm vào giỏ
      </button>
    </div>
  );
};

export default ProductCard;