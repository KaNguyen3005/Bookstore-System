import { useEffect, useState } from "react";

import type { Book } from "../../product/types/Book";
import type { BookFilters } from "../types/bookFilter";

import { searchBooks } from "../services/bookService";

export const useBookSearch = (
  filters: BookFilters
) => {
  const [books, setBooks] =
    useState<Book[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [total, setTotal] =
    useState(0);

  useEffect(() => {
    const abortController =
      new AbortController();

    setLoading(true);
    setError(null);

    const timerId = setTimeout(
      async () => {
        try {
          const response =
            await searchBooks(filters);

          if (
            abortController.signal.aborted
          ) {
            return;
          }

          console.log(
            "SEARCH RESULT:",
            response
          );

          // ✅ response đã được normalize
          setBooks(response.data || []);

          setTotal(
            response.total || 0
          );
        } catch (err: any) {
          if (
            abortController.signal.aborted
          ) {
            return;
          }

          console.error(
            "BOOK SEARCH ERROR:",
            err
          );

          setError(
            err?.message ||
              "Failed to fetch books"
          );

          setBooks([]);
          setTotal(0);
        } finally {
          if (
            !abortController.signal.aborted
          ) {
            setLoading(false);
          }
        }
      },
      300
    );

    return () => {
      clearTimeout(timerId);

      abortController.abort();
    };
  }, [filters]);

  return {
    books,
    loading,
    error,
    total,
  };
};