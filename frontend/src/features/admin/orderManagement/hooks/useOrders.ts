import { useState, useEffect, useCallback } from 'react';
import type { Order, OrderStatus } from '../types/order';
import { orderService, type OrdersResponse } from '../services/orderService';

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPING'],
  PROCESSING: ['SHIPPING'],
  SHIPPING: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export const useOrders = () => {
  // ... (states)
  const [data, setData] = useState<OrdersResponse | Order[] | null>(null);
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
          content: (prev as OrdersResponse).content.map(o => o.orderId === id ? { ...o, status: 'CONFIRMED' as OrderStatus } : o)
        } as OrdersResponse;
      });
      alert('Đã phê duyệt đơn hàng thành công');
      return true;
    } catch (err) {
      alert('Lỗi khi phê duyệt đơn hàng');
      return false;
    }
  };

  const handleUpdateStatus = async (id: number, currentStatus: OrderStatus, newStatus: OrderStatus) => {
    // Safety check
    if (!ALLOWED_TRANSITIONS[currentStatus].includes(newStatus)) {
      alert('Chuyển đổi trạng thái không hợp lệ');
      return false;
    }

    try {
      if (newStatus === 'CANCELLED') {
        await orderService.cancelOrder(id);
      } else {
        await orderService.updateOrderStatus(id, newStatus);
      }
      
      // Optimistic update
      setData(prev => {
        if (!prev) return prev;
        if (Array.isArray(prev)) {
          return prev.map(o => o.orderId === id ? { ...o, status: newStatus } : o);
        }
        return {
          ...prev,
          content: (prev as OrdersResponse).content.map(o => o.orderId === id ? { ...o, status: newStatus } : o)
        } as OrdersResponse;
      });
      return true;
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái');
      return false;
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

  // ================= GLOBAL STATS =================
  const [globalStats, setGlobalStats] = useState({
    pending: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  const fetchGlobalStats = useCallback(async () => {
    try {
      // Chỉ gọi API 1 lần duy nhất để lấy toàn bộ dữ liệu (tối đa 100 đơn để thống kê)
      const response = await orderService.getOrders({ size: 100 });
      const allOrders = Array.isArray(response) ? response : (response.content || []);

      setGlobalStats({
        pending: allOrders.filter((o: any) => 
          ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(o.status)
        ).length,
        shipping: allOrders.filter((o: any) => o.status === 'SHIPPING').length,
        delivered: allOrders.filter((o: any) => o.status === 'DELIVERED').length,
        cancelled: allOrders.filter((o: any) => o.status === 'CANCELLED').length,
        totalRevenue: allOrders.reduce((sum: number, o: any) => 
          o.status === 'DELIVERED' ? sum + o.totalAmount : sum, 0
        )
      });
    } catch (err) {
      console.error('Error fetching global stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats, data]); // Refresh stats when data changes (e.g. after approval)

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
    pendingCount: globalStats.pending,
    shippingCount: globalStats.shipping,
    deliveredCount: globalStats.delivered,
    cancelledCount: globalStats.cancelled,
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
    allowedTransitions: ALLOWED_TRANSITIONS,
  };
};
