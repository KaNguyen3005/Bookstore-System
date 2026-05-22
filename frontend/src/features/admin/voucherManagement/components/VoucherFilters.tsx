import React from 'react';
import '../styles/VoucherFilters.css';

type StatusFilter = 'all' | 'active' | 'inactive';

interface VoucherFiltersProps {
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
}

const TABS: { label: string; value: StatusFilter }[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang hoạt động', value: 'active' },
  { label: 'Không hoạt động', value: 'inactive' },
];

export const VoucherFilters: React.FC<VoucherFiltersProps> = ({
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="voucher-filters">
      <span className="voucher-filters__label">Lọc:</span>
      {TABS.map((tab) => (
        <button
          key={tab.value}
          className={`voucher-filters__tab ${statusFilter === tab.value ? 'voucher-filters__tab--active' : ''}`}
          onClick={() => onStatusFilterChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
