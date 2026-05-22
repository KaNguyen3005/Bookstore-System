import { useEffect, useState } from "react";
import { aiRcmApi } from "../../../services/ai-rcmApi";
import type { Book } from "../../features/product/types/Book";

export const useAISuggestion = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await aiRcmApi.getHybridRecommendations(10);
        setBooks(data);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { books, loading };
};