import React from "react";
import type { AdminProduct } from "../types/product.type";
import StatusBadge from "./StatusBadge";
import { FiEye, FiTrash2, FiEdit2 } from "react-icons/fi";

interface ProductTableProps {
  products: AdminProduct[];
  onDelete: (id: number) => void;
  loading: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onDelete, loading }) => {
  if (loading) {
    return <div className="table-loading">Đang tải dữ liệu...</div>;
  }

  if (products.length === 0) {
    return <div className="table-empty">Không tìm thấy sản phẩm nào.</div>;
  }

  return (
    <div className="product-table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Sản phẩm</th>
            <th>Tác giả</th>
            <th>Thể loại</th>
            <th>Giá bán</th>
            <th>Tồn kho</th>
            <th>Đã bán</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td><input type="checkbox" /></td>
              <td className="product-info-cell">
                <img src={product.thumbnail} alt={product.name} className="product-thumb" />
                <div className="product-name-col">
                  <span className="product-name-text" title={product.name}>{product.name}</span>
                  <span className="product-id-text">ID: #{product.id}</span>
                </div>
              </td>
              <td>{product.author}</td>
              <td>
                <span className="category-tag">{product.category}</span>
              </td>
              <td className="price-text">{product.price.toLocaleString("vi-VN")}đ</td>
              <td>{product.stock}</td>
              <td>{product.sold}</td>
              <td>
                <StatusBadge status={product.status} />
              </td>
              <td className="action-cell">
                <button className="action-btn view-btn" title="Xem">
                  <FiEye />
                </button>
                <button
                  className="action-btn delete-btn"
                  title="Xóa"
                  onClick={() => onDelete(product.id)}
                >
                  <FiTrash2 />
                </button>
                <button className="action-btn edit-btn" title="Sửa">
                  <FiEdit2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
