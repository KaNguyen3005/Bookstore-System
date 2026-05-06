import React from 'react';
import type { BookFilters } from '../types/filter';
import type { Category } from '../../../data/categoriesData';
import type { Publisher } from '../../../data/publishersData';
import type { PriceRange } from '../../../data/priceRangesData';
import './FilterSidebar.css';

interface FilterSidebarProps {
  filters: BookFilters;
  onFilterChange: (newFilters: Partial<BookFilters>) => void;
  categories: Category[];
  publishers: Publisher[];
  priceRanges: PriceRange[];
}

/**
 * Pure UI component for the filtering sidebar.
 * It renders categories, price ranges, and publishers using checkboxes.
 * Triggers realtime filtering via onFilterChange.
 */
const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  categories,
  publishers,
  priceRanges
}) => {
  return (
    <aside className="filter-sidebar">
      <h2 className="filter-sidebar__title">Bộ lọc tìm kiếm</h2>
      
      {/* Categories Section */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__section-title">Danh mục</h3>
        <ul className="filter-sidebar__list">
          {categories.map((cat) => (
            <li key={cat.id} className="filter-sidebar__item">
              <label className="filter-sidebar__label">
                <input
                  type="checkbox"
                  className="filter-sidebar__checkbox"
                  checked={filters.categoryId === cat.id}
                  onChange={() => {
                    // Realtime filtering: no Apply button, updates immediately
                    onFilterChange({ categoryId: filters.categoryId === cat.id ? undefined : cat.id });
                  }}
                />
                <span>{cat.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Ranges Section */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__section-title">Khoảng giá</h3>
        <ul className="filter-sidebar__list">
          {priceRanges.map((range) => (
            <li key={range.id} className="filter-sidebar__item">
              <label className="filter-sidebar__label">
                <input
                  type="checkbox"
                  className="filter-sidebar__checkbox"
                  checked={filters.priceRangeId === range.id}
                  onChange={() => {
                    // Realtime filtering: no Apply button, updates immediately
                    onFilterChange({ priceRangeId: filters.priceRangeId === range.id ? undefined : range.id });
                  }}
                />
                <span>{range.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Publishers Section */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__section-title">Nhà xuất bản</h3>
        <ul className="filter-sidebar__list">
          {publishers.map((pub) => (
            <li key={pub.id} className="filter-sidebar__item">
              <label className="filter-sidebar__label">
                <input
                  type="checkbox"
                  className="filter-sidebar__checkbox"
                  checked={filters.publisherId === pub.id}
                  onChange={() => {
                    // Realtime filtering: no Apply button, updates immediately
                    onFilterChange({ publisherId: filters.publisherId === pub.id ? undefined : pub.id });
                  }}
                />
                <span>{pub.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default FilterSidebar;
