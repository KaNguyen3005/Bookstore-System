import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Voucher, VoucherStats } from '../types/voucher';
import { voucherService } from '../services/voucherService';

type StatusFilter = 'all' | 'active' | 'inactive';

export const useVouchers = () => {
  const [allVouchers, setAllVouchers] = useState<Voucher[]>([]);
  const [stats, setStats] = useState<VoucherStats>({ total: 0, active: 0, used: 0, expiringSoon: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const vouchers = await voucherService.getVouchers();
      setAllVouchers(vouchers);
      const computedStats = await voucherService.getStats(vouchers);
      setStats(computedStats);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải danh sách voucher.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Logic: Filter by status (in Hook)
  const filteredVouchers = useMemo(() => {
    if (statusFilter === 'all') return allVouchers;
    if (statusFilter === 'active') return allVouchers.filter((v) => v.status === 'active');
    if (statusFilter === 'inactive') return allVouchers.filter((v) => v.status === 'inactive');
    return allVouchers;
  }, [allVouchers, statusFilter]);

  const handleDeleteVoucher = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;
    try {
      await voucherService.deleteVoucher(id);
      setAllVouchers((prev) => prev.filter((v) => v.id !== id));
      fetchData();
    } catch {
      alert('Đã xảy ra lỗi khi xóa voucher.');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      alert(`Đã sao chép mã: ${code}`);
    });
  };

  return {
    vouchers: filteredVouchers,
    stats,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    handleDeleteVoucher,
    handleCopyCode,
    refreshData: fetchData,
  };
};
