import { useRelatedBooks } from "../../hooks/useRelatedBooks";
import ProductCard from "../../../product/components/ProductCard";
import styles from "./RelatedBooks.module.css";

interface RelatedBooksProps {
  bookId: number;
}

const RelatedBooks = ({ bookId }: RelatedBooksProps) => {
  const { books, loading } = useRelatedBooks(bookId);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>SÁCH LIÊN QUAN</h2>

      <div className={styles.grid}>
        {books.map((book) => (
          <ProductCard key={book.bookId} book={book} />
        ))}
      </div>
    </div>
  );
};

export default RelatedBooks;