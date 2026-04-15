import axiosClient from '../../../../services/axiosClient';
import type { Order } from "../types/order"; 
import { mockOrders } from "../data/mockOrders"; 

const IS_MOCK = true;

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    if (IS_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockOrders;
    }
    const response = await axiosClient.get('/admin/orders');
    return response as unknown as Order[];
  },

  getOrderById: async (id: string): Promise<Order> => {
    if (IS_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const order = mockOrders.find(o => o.id === id);
      if (!order) throw new Error("Order not found");
      return order as Order;
    }
    const response = await axiosClient.get(`/admin/orders/${id}`);
    return response as unknown as Order;
  }
};

export default orderService;