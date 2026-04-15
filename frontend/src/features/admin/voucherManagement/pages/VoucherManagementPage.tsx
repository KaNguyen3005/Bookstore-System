import React from 'react';
import { Plus } from 'lucide-react';
import { useVouchers } from '../hooks/useVouchers';
import { VoucherStats } from '../components/VoucherStats';
import { VoucherFilters } from '../components/VoucherFilters';
import { VoucherCard } from '../components/VoucherCard';
import '../styles/VoucherManagement.css';

const VoucherManagementPage: React.FC = () => {
  const {
    vouchers,
    stats,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    handleDeleteVoucher,
    handleCopyCode,
  } = useVouchers();

  return (
    <div className="voucher-mgmt">
      {/* Header */}
      <div className="voucher-mgmt__header">
        <div className="voucher-mgmt__header-info">
          <h1>Quản lý voucher</h1>
          <p>Tạo và quản lý các mã giảm giá cho khách hàng</p>
        </div>
        <button className="voucher-mgmt__btn-create">
          <Plus size={18} />
          + Tạo voucher mới
        </button>
      </div>

      {/* Stats */}
      <VoucherStats stats={stats} />

      {/* Filters */}
      <VoucherFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Voucher Grid */}
      {loading && (
        <div className="voucher-mgmt__empty">Đang tải danh sách voucher...</div>
      )}

      {error && (
        <div className="voucher-mgmt__empty" style={{ color: '#ef4444' }}>
          Lỗi: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="voucher-mgmt__grid">
          {vouchers.length === 0 ? (
            <div className="voucher-mgmt__empty">Không tìm thấy voucher nào.</div>
          ) : (
            vouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                onDelete={handleDeleteVoucher}
                onCopy={handleCopyCode}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VoucherManagementPage;
