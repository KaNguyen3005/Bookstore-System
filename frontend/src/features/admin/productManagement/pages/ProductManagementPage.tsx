import React from 'react';
import { Plus, Download } from 'lucide-react';

import { useProducts } from '../hooks/useProducts';

import { ProductStats } from '../components/ProductStats';
import { ProductFilters } from '../components/ProductFilters';
import { ProductTable } from '../components/ProductTable';

import { Button } from '../../../../components/ui/Button';

import '../styles/ProductManagement.css';

const ProductManagementPage: React.FC = () => {
  const {
    products,
    categories,
    summary,
    loading,
    filters,
    handleFilterChange,
    handleDeleteProduct,
    handleUpdateStatus,
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
          <Button
            variant="outline"
            className="ui-btn-excel"
            icon={<Download size={18} />}
          >
            Xuất Excel
          </Button>

          <Button
            variant="primary"
            className="ui-btn-teal"
            icon={<Plus size={18} />}
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
          onDelete={handleDeleteProduct}
          onUpdateStatus={
            handleUpdateStatus
          }
        />
      </div>
    </div>
  );
};

export default ProductManagementPage;