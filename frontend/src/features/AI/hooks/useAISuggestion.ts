import { useEffect, useState } from "react";
import { aiRcmApi } from "../../../services/ai-rcmApi";
import { useAuth } from "../../auth/hooks/useAuth";
import type { Book } from "../../product/types/Book";

const hasAuthToken = () => Boolean(localStorage.getItem("access_token"));

export const useAISuggestion = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !hasAuthToken()) {
      setBooks([]);
      setLoading(false);
      return;
    }

    let ignore = false;

    const fetch = async () => {
      try {
        setLoading(true);
        const data = await aiRcmApi.getHybridRecommendations(10);
        if (!ignore) setBooks(data);
      } catch (error) {
        console.error("AI suggestions error:", error);
        if (!ignore) setBooks([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetch();

    return () => {
      ignore = true;
    };
  }, [authLoading, isAuthenticated]);

  return { books, loading };
};
