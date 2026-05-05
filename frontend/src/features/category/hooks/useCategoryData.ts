import { useState, useEffect } from "react";
import { MOCK_ALL_BOOKS, getTopSellingBooks } from "../../../data/books";
import type { Book } from "../../../product/types/Book";

export const useCategoryData = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [topSellingBooks, setTopSellingBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, these would be API calls
        setAllBooks(MOCK_ALL_BOOKS);
        setTopSellingBooks(getTopSellingBooks(4));
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    allBooks,
    topSellingBooks,
    loading
  };
};
