import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { OrderStats } from '../components/OrderStats';
import { OrderFilters } from '../components/OrderFilters';
import { OrderTable } from '../components/OrderTable';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { Pagination } from '../components/Pagination';
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
    totalPages,
    currentPage,
    setPage,
    handleApprove,
    handleUpdateStatus,
    handleExport,
    handlePrintInvoice,
    allowedTransitions,
    ...stats
  } = useOrders();

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  return (
    <div className="order-mgmt">
      {/* Header */}
      <div className="order-mgmt__header">
        <div className="order-mgmt__header-info">
          <h1 className="order-mgmt__title">Quản lý đơn hàng</h1>
          <p className="order-mgmt__subtitle">Quản lý toàn bộ đơn hàng trong cửa hàng</p>
        </div>
        <Button 
          variant="outline" 
          className="ui-btn-excel" 
          icon={<Download size={16} />}
          onClick={handleExport}
        >
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
        
        <OrderTable 
          orders={orders} 
          loading={loading} 
          allowedTransitions={allowedTransitions}
          onViewDetail={setSelectedOrderId}
          onApprove={handleApprove}
          onUpdateStatus={handleUpdateStatus}
          onPrintInvoice={handlePrintInvoice}
        />

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Modal */}
      <OrderDetailModal 
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
};
