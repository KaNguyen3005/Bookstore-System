import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="ui-pagination">
      <button
        className="ui-pagination__btn"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={18} />
        <span>Trước</span>
      </button>

      <div className="ui-pagination__info">
        Trang <span>{currentPage + 1}</span> / {totalPages}
      </div>

      <button
        className="ui-pagination__btn"
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span>Sau</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
