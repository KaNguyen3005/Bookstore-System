import React from 'react';
import { Download } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { OrderStats } from '../components/OrderStats';
import { OrderFilters } from '../components/OrderFilters';
import { OrderTable } from '../components/OrderTable';
import { Button } from '../../../../components/ui/Button';
import '../styles/OrderManagement.css';

export const OrderManagement: React.FC = () => {
  const {
    orders,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    ...stats
  } = useOrders();

  return (
    <div className="order-mgmt">
      {/* Header */}
      <div className="order-mgmt__header">
        <div className="order-mgmt__header-info">
          <h1 className="order-mgmt__title">Quản lý đơn hàng</h1>
          <p className="order-mgmt__subtitle">Quản lý toàn bộ đơn hàng trong cửa hàng</p>
        </div>
        <Button variant="outline" className="ui-btn-excel" icon={<Download size={16} />}>
          Xuất Excel
        </Button>
      </div>

      {/* Stats */}
      <OrderStats stats={stats} />

      {/* Main Content Area */}
      <div className="order-mgmt__content">
        <OrderFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        
        <OrderTable orders={orders} loading={loading} />
      </div>
    </div>
  );
};
