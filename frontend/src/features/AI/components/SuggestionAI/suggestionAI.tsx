import { useAISuggestion } from "../../hooks/useAISuggestion";
import ProductCard from "../../../product/components/ProductCard";
import styles from "./SuggestionAI.module.css";

const Suggestion = () => {
  const { books, loading } = useAISuggestion();

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        AI GỢI Ý CHO BẠN <span className={styles.robot}>🤖</span>
      </h2>

      <div className={styles.grid}>
        {books.map((book) => (
          <ProductCard key={book.bookId} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Suggestion;