import { Link } from "react-router-dom";
import type { Book } from "../../../product/types/Book";
import "./HeroBanner.css";

interface HeroBannerProps {
  books: Book[];
}

const HeroBanner = ({ books }: HeroBannerProps) => {
  const displayBooks = books.slice(0, 3);

  return (
    <div className="hero-banner">
      <div className="hero-banner__inner container">
        <div className="hero-banner__images">
          {displayBooks.map((book) => (
            <Link
              key={book.bookId}
              to={`/product/${book.bookId}`}
              className="hero-banner__cover"
            >
              <img
                src={
                  book.coverImgUrl ||
                  `https://picsum.photos/seed/book${book.bookId}/300/400`
                }
                alt={book.title}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;