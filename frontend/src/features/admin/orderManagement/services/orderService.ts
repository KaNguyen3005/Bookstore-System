import axiosClient from '../../../../services/axiosClient';
import type { Order, OrderStatus } from '../types/order';

export interface OrdersResponse {
  content: Order[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const orderService = {
  // ================= GET ORDERS (PAGINATED) =================
  getOrders: async (params: {
    page?: number;
    size?: number;
    status?: string;
    keyword?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<OrdersResponse> => {
    const response = await axiosClient.get('/orders', { params });
    return response.data.result;
  },

  // ================= GET ORDER DETAIL =================
  getOrderById: async (id: number): Promise<Order> => {
    const response = await axiosClient.get(`/orders/${id}`);
    return response.data.result;
  },

  // ================= APPROVE ORDER =================
  approveOrder: async (id: number): Promise<Order> => {
    const response = await axiosClient.put(`/orders/${id}/approve`);
    return response.data.result;
  },

  // ================= UPDATE STATUS =================
  updateOrderStatus: async (
    id: number,
    status: OrderStatus
  ): Promise<Order> => {
    const response = await axiosClient.patch(`/orders/${id}`, {
      status,
    });
    return response.data.result;
  },

  // ================= EXPORT EXCEL =================
  exportOrders: async (): Promise<Blob> => {
    const response = await axiosClient.get('/orders/export', {
      responseType: 'blob',
    });

    return response.data;
  },
};

export default orderService;