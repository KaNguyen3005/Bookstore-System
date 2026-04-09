import { useNavigate } from "react-router-dom";
import type { Book } from "../../../../features/product/types/Book";
import "./SearchItem.css";

export default function SearchItem({ book }: { book: Book }) {
  const navigate = useNavigate();

  const finalPrice = book.price;

  return (
    <div
      className="search-item"
      onClick={() => navigate(`/book/${book.book_id}`)}
    >
      <img src={book.cover_image_url} alt={book.title} />

      <div className="search-info">
        <p className="title">{book.title}</p>

        <div className="category-list">
          {book.categories?.map((c) => (
            <span key={c.category_id} className="category-tag">
              {c.name}
            </span>
          ))}
        </div>

        <p className="price">
          {finalPrice.toLocaleString("vi-VN")}đ
        </p>
      </div>
    </div>
  );
}