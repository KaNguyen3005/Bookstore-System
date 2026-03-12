import type { Book } from "../../types/Book";
import ProductCard from "../product/ProductCard";
import "../../styles/home/HotSearchBooks.css";

interface HotSearchBooksProps {
  books: Book[];
}

const HotSearchBooks = ({ books }: HotSearchBooksProps) => {
  return (
    <div className="hot-search">
      <h2 className="hot-search__title">HOT SEARCH BOOKS</h2>
      <div className="hot-search__grid hot-books-grid">
        {books.map((book) => (
          <ProductCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default HotSearchBooks;
