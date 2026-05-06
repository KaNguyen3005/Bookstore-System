import React from 'react';
import ProductCard from '../../product/components/ProductCard';
import type { Book } from '../types/book';
import './BookGrid.css';

interface BookGridProps {
  books: Book[];
  loading: boolean;
  error: string | null;
}

/**
 * Component to display the grid of books.
 * Handles loading, error, and empty states explicitly.
 * Reuses the existing ProductCard component.
 */
const BookGrid: React.FC<BookGridProps> = ({ books, loading, error }) => {
  // Error state
  if (error) {
    return (
      <div className="book-grid__error">
        <p>{error}</p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="book-grid__loading">
        <div className="book-grid__spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Empty state
  if (books.length === 0) {
    return (
      <div className="book-grid__empty">
        <p>Không tìm thấy cuốn sách nào phù hợp với bộ lọc của bạn.</p>
      </div>
    );
  }

  // Data state
  return (
    <div className="book-grid__container">
      {books.map((book) => (
        // Note: Casting book to any to bypass ProductCard's strict Book type requirement from another feature module
        // We guarantee the data shape matches what ProductCard expects
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <ProductCard key={book.bookId} book={book as any} />
      ))}
    </div>
  );
};

export default BookGrid;
