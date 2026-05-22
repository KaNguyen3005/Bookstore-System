import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchBooks } from "../../../../services/searchApi";
import ProductCard from "../../../product/components/ProductCard";

import styles from "./SearchPage.module.css";

interface Book {
  bookId: number;
  title: string;
  price: number;
  salePercent: number;
  coverImgUrl: string;
  avgRating: number;
  reviewCount?: number;
  stockQuantity?: number;
  authors: { authorName: string }[];
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword")?.trim() || "";

  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // ===== FETCH =====
  useEffect(() => {
    if (!keyword) return;

    const fetchBooks = async () => {
      setLoading(true);

      try {
        const res = await searchBooks({
          keyword,
          page: 0,
          size: 12,
        });

        const data = res?.result;

        setBooks(data?.content ?? []);
        setTotal(data?.totalElements ?? 0);
      } catch (err) {
        console.error("Search error:", err);
        setBooks([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [keyword]);

  // ===== UI STATE =====
  const renderContent = () => {
    if (loading) {
      return <div className={styles.loading}>Đang tải...</div>;
    }

    if (!books.length) {
      return (
        <div className={styles.empty}>
          Không tìm thấy sách nào
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {books.map((book) => (
          <ProductCard
            key={book.bookId}
            book={book}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.resultHeader}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Kết quả tìm kiếm</h2>

          {keyword && (
            <span className={styles.keyword}>
              “{keyword}”
            </span>
          )}
        </div>

        <div className={styles.meta}>
          <span className={styles.countBadge}>
            {total} sản phẩm
          </span>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}