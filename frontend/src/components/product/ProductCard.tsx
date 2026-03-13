import type { Book } from "../../types/Book";
import "../../styles/home/ProductCard.css";

// Use Book directly since we updated types/Book.ts
interface ProductCardProps {
  book: Book;
}

const ProductCard = ({ book }: ProductCardProps) => {
  // Compute star array [1, 2, 3, 4, 5]
  const rating = book.rating || 0;
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));

  return (
    <div className="product-card">
      <div className="product-card__cover">
        {book.image ? (
          <img src={book.image} alt={book.title} />
        ) : (
          <div className="product-card__cover-placeholder" />
        )}
        {book.discount && (
          <span className="product-card__badge">-{book.discount}%</span>
        )}
      </div>
      
      <div className="product-card__title">{book.title}</div>
      
      {book.rating && (
        <div className="product-card__rating">
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
          {book.reviewCount && <span className="product-card__review-count">({book.reviewCount})</span>}
        </div>
      )}

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
      
      <button className="product-card__btn" style={{ marginTop: 'auto' }}>Thêm vào giỏ hàng</button>
    </div>
  );
};

export default ProductCard;