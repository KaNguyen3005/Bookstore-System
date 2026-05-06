import { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';
import type { BookFilters } from '../types/book';
import type { Book } from '../types/category';

export const useBooks = (filters: BookFilters) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        // No frontend filtering allowed here! Just call the service.
        const booksRaw = await bookService.getBooks(filters);

        // Convert snake_case to camelCase
        const formattedBooks = booksRaw.map((book: any) => ({
          bookId: book.book_id,
          book_id: book.book_id, // Compatibility for ProductCard
          title: book.title,
          price: book.price,
          categoryId: book.category_id,
          publisherId: book.publisher_id,
          salePercent: book.sale_percent,
          coverImageUrl: book.cover_image_url,
          oldPrice: book.oldPrice,
          avgRating: book.avg_rating,
          reviewCount: book.reviewCount,
        }));

        setBooks(formattedBooks);
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải danh sách sách');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [filters]); // Refetch when filters change

  return { books, loading, error };
};
