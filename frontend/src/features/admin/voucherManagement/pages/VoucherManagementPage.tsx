import React, { useState } from "react";

import { Plus } from "lucide-react";

import { useVouchers } from "../hooks/useVouchers";

import { VoucherStats } from "../components/VoucherStats";

import { VoucherFilters } from "../components/VoucherFilters";

import { VoucherCard } from "../components/VoucherCard";

import VoucherCreateModal from "../components/VoucherCreateModal";

import "../styles/VoucherManagement.css";

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

    refreshData,
  } = useVouchers();

  // ================= CREATE MODAL =================
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="voucher-mgmt__empty">
        ⏳ Đang tải danh sách voucher...
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="voucher-mgmt__empty" style={{ color: "#ef4444" }}>
         {error}
      </div>
    );
  }

  return (
    <>
      <div className="voucher-mgmt">
        {/* HEADER */}
        <div className="voucher-mgmt__header">
          <div className="voucher-mgmt__header-info">
            <h1>Quản lý voucher</h1>

            <p>Tạo và quản lý các mã giảm giá cho khách hàng</p>
          </div>

          <button
            className="voucher-mgmt__btn-create"
            onClick={() => setOpenCreateModal(true)}
          >
            <Plus size={18} />+ Tạo voucher mới
          </button>
        </div>

        {/* STATS */}
        <VoucherStats stats={stats} />

        {/* FILTERS */}
        <VoucherFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* GRID */}
        <div className="voucher-mgmt__grid">
          {vouchers.length === 0 ? (
            <div className="voucher-mgmt__empty">
              Không tìm thấy voucher nào.
            </div>
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
      </div>

      {/* ================= CREATE MODAL ================= */}
      <VoucherCreateModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={refreshData}
      />
    </>
  );
};

export default VoucherManagementPage;
