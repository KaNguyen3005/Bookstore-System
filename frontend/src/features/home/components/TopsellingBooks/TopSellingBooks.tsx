import type { Book } from "../../../product/types/Book";
import ProductCard from "../../../product/components/ProductCard";
import "./TopSellingBooks.css";

interface TopSellingBooksProps {
  books: Book[];
}

const TopSellingBooks = ({ books }: TopSellingBooksProps) => {
  return (
    <div className="top-selling container">
      <h2 className="top-selling__title">Top sách bán chạy</h2>
      <div className="top-selling__grid">
        {books.map((book) => (
          <ProductCard key={book.book_id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default TopSellingBooks;
