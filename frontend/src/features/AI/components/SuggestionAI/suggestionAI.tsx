import { useAISuggestion } from "../../hooks/useAISuggestion";
import ProductCard from "../../../product/components/ProductCard";
import styles from "./SuggestionAI.module.css";

const Suggestion = () => {
  const { books, loading } = useAISuggestion();

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
        {books.map((item) => (
          <ProductCard
            key={item.book.bookId}
            book={item.book}
          />
        ))}
      </div>
    </div>
  );
};

export default Suggestion;