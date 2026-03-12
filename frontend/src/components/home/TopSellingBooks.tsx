import type { Book } from "../../types/Book";
import ProductCard from "../product/ProductCard";
import "../../styles/home/TopSellingBooks.css";

interface TopSellingBooksProps {
  books: Book[];
}

const TopSellingBooks = ({ books }: TopSellingBooksProps) => {
  return (
    <div className="top-selling">
      <h2 className="top-selling__title">Top sách bán chạy</h2>
      <div className="top-selling__grid">
        {books.map((book) => (
          <ProductCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default TopSellingBooks;
