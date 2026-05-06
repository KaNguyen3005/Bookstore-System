import { useState, useEffect } from "react";
import type { Book } from "../types/book";
import type { BookFilters } from "../types/filter";
import { searchBooks } from "../services/bookService";

/**
 * Custom hook to handle book searching with debouncing and abort controllers.
 * 
 * @param filters Current active filters
 * @returns Object containing books data, loading state, error state, and total count.
 */
export const useBookSearch = (filters: BookFilters) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    // AbortController to prevent race conditions from rapid filter changes
    const abortController = new AbortController();
    
    setLoading(true);
    setError(null);

    // 300ms debounce implementation
    const timerId = setTimeout(async () => {
      try {
        // Call the service layer. All filtering logic is strictly inside the service.
        const response = await searchBooks(filters);
        
        // If the request was aborted while waiting, do not update state
        if (abortController.signal.aborted) return;
        
        setBooks(response.data);
        setTotal(response.total);
      } catch (err) {
        if (abortController.signal.aborted) return;
        setError("Failed to fetch books. Please try again.");
        console.error("Book search error:", err);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    // Cleanup function: clears timeout and aborts pending request
    return () => {
      clearTimeout(timerId);
      abortController.abort();
    };
  }, [filters]); // Re-run effect whenever filters change

  return { books, loading, error, total };
};
