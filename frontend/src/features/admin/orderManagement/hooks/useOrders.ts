import { useState, useEffect, useCallback } from 'react';
import type { Order, OrderStatus } from '../types/order';
import { orderService, type OrdersResponse } from '../services/orderService';

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPING'],
  PROCESSING: ['SHIPPING'],
  SHIPPING: ['DELIVERED'],
  DELIVERED: ['COMPLETED'],
  COMPLETED: [],
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
      case 'Đã duyệt': return 'CONFIRMED';
      case 'Đang giao': return 'SHIPPING';
      case 'Đã giao': return 'DELIVERED';
      case 'Hoàn thành': return 'COMPLETED';
      case 'Đã hủy': return 'CANCELLED';
      default: return undefined;
    }
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders({
        page,
        size,
        status: statusFilter === 'Tất cả' ? undefined : mapStatusToData(statusFilter),
        keyword: searchTerm,
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
      });
      setData(response);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [page, size, statusFilter, searchTerm, dateRange]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ================= DATA PREPARATION =================
  const rawOrders = Array.isArray(data) ? data : (data?.content ?? []);
  
  // Lọc dữ liệu tại Frontend để đảm bảo chính xác tuyệt đối (phòng trường hợp Backend chưa lọc chuẩn)
  const safeOrders = rawOrders.filter((order: Order) => {
    if (statusFilter === 'Tất cả') return true;
    const mappedStatus = mapStatusToData(statusFilter);
    return order.status === mappedStatus;
  });

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
    confirmed: 0,
    shipping: 0,
    delivered: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  const fetchGlobalStats = useCallback(async () => {
    try {
      const response = await orderService.getOrders({ size: 100 });
      const allOrders = Array.isArray(response) ? response : (response.content || []);

      setGlobalStats({
        pending: allOrders.filter((o: any) => o.status === 'PENDING').length,
        confirmed: allOrders.filter((o: any) => o.status === 'CONFIRMED').length,
        shipping: allOrders.filter((o: any) => o.status === 'SHIPPING').length,
        delivered: allOrders.filter((o: any) => o.status === 'DELIVERED').length,
        completed: allOrders.filter((o: any) => o.status === 'COMPLETED').length,
        cancelled: allOrders.filter((o: any) => o.status === 'CANCELLED').length,
        totalRevenue: allOrders.reduce((sum: number, o: any) => 
          (o.status === 'DELIVERED' || o.status === 'COMPLETED') ? sum + o.totalAmount : sum, 0
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
    confirmedCount: globalStats.confirmed,
    shippingCount: globalStats.shipping,
    deliveredCount: globalStats.delivered,
    completedCount: globalStats.completed,
    cancelledCount: globalStats.cancelled,
    totalRevenue: globalStats.totalRevenue,

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
