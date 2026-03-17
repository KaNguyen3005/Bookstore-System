import type { Book } from "../../types/Book";
import "../../styles/home/ProductCard.css";

interface ProductCardProps {
  book: Book;
}

const ProductCard = ({ book }: ProductCardProps) => {
  const rating = book.avg_rating || 0;
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));

  return (
    <div className="product-card">
      <div className="product-card__cover">
        {book.cover_image_url ? (
          <img src={book.cover_image_url} alt={book.title} />
        ) : (
          <img
            src={`https://picsum.photos/seed/book${book.book_id}/200/280`}
            alt={book.title}
          />
        )}

        {book.sale_percent && (
          <span className="product-card__badge">
            -{book.sale_percent}%
          </span>
        )}
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title" title={book.title}>
          {book.title}
        </h3>

        <div className="product-card__rating">
          {rating > 0 ? (
            <>
              {stars.map((isFilled, index) => (
                <span
                  key={index}
                  className={`product-card__star ${isFilled ? "product-card__star--filled" : ""
                    }`}
                >
                  ★
                </span>
              ))}
              {book.reviewCount && (
                <span className="product-card__review-count">
                  ({book.reviewCount})
                </span>
              )}
            </>
          ) : (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className="product-card__star">
                  ★
                </span>
              ))}
              <span className="product-card__review-count">(0)</span>
            </>
          )}
        </div>

        <div className="product-card__price-container">
          <div className="product-card__price">
            <span className="product-card__price-current">
              {book.price.toLocaleString("vi-VN")} đ
            </span>

            {book.oldPrice && (
              <span className="product-card__price-old">
                {book.oldPrice.toLocaleString("vi-VN")} đ
              </span>
            )}
          </div>
        </div>

        <button className="product-card__btn">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;