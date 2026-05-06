import React, { useState, useEffect } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import BookGrid from '../components/BookGrid';
import { useBookSearch } from '../hooks/useBookSearch';
import type { BookFilters } from '../types/filter';
import type { Book } from '../types/book';
import { categoriesData } from '../../../data/categoriesData';
import { publishersData } from '../../../data/publishersData';
import { priceRangesData } from '../../../data/priceRangesData';
import { getTopSellingBooks } from '../services/bookService';
import './CategoryPage.css';

/**
 * Main container component for the Category Page.
 * Manages the global filter state and orchestrates data fetching via useBookSearch hook.
 */
const CategoryPage: React.FC = () => {
  // Initialize filter state
  const [filters, setFilters] = useState<BookFilters>({
    page: 0
  });

  const [topSellingBooks, setTopSellingBooks] = useState<Book[]>([]);

  // Fetch books using custom hook with current filters
  const { books, loading, error, total } = useBookSearch(filters);

  // Fetch top selling books once on mount
  useEffect(() => {
    const fetchTopSelling = async () => {
      const data = await getTopSellingBooks(10);
      setTopSellingBooks(data);
    };
    fetchTopSelling();
  }, []);

  // Handle filter changes from the sidebar
  const handleFilterChange = (newFilters: Partial<BookFilters>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
      page: 0 // Always reset to first page when changing filters
    }));
  };

  return (
    <div className="category-page">
      <div className="category-page__header">
        <h1 className="category-page__title">Danh mục sản phẩm</h1>
        <p className="category-page__subtitle">Tìm thấy {total} kết quả</p>
      </div>
      
      <div className="category-page__content">
        {/* Sidebar Component (Pure UI) */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categoriesData}
          publishers={publishersData}
          priceRanges={priceRangesData}
        />
        
        {/* Main Grid Component */}
        <main className="category-page__main">
          <BookGrid books={books} loading={loading} error={error} />
        </main>
      </div>

      {/* Top Selling Section */}
      <section className="category-page__top-selling">
        <h2 className="category-page__section-title">TOP SÁCH BÁN CHẠY NHẤT</h2>
        <div className="category-page__top-grid">
          <BookGrid books={topSellingBooks} loading={false} error={null} />
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
