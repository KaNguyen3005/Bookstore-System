import React from "react";
import { Search } from "lucide-react";

import type {
  ProductFilters as IProductFilters,
} from "../types/product";

import type { Category } from "../../../book-category/types/category";

import "../styles/ProductFilters.css";

interface ProductFiltersProps {
  filters: IProductFilters;

  categories: Category[];

  onFilterChange: (
    key: keyof IProductFilters,
    value: string
  ) => void;
}

export const ProductFilters: React.FC<
  ProductFiltersProps
> = ({
  filters,
  categories,
  onFilterChange,
}) => {
  const statuses = [
    "Tất cả trạng thái",
    "Đang bán",
    "Hết hàng",
    "Tạm ngưng",
  ];

  return (
    <div className="product-filters">
      <div className="product-filters__left">

        {/* SEARCH */}
        <div className="product-filters__search">
          <Search
            className="product-filters__search-icon"
            size={18}
          />

          <input
            type="text"
            className="product-filters__input"
            placeholder="Tìm mã sản phẩm, tên sách..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange(
                "search",
                e.target.value
              )
            }
          />
        </div>

        {/* CATEGORY */}
        <select
          className="product-filters__select"
          value={filters.category}
          onChange={(e) =>
            onFilterChange(
              "category",
              e.target.value
            )
          }
        >
          <option value="Tất cả thể loại">
            Tất cả thể loại
          </option>

          {categories.map((category) => (
            <option
              key={category.categoryId}
              value={category.categoryName}
            >
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>

      {/* STATUS */}
      <div className="product-filters__right">
        {statuses.map((status) => (
          <div
            key={status}
            className={`product-filters__tab ${
              filters.status === status
                ? "product-filters__tab--active"
                : ""
            }`}
            onClick={() =>
              onFilterChange(
                "status",
                status
              )
            }
          >
            {status}
          </div>
        ))}
      </div>
    </div>
  );
};