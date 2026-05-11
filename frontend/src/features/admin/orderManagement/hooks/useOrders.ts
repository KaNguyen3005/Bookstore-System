import { useState, useEffect, useCallback } from 'react';
import type { Order, OrderStatus } from '../types/order';
import { orderService, type OrdersResponse } from '../services/orderService';

export const useOrders = () => {
  // ================= STATES =================
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  // ================= MAPPERS =================
  const mapStatusToData = (uiStatus: string): string | undefined => {
    switch (uiStatus) {
      case 'Chờ xác nhận': return 'PENDING';
      case 'Đang xử lý': return 'PROCESSING';
      case 'Đang giao': return 'SHIPPING';
      case 'Thành công': return 'DELIVERED';
      case 'Đã hủy': return 'CANCELLED';
      default: return undefined;
    }
  };

  // ================= FETCH LOGIC =================
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrders({
        page,
        size,
        keyword: searchTerm || undefined,
        status: mapStatusToData(statusFilter),
        startDate: dateRange.startDate?.toISOString().split('T')[0],
        endDate: dateRange.endDate?.toISOString().split('T')[0],
      });

      console.log('ORDER API RESPONSE:', response);
      setData(response);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Đã xảy ra lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [page, size, searchTerm, statusFilter, dateRange]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Helper để lấy danh sách orders an toàn
  const safeOrders = Array.isArray(data) ? data : (data?.content ?? []);

  // ================= HANDLERS =================
  const handleApprove = async (id: number) => {
    try {
      await orderService.approveOrder(id);
      // Optimistic update
      setData(prev => {
        if (!prev) return prev;
        if (Array.isArray(prev)) {
          return prev.map(o => o.orderId === id ? { ...o, status: 'CONFIRMED' as OrderStatus } : o);
        }
        return {
          ...prev,
          content: prev.content.map(o => o.orderId === id ? { ...o, status: 'CONFIRMED' as OrderStatus } : o)
        };
      });
      alert('Đã phê duyệt đơn hàng thành công');
    } catch (err) {
      alert('Lỗi khi phê duyệt đơn hàng');
    }
  };

  const handleUpdateStatus = async (id: number, status: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(id, status);
      // Optimistic update
      setData(prev => {
        if (!prev) return prev;
        if (Array.isArray(prev)) {
          return prev.map(o => o.orderId === id ? { ...o, status } : o);
        }
        return {
          ...prev,
          content: prev.content.map(o => o.orderId === id ? { ...o, status } : o)
        };
      });
      alert('Cập nhật trạng thái thành công');
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await orderService.exportOrders();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      alert('Lỗi khi xuất file Excel');
    }
  };

  return {
    // Data
    orders: safeOrders,
    totalOrders: Array.isArray(data) ? data.length : (data?.totalElements ?? 0),
    totalPages: Array.isArray(data) ? 1 : (data?.totalPages ?? 0),
    currentPage: page,
    pageSize: size,
    loading,
    error,

    // Stats
    pendingCount: safeOrders.filter(o => o.status === 'PENDING').length,
    shippingCount: safeOrders.filter(o => o.status === 'SHIPPING').length,
    deliveredCount: safeOrders.filter(o => o.status === 'DELIVERED').length,
    cancelledCount: safeOrders.filter(o => o.status === 'CANCELLED').length,
    totalRevenue: safeOrders.reduce((sum, o) => o.status === 'DELIVERED' ? sum + o.totalAmount : sum, 0),

    // Controls
    setPage,
    setSize,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,

    // Actions
    handleApprove,
    handleUpdateStatus,
    handleExport,
    refresh: fetchOrders,
  };
};
