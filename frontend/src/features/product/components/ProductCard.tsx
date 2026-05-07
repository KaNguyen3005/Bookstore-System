import { Link } from "react-router-dom";
import { useCartActions } from "../../cart/hooks/useCartActions";
import type { Book } from "../types/Book";
import "./ProductCard.css";

interface ProductCardProps {
  book: Book;
}

const ProductCard = ({ book }: ProductCardProps) => {
  // console.log("BOOK:", book);
  const { onAddToCart } = useCartActions();

  const rating = book.avgRating || 0;
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const item = {
      bookId: book.bookId,
      title: book.title,
      price: book.oldPrice || book.price,
      salePercent: book.salePercent || 0,
      coverImgUrl:
        book.coverImgUrl ||
        `https://picsum.photos/seed/book${book.bookId}/200/280`,
      quantity: 1,
      stockQuantity: 100, // mock stock
      selected: true
    };

    onAddToCart(item);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${book.bookId}`} className="product-card__link">
        <div className="product-card__cover">
          <img
            src={
              book.coverImgUrl ||
              `https://picsum.photos/seed/book${book.bookId}/200/280`
            }
            alt={book.title}
          />

          {/* {book.salePercent && (
            <span className="product-card__badge">
              -{book.salePercent}%
            </span>
          )} */}
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
                    className={`product-card__star ${
                      isFilled ? "product-card__star--filled" : ""
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
                <span className="product-card__review-count"></span>
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
        </div>
      </Link>

      <button className="product-card__btn" onClick={handleAddToCart}>
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
  );
};

export default ProductCard;