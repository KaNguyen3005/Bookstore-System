import React from "react";
import { FiDownload, FiPlus, FiSearch } from "react-icons/fi";
import { useProductManagement } from "../hooks/useProductManagement";
import StatCards from "../components/StatCards";
import FilterBar from "../components/FilterBar";
import ProductTable from "../components/ProductTable";
import "./ProductManagement.css";

const ProductManagement: React.FC = () => {
  const {
    products,
    summary,
    loading,
    filters,
    handleFilterChange,
    handleDeleteProduct
  } = useProductManagement();

  return (
    <div className="product-management-page">
      {/* Header */}
      <div className="page-header bg-white">
        <div className="title-section">
          <h1 className="page-title">Quản lý sản phẩm</h1>
          <p className="page-subtitle">Quản lý toàn bộ sản phẩm sách trong cửa hàng</p>
        </div>
        <div className="action-buttons">
          <button className="btn-outline-admin">
            <FiDownload className="icon" /> Xuất Excel
          </button>
          <button className="btn-primary-admin">
            <FiPlus className="icon" /> Thêm sách mới
          </button>
        </div>
      </div>

      {/* Thống kê */}
      <StatCards summary={summary} />

      {/* Lọc & Bảng sản phẩm */}
      <div className="table-container bg-white mt-4">
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          totalProducts={summary.total}
          totalFiltered={products.length}
        />

        <ProductTable
          products={products}
          onDelete={handleDeleteProduct}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ProductManagement;
