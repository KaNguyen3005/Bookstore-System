import React from 'react';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';
import type { ProductSummary } from '../types/product';
import '../styles/ProductStats.css';

interface ProductStatsProps {
  summary: ProductSummary;
}

export const ProductStats: React.FC<ProductStatsProps> = ({ summary }) => {
  const stats = [
    { 
      label: 'Tổng sản phẩm', 
      value: summary.total, 
      icon: <Package size={20} />, 
      modifier: 'teal',
      iconModifier: ''
    },
    { 
      label: 'Sản phẩm đang bán', 
      value: summary.inStock, 
      icon: <CheckCircle size={20} />, 
      modifier: '',
      iconModifier: 'stock'
    },
    { 
      label: 'Hết hàng / Tạm ngưng', 
      value: summary.outOfStock, 
      icon: <AlertTriangle size={20} />, 
      modifier: '',
      iconModifier: 'out'
    },
  ];

  return (
    <div className="product-stats">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className={`product-stats__card ${stat.modifier ? `product-stats__card--${stat.modifier}` : ''}`}
        >
          <div className={`product-stats__icon-wrapper ${stat.iconModifier ? `product-stats__icon-wrapper--${stat.iconModifier}` : ''}`}>
            {stat.icon}
          </div>
          <div className="product-stats__info">
            <div className="product-stats__value">{stat.value}</div>
            <div className="product-stats__label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
