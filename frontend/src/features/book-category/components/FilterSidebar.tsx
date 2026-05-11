import React from "react";
import type { BookFilters } from "../types/bookFilter";
import type { Category, Publisher, PriceRange } from "../types/category";
import "./FilterSidebar.css";

interface FilterSidebarProps {
  filters: BookFilters;
  onFilterChange: (newFilters: Partial<BookFilters>) => void;
  categories: Category[];
  publishers: Publisher[];
  priceRanges: PriceRange[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  categories,
  publishers,
  priceRanges,
}) => {
  return (
    <aside className="filter-sidebar">
      <h2 className="filter-sidebar__title">Bộ lọc tìm kiếm</h2>

      {/* Categories Section */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__section-title">Danh mục</h3>

        <ul className="filter-sidebar__list">
          {categories.map((cat) => (
            <li key={cat.categoryId}>
              {/* Category cha */}
              <div className="filter-sidebar__item">
                <label className="filter-sidebar__label">
                  <input
                    type="checkbox"
                    className="filter-sidebar__checkbox"
                    checked={filters.categoryId === cat.categoryId}
                    onChange={() => {
                      onFilterChange({
                        categoryId:
                          filters.categoryId === cat.categoryId
                            ? undefined
                            : cat.categoryId,
                      });
                    }}
                  />

                  <span>{cat.categoryName}</span>
                </label>
              </div>

              {/* Category con */}
              {cat.children && cat.children.length > 0 && (
                <ul className="filter-sidebar__sublist">
                  {cat.children.map((child) => (
                    <li
                      key={child.categoryId}
                      className="filter-sidebar__subitem"
                    >
                      <label className="filter-sidebar__label">
                        <input
                          type="checkbox"
                          className="filter-sidebar__checkbox"
                          checked={filters.categoryId === child.categoryId}
                          onChange={() => {
                            onFilterChange({
                              categoryId:
                                filters.categoryId === child.categoryId
                                  ? undefined
                                  : child.categoryId,
                            });
                          }}
                        />

                        <span>{child.categoryName}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Price Ranges Section */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__section-title">Khoảng giá</h3>

        <ul className="filter-sidebar__list">
          {priceRanges.map((range) => {
            const isChecked =
              filters.minPrice === range.minPrice &&
              (filters.maxPrice ?? null) === (range.maxPrice ?? null);

            return (
              <li key={range.label} className="filter-sidebar__item">
                <label className="filter-sidebar__label">
                  <input
                    type="checkbox"
                    className="filter-sidebar__checkbox"
                    checked={isChecked}
                    onChange={() => {
                      if (isChecked) {
                        onFilterChange({
                          minPrice: undefined,
                          maxPrice: undefined,
                        });

                        return;
                      }

                      onFilterChange({
                        minPrice: range.minPrice,
                        maxPrice: range.maxPrice,
                      });
                    }}
                  />

                  <span>{range.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Publishers Section */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__section-title">
          Nhà xuất bản
        </h3>

        <ul className="filter-sidebar__list">
          {publishers.map((pub) => (
            <li key={pub.publisherId} className="filter-sidebar__item">
              <label className="filter-sidebar__label">
                <input
                  type="checkbox"
                  className="filter-sidebar__checkbox"
                  checked={filters.publisherId === pub.publisherId}
                  onChange={() => {
                    onFilterChange({
                      publisherId:
                        filters.publisherId === pub.publisherId
                          ? undefined
                          : pub.publisherId,
                    });
                  }}
                />

                <span>{pub.publisherName}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default FilterSidebar;