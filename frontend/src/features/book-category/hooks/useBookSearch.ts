import { useEffect, useState } from "react";
import type { Book } from "../../product/types/Book";
import type { BookFilters } from "../types/bookFilter";
import { searchBooks } from "../services/bookService";

export const useBookSearch = (filters: BookFilters) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await searchBooks(filters);

        if (ignore) return;

        console.log("RAW SEARCH:", res);

        // 🔥 FIX CHUẨN DATA EXTRACTION
        const data =
          res?.data?.content ??
          res?.data ??
          res?.result?.content ??
          [];
          
        const total =
          res?.data?.totalElements ??
          res?.total ??
          res?.result?.totalElements ??
          0;

        setBooks(data);
        setTotal(total);

      } catch (err: any) {
        if (ignore) return;

        setError(err?.message || "Failed to fetch books");
        setBooks([]);
        setTotal(0);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [filters]);

  return { books, loading, error, total };
};