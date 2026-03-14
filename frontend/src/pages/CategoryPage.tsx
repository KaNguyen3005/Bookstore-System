import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FilterSidebar from '../components/category/FilterSidebar';
import ProductCard from '../components/product/ProductCard';
import TopSellingBooks from '../components/home/TopSellingBooks';
import ExploreCategories from '../components/home/ExploreCategories';

import { mockCategoryBooks } from '../Data/mockCategoryBooks';
import { TOP_SELLING_BOOKS } from '../Data/homeBooks';

const CategoryPage = () => {
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
                <h1 className="category-page__title">Danh Mục Sách</h1>

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
                {mockCategoryBooks.map((book) => (
                  <ProductCard key={book.id} book={book} />
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* Section 2: Top Selling Books (FULL WIDTH) */}
        <div className="category-page__bestsellers">
          <TopSellingBooks books={TOP_SELLING_BOOKS} />
        </div>

        {/* Section 3: Explore Categories */}
        <ExploreCategories />

      </main>
    </div>
  );
};

export default CategoryPage;