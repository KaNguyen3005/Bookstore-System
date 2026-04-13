import React from "react";
import type { ProductFilters } from "../types/product.type";
import { FiFilter } from "react-icons/fi";

interface FilterBarProps {
  filters: ProductFilters;
  onFilterChange: (key: keyof ProductFilters, value: string) => void;
  totalProducts: number;
  totalFiltered: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, totalProducts, totalFiltered }) => {
  return (
    <div className="filter-bar">
      <div className="filter-left">
        <div className="filter-label">
          <FiFilter /> Bộ lọc:
        </div>
        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
        >
          <option value="Tất cả thể loại">Tất cả thể loại</option>
          <option value="Văn học">Văn học</option>
          <option value="Công nghệ">Công nghệ</option>
          <option value="Kỹ năng sống">Kỹ năng sống</option>
          {/* Mock thêm vài thể loại nếu cần */}
        </select>

        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
        >
          <option value="Tất cả trạng thái">Tất cả trạng thái</option>
          <option value="Đang bán">Đang bán</option>
          <option value="Hết hàng">Hết hàng</option>
          <option value="Tạm ngưng">Tạm ngưng</option>
        </select>
      </div>
      <div className="filter-right">
        <span>Hiển thị {totalFiltered} / {totalProducts} sản phẩm</span>
      </div>
    </div>
  );
};

export default FilterBar;
