import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import type { AdminProduct } from '../types/product';
import '../styles/ProductTable.css';

interface ProductTableProps {
  products: AdminProduct[];
  loading: boolean;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: AdminProduct['status']) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  onDelete,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
  };

  const getBadgeClass = (status: AdminProduct['status']) => {
    switch (status) {
      case 'Đang bán': return 'product-badge--success';
      case 'Hết hàng': return 'product-badge--danger';
      case 'Tạm ngưng': return 'product-badge--warning';
      default: return '';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Đang tải danh sách sản phẩm...</div>;
  }

  return (
    <div className="product-table__wrapper">
      <table className="product-table">
        <thead className="product-table__thead">
          <tr>
            <th className="product-table__th">ID</th>
            <th className="product-table__th">Sản phẩm</th>
            <th className="product-table__th">Thể loại</th>
            <th className="product-table__th">Giá bán</th>
            <th className="product-table__th">Kho hàng</th>
            <th className="product-table__th">Đã bán</th>
            <th className="product-table__th">Trạng thái</th>
            <th className="product-table__th">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="product-table__tr">
              <td className="product-table__td">{product.id}</td>
              <td className="product-table__td">
                <div className="product-table__info">
                  <img src={product.thumbnail} alt={product.name} className="product-table__img" />
                  <div>
                    <div className="product-table__name">{product.name}</div>
                    <div className="product-table__author">{product.author}</div>
                  </div>
                </div>
              </td>
              <td className="product-table__td">
                <span className="product-table__category">{product.category}</span>
              </td>
              <td className="product-table__td">
                <span className="product-table__price">{formatCurrency(product.price)}</span>
              </td>
              <td className="product-table__td">
                <span className={`product-table__stock ${product.stock === 0 ? 'product-table__stock--out' : ''}`}>
                  {product.stock}
                </span>
              </td>
              <td className="product-table__td">{product.sold}</td>
              <td className="product-table__td">
                <span className={`product-badge ${getBadgeClass(product.status)}`}>
                  {product.status}
                </span>
              </td>
              <td className="product-table__td">
                <div className="product-table__actions">
                  <Edit className="product-table__action product-table__action--edit" size={18} />
                  <Trash2 
                    className="product-table__action product-table__action--delete" 
                    size={18} 
                    onClick={() => onDelete(product.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
