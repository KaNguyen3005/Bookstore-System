import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';

import { useProducts } from '../hooks/useProducts';

import { ProductStats } from '../components/ProductStats';
import { ProductFilters } from '../components/ProductFilters';
import { ProductTable } from '../components/ProductTable';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { ProductEditModal } from '../components/ProductEditModal';
import type { Book } from '../../../product/types/Book';
import { Pagination } from '../../orderManagement/components/Pagination';

// Popup thêm sản phẩm
import { CreateProductModal } from '../components/CreateProductModal';

import { Button } from '../../../../components/ui/Button';

import '../styles/ProductManagement.css';

const ProductManagementPage: React.FC = () => {

  // ================= MODAL STATE =================
  const [openCreateModal, setOpenCreateModal] =
    useState(false);
  const [detailProduct, setDetailProduct] =
    useState<Book | null>(null);
  const [editingProduct, setEditingProduct] =
    useState<Book | null>(null);

  const {
    products,
    categories,
    summary,
    currentPage,
    totalPages,
    setPage,
    loading,
    filters,
    handleFilterChange,
    handleDeleteProduct,
    handleUpdateStatus,
    handleCreateProduct,
    handleUpdateProduct,
    createLoading,
    updateLoading,
  } = useProducts();

  return (
    <div className="product-mgmt">

      {/* Header */}
      <div className="product-mgmt__header">
        <div>
          <h1 className="product-mgmt__title">
            Quản lý sản phẩm
          </h1>

          <p className="product-mgmt__subtitle">
            Xem, quản lý và cập nhật kho sách của bạn
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
          }}
        >
          {/* EXPORT */}
          <Button
            variant="outline"
            className="ui-btn-excel"
            icon={<Download size={18} />}
          >
            Xuất Excel
          </Button>

          {/* CREATE PRODUCT */}
          <Button
            variant="primary"
            className="ui-btn-teal"
            icon={<Plus size={18} />}
            onClick={() =>
              setOpenCreateModal(true)
            }
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Summary */}
      <ProductStats summary={summary} />

      {/* Content */}
      <div className="product-mgmt__content">

        <ProductFilters
          filters={filters}
          categories={categories}
          onFilterChange={
            handleFilterChange
          }
        />

        <ProductTable
          products={products}
          loading={loading}
          onView={setDetailProduct}
          onEdit={setEditingProduct}
          onDelete={handleDeleteProduct}
          onUpdateStatus={
            handleUpdateStatus
          }
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* ================= CREATE PRODUCT MODAL ================= */}
      <CreateProductModal
        open={openCreateModal}
        onClose={() =>
          setOpenCreateModal(false)
        }
        onCreate={handleCreateProduct}
        loading={createLoading}
      />

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
      />

      <ProductEditModal
        product={editingProduct}
        loading={updateLoading}
        onClose={() => setEditingProduct(null)}
        onUpdate={handleUpdateProduct}
      />
    </div>
  );
};

export default ProductManagementPage;
