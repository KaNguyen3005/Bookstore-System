import React from "react";
import type { ProductSummary } from "../types/product.type";
import { FiBook, FiBox, FiAlertTriangle } from "react-icons/fi";

interface StatCardsProps {
  summary: ProductSummary;
}

const StatCards: React.FC<StatCardsProps> = ({ summary }) => {
  return (
    <div className="stat-cards-container">
      {/* Thẻ Tổng sách */}
      <div className="stat-card stat-card-dark">
        <div className="stat-card-header">
          <div className="icon-wrapper dark-icon">
            <FiBook />
          </div>
          <span className="growth-badge">+12%</span>
        </div>
        <div className="stat-card-body">
          <h3>{summary.total}</h3>
          <p>Tổng sách</p>
        </div>
      </div>

      {/* Thẻ Còn hàng */}
      <div className="stat-card stat-card-light">
        <div className="stat-card-header">
          <div className="icon-wrapper green-icon">
            <FiBox />
          </div>
        </div>
        <div className="stat-card-body">
          <h3>{summary.inStock}</h3>
          <p>Còn hàng</p>
        </div>
      </div>

      {/* Thẻ Hết hàng */}
      <div className="stat-card stat-card-light">
        <div className="stat-card-header">
          <div className="icon-wrapper orange-icon">
            <FiAlertTriangle />
          </div>
        </div>
        <div className="stat-card-body">
          <h3>{summary.outOfStock}</h3>
          <p>Hết hàng</p>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
