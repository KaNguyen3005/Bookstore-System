import { useState, useEffect } from 'react';
import FilterSidebar from '../../components/FilterSidebar';
import BookList from '../../components/BookList';
import TopSellingBooks from '../../../home/components/TopsellingBooks/TopSellingBooks';
import ExploreCategories from '../../../home/components/ExploreCategories/ExploreCategories';

import { useCategories } from '../../hooks/useCategories';
import { useBooks } from '../../hooks/useBooks';
import type { BookFilters } from '../../types/book';
import type { Book } from '../../types/category';
import { bookService } from '../../services/bookService';

const CategoryPage = () => {
  // Centralized state for filters
  const [filters, setFilters] = useState<BookFilters>({
    categoryIds: [],
    publisherIds: [],
    priceRange: null,
  });

  const [topSellingBooks, setTopSellingBooks] = useState<Book[]>([]);

  // Fetch filter data (Categories, Publishers, Prices)
  const { 
    categories, 
    publishers, 
    priceRanges, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useCategories();

  // Fetch books based on current filters
  const { 
    books, 
    loading: booksLoading, 
    error: booksError 
  } = useBooks(filters);

  // Fetch Top Selling Books
  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        const raw = await bookService.getTopSellingBooks(4);
        const formatted = raw.map((b: any) => ({
          bookId: b.book_id,
          book_id: b.book_id,
          title: b.title,
          price: b.price,
          categoryId: b.category_id,
          publisherId: b.publisher_id,
          coverImageUrl: b.cover_image_url
        }));
        setTopSellingBooks(formatted);
      } catch (err) {
        console.error("Failed to fetch top selling books:", err);
      }
    };
    fetchTopSelling();
  }, []);

  const handleFilterChange = (newFilters: BookFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="category-page">
      <main className="category-page__main">

        <div className="category-page__container">
          {/* Left Sidebar */}
          <aside className="category-page__sidebar">
            {categoriesLoading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải bộ lọc...</div>
            ) : categoriesError ? (
              <div style={{ padding: '20px', color: 'red' }}>{categoriesError}</div>
            ) : (
              <FilterSidebar 
                categories={categories}
                publishers={publishers}
                priceRanges={priceRanges}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            )}
          </aside>

          {/* Main Content (Book Grid) */}
          <div className="category-page__content">
            <section>
              <div className="category-page__header">
                <h1 className="category-page__title">Tất Cả Sản Phẩm</h1>

                <div className="category-page__sort">
                  <span className="category-page__sort-label">Sắp xếp theo:</span>
                  <select className="category-page__select">
                    <option>Phổ biến nhất</option>
                    <option>Giá thấp đến cao</option>
                    <option>Giá cao đến thấp</option>
                    <option>Mới nhất</option>
                  </select>
                </div>
              </div>

              {/* Book List - UI Layer only */}
              <BookList books={books} loading={booksLoading} error={booksError} />
            </section>
          </div>
        </div>

        {/* Other Sections */}
        <div className="category-page__bestsellers">
          <TopSellingBooks books={topSellingBooks as any} />
        </div>

        <ExploreCategories />

      </main>
    </div>
  );
};

export default CategoryPage;