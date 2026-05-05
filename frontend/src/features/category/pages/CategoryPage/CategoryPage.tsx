import FilterSidebar from '../../components/FilterSidebar';
import ProductCard from '../../../product/components/ProductCard';
import TopSellingBooks from '../../../home/components/TopsellingBooks/TopSellingBooks';
import ExploreCategories from '../../../home/components/ExploreCategories/ExploreCategories';

import { useCategoryData } from '../../hooks/useCategoryData';

const CategoryPage = () => {
  const { allBooks, topSellingBooks, loading } = useCategoryData();

  if (loading) {
    return (
      <div className="category-page" style={{ padding: '50px', textAlign: 'center' }}>
        <p>Đang tải dữ liệu danh mục...</p>
      </div>
    );
  }

  return (
    <div className="category-page">
      <main className="category-page__main">

        {/* Sidebar + Book Grid */}
        <div className="category-page__container">

          {/* Left Sidebar */}
          <aside className="category-page__sidebar">
            <FilterSidebar />
          </aside>

          {/* Right Content */}
          <div className="category-page__content">

            {/* Section 1: Book Grid */}
            <section>
              <div className="category-page__header">
                <h1 className="category-page__title">Tất Cả Sản Phẩm</h1>

                <div className="category-page__sort">
                  <span className="category-page__sort-label">
                    Sắp xếp theo:
                  </span>

                  <select className="category-page__select">
                    <option>Phổ biến nhất</option>
                    <option>Giá thấp đến cao</option>
                    <option>Giá cao đến thấp</option>
                    <option>Mới nhất</option>
                  </select>
                </div>
              </div>

              <div className="category-page__grid">
                {allBooks.map((book) => (
                  <ProductCard key={book.book_id} book={book} />
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* Section 2: Top Selling Books (FULL WIDTH) */}
        <div className="category-page__bestsellers">
          <TopSellingBooks books={topSellingBooks} />
        </div>

        {/* Section 3: Explore Categories */}
        <ExploreCategories />

      </main>
    </div>
  );
};

export default CategoryPage;