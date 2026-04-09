import type { Book } from "../../../../product/types/Book";
import ProductCard from "../../../product/components/ProductCard";
import "./HotSearchBooks.css";

interface HotSearchBooksProps {
  books: Book[];
}

const HotSearchBooks = ({ books }: HotSearchBooksProps) => {
  return (
    <div className="hot-search container">
      <h2 className="hot-search__title">HOT SEARCH BOOKS</h2>

      <div className="hot-search__grid">
        {books.map((book) => (
          <ProductCard key={book.book_id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default HotSearchBooks;