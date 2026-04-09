import { useNavigate } from "react-router-dom";
import type { Book } from "../../../../features/product/types/Book";
import "./SearchItem.css";

export default function SearchItem({
  book,
  onSelect,
}: {
  book: Book;
  onSelect?: () => void;
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    onSelect?.();
    navigate(`/product/${book.book_id}`);
  };

  return (
    <div className="search-item" onClick={handleClick}>
      <img
        src={
          book.cover_image_url ||
          `https://picsum.photos/seed/book${book.book_id}/60/80`
        }
        alt={book.title}
        className="search-item__img"
      />

      <div className="search-item__info">
        <p className="search-item__title">{book.title}</p>

        {book.categories?.length > 0 && (
          <p className="search-item__category">
            {book.categories.map((c) => c.name).join(", ")}
          </p>
        )}

        <p className="search-item__price">
          {book.price.toLocaleString("vi-VN")}đ
        </p>
      </div>
    </div>
  );
}