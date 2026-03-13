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
              <div key={book.id} className="hero-banner__cover">
                {book.image ? (
                  <img src={book.image} alt={book.title} />
                ) : (
                  <div className="hero-banner__cover-placeholder" />
                )}
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default HeroBanner;
