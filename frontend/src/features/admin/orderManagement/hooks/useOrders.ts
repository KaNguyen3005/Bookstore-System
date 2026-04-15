import { useState, useEffect, useMemo } from 'react';
import type { Order } from '../types/order';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null, endDate: Date | null }>({
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper: Parse date string "DD/MM/YYYY" to Date object
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Helper: Map UI labels to internal data status
  const mapStatusToData = (uiStatus: string): string | null => {
    switch (uiStatus) {
      case 'Tất cả': return null;
      case 'Đang xử lý': return 'Đã xác nhận';
      case 'Thành công': return 'Đã giao';
      default: return uiStatus;
    }
  };

  // Logic: Filter and Search (Business logic in Hook)
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search Filter
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phoneNumber.includes(searchTerm);
      
      // 2. Status Filter
      const dataStatus = mapStatusToData(statusFilter);
      const matchesStatus = !dataStatus || order.status === dataStatus;

      // 3. Date Filter
      let matchesDate = true;
      if (dateRange.startDate || dateRange.endDate) {
        const orderDateObj = parseDate(order.orderDate);
        
        if (dateRange.startDate) {
          const start = new Date(dateRange.startDate);
          start.setHours(0, 0, 0, 0);
          if (orderDateObj < start) matchesDate = false;
        }
        
        if (dateRange.endDate) {
          const end = new Date(dateRange.endDate);
          end.setHours(23, 59, 59, 999);
          if (orderDateObj > end) matchesDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateRange]);

  return {
    orders: filteredOrders,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    totalOrders: orders.length,
    pendingCount: orders.filter(o => o.status === 'Chờ xác nhận').length,
    shippingCount: orders.filter(o => o.status === 'Đang giao').length,
    deliveredCount: orders.filter(o => o.status === 'Đã giao').length,
    cancelledCount: orders.filter(o => o.status === 'Đã hủy').length,
    totalRevenue: orders.reduce((sum, o) => {
      if (o.status === 'Đã giao') return sum + o.totalAmount;
      return sum;
    }, 0)
  };
};
