import ProductCard from "../../../product/components/ProductCard";
import type { Book } from "../../../product/types/Book";
import styles from "./SuggestionAI.module.css";

interface SuggestionProps {
  books?: Book[];
  loading?: boolean;
}

const Suggestion = ({
  books = [],
  loading = false,
}: SuggestionProps) => {

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>
          AI GỢI Ý CHO BẠN <span className={styles.robot}>🤖</span>
        </h2>

        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  // ---------------- EMPTY ----------------
  if (!loading && (!books || books.length === 0)) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>
          AI GỢI Ý CHO BẠN <span className={styles.robot}>🤖</span>
        </h2>

        <div className={styles.empty}>
          Chưa có gợi ý phù hợp cho bạn lúc này
        </div>
      </div>
    );
  }

  // ---------------- MAIN UI ----------------
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        AI GỢI Ý CHO BẠN <span className={styles.robot}>🤖</span>
      </h2>

      <div className={styles.grid}>
        {books.map((book) => (
          <ProductCard
            key={book.bookId}
            book={book}
          />
        ))}
      </div>
    </div>
  );
};

export default Suggestion;
