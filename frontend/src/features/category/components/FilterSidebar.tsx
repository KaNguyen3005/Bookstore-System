import '../pages/CategoryPage/CategoryPage.css';
import type { Category, Publisher, PriceRange } from '../types/category';
import type { BookFilters } from '../types/book';

interface FilterSidebarProps {
  categories: Category[];
  publishers: Publisher[];
  priceRanges: PriceRange[];
  filters: BookFilters;
  onFilterChange: (newFilters: BookFilters) => void;
}

const FilterSidebar = ({
  categories,
  publishers,
  priceRanges,
  filters,
  onFilterChange,
}: FilterSidebarProps) => {

  const handleCategoryChange = (categoryId: number) => {
    const newCategoryIds = filters.categoryIds.includes(categoryId)
      ? filters.categoryIds.filter((id) => id !== categoryId)
      : [...filters.categoryIds, categoryId];
    
    onFilterChange({ ...filters, categoryIds: newCategoryIds });
  };

  const handlePublisherChange = (publisherId: number) => {
    const newPublisherIds = filters.publisherIds.includes(publisherId)
      ? filters.publisherIds.filter((id) => id !== publisherId)
      : [...filters.publisherIds, publisherId];
      
    onFilterChange({ ...filters, publisherIds: newPublisherIds });
  };

  const handlePriceChange = (price: PriceRange) => {
    const isSamePrice = filters.priceRange?.min === price.minPrice && filters.priceRange?.max === price.maxPrice;
    
    if (isSamePrice) {
      onFilterChange({ ...filters, priceRange: null });
    } else {
      onFilterChange({ ...filters, priceRange: { min: price.minPrice, max: price.maxPrice } });
    }
  };

  return (
    <div className="filter-sidebar">
      <h2 className="filter-sidebar__header">Bộ Lọc</h2>

      {/* Danh Mục */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">Danh Mục</h3>
        <div className="filter-sidebar__list">
          {categories.map((cat) => (
            <label key={cat.categoryId} className="filter-sidebar__item">
              <input
                type="checkbox"
                className="filter-sidebar__checkbox"
                checked={filters.categoryIds.includes(cat.categoryId)}
                onChange={() => handleCategoryChange(cat.categoryId)}
              />
              <span className="filter-sidebar__label">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Giá */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">Giá</h3>
        <div className="filter-sidebar__list">
          {priceRanges.map((price) => (
            <label key={price.id} className="filter-sidebar__item">
              <input
                type="checkbox"
                className="filter-sidebar__checkbox"
                checked={filters.priceRange?.min === price.minPrice && filters.priceRange?.max === price.maxPrice}
                onChange={() => handlePriceChange(price)}
              />
              <span className="filter-sidebar__label">{price.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Nhà Xuất Bản */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">Nhà Xuất Bản</h3>
        <div className="filter-sidebar__list">
          {publishers.map((pub) => (
            <label key={pub.publisherId} className="filter-sidebar__item">
              <input
                type="checkbox"
                className="filter-sidebar__checkbox"
                checked={filters.publisherIds.includes(pub.publisherId)}
                onChange={() => handlePublisherChange(pub.publisherId)}
              />
              <span className="filter-sidebar__label">{pub.publisherName}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
