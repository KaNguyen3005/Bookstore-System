import { useEffect, useState } from "react";
import { aiRcmApi } from "../../../services/ai-rcmApi";
import type { Book } from "../features/product/types/Book";

export const useRelatedBooks = (
  bookId?: number
) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookId) return;

    const fetch = async () => {
      try {
        setLoading(true);

        const data =
          await aiRcmApi.getRelatedBooks(bookId, 10);

        setBooks(data);
      } catch (err) {
        console.error("Related books error:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [bookId]);

  return { books, loading };
};