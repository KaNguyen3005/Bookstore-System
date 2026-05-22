import { useState, useEffect, useCallback } from "react";

import type { Voucher, VoucherStats } from "../types/voucher";

import { voucherService } from "../services/voucherService";

type StatusFilter = "all" | "active" | "inactive";

export const useVouchers = () => {
  const [allVouchers, setAllVouchers] = useState<Voucher[]>([]);

  const [stats, setStats] = useState<VoucherStats>({
    total: 0,
    active: 0,
    used: 0,
    expiringSoon: 0,
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // ================= FETCH =================
  const fetchData = useCallback(async (filter: StatusFilter) => {
    try {
      setLoading(true);

      setError(null);

      let vouchers: Voucher[] = [];

      if (filter === "active") {
        vouchers = await voucherService.getActiveVouchers();
      } else if (filter === "inactive") {
        vouchers = await voucherService.getInactiveVouchers();
      } else {
        vouchers = await voucherService.getVouchers();
      }

      setAllVouchers(vouchers);

      const statsData = await voucherService.getStats(vouchers);

      setStats(statsData);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Lỗi khi tải voucher";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= LOAD =================
  useEffect(() => {
    fetchData(statusFilter);
  }, [statusFilter, fetchData]);

  // ================= REFRESH =================
  const refreshData = useCallback(
    async (filter?: StatusFilter) => {
      await fetchData(filter || statusFilter);
    },
    [fetchData, statusFilter],
  );

  // ================= DELETE =================
  const handleDeleteVoucher = useCallback(
    async (id: string) => {
      const ok = window.confirm("Bạn có chắc chắn muốn xóa voucher này?");

      if (!ok) return;

      try {
        await voucherService.deleteVoucher(id);

        // Cập nhật state cục bộ ngay lập tức để UI biến mất
        setAllVouchers((prev) => prev.filter((v) => v.id !== id));

        // reload lại data để đồng bộ stats và các filter khác
        await refreshData(statusFilter);

        alert("Xóa voucher thành công");
      } catch (error) {
        console.error(error);

        alert("Xóa voucher thất bại");
      }
    },
    [refreshData, statusFilter],
  );

  // ================= COPY =================
  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);

    alert(`Đã sao chép: ${code}`);
  }, []);

  return {
    vouchers: allVouchers,

    stats,

    loading,

    error,

    statusFilter,

    setStatusFilter,

    handleDeleteVoucher,

    handleCopyCode,

    refreshData,
  };
};
