import { Link } from "react-router-dom";
import type { Book } from "../../types/Book";
import "../../styles/home/HeroBanner.css";

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
            <Link key={book.book_id} to={`/product/${book.book_id}`} className="hero-banner__cover">
              <img
                src={
                  book.cover_image_url ||
                  `https://picsum.photos/seed/book${book.book_id}/300/400`
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