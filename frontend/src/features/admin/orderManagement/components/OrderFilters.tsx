import React from 'react';
import { Search, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/OrderFilters.css';

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  dateRange: { startDate: Date | null, endDate: Date | null };
  onDateRangeChange: (range: { startDate: Date | null, endDate: Date | null }) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange
}) => {
  const statusTabs = [
    'Tất cả', 
    'Chờ xác nhận', 
    'Đã duyệt', 
    'Đang giao', 
    'Đã giao',
    'Hoàn thành', 
    'Đã hủy'
  ];

  const handleQuickDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = now;

    switch (value) {
      case 'today':
        start = new Date();
        start.setHours(0, 0, 0, 0);
        break;
      case 'last7days':
        start = new Date();
        start.setDate(now.getDate() - 7);
        break;
      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'custom':
        return; // Don't change range automatically
      default:
        start = null;
        end = null;
    }

    onDateRangeChange({ startDate: start, endDate: end });
  };

  return (
    <div className="order-filters">
      <div className="order-filters__row">
        {/* Search Section */}
        <div className="search-box">
          <Search className="search-box__icon" size={18} />
          <input 
            type="text" 
            className="search-box__input"
            placeholder="Tìm mã đơn, khách hàng, SĐT..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Date Filter Section */}
        <div className="date-filter">
          <div className="date-filter__group">
            <div className="date-filter__label">
              <Calendar size={16} />
              <span>Thời gian:</span>
            </div>
            <select 
              className="date-filter__select"
              onChange={handleQuickDateChange}
              defaultValue="all"
            >
              <option value="all">Tất cả</option>
              <option value="today">Hôm nay</option>
              <option value="last7days">7 ngày qua</option>
              <option value="thisMonth">Tháng này</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>

          <div className="date-filter__group">
            <div className="date-filter__picker">
              <DatePicker
                selected={dateRange.startDate}
                onChange={(date: Date | null) => onDateRangeChange({ ...dateRange, startDate: date })}
                placeholderText="Từ ngày"
                dateFormat="dd/MM/yyyy"
              />
              <span className="date-filter__divider">-</span>
              <DatePicker
                selected={dateRange.endDate}
                onChange={(date: Date | null) => onDateRangeChange({ ...dateRange, endDate: date })}
                placeholderText="Đến ngày"
                dateFormat="dd/MM/yyyy"
                minDate={dateRange.startDate || undefined}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs Section */}
      <div className="status-tabs">
        {statusTabs.map((tab) => (
          <div 
            key={tab}
            className={`status-tabs__item ${statusFilter === tab ? 'status-tabs__item--active' : ''}`}
            onClick={() => onStatusFilterChange(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};
