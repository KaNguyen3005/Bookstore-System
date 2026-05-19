import axiosClient from "../../../../services/axiosClient";
import type { Order, OrderStatus } from "../types/order";

export interface OrdersResponse {
  content: Order[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

const toOrdersResponse = (result: OrdersResponse | Order[]): OrdersResponse => {
  if (!Array.isArray(result)) return result;

  return {
    content: result,
    totalPages: 1,
    totalElements: result.length,
    size: result.length,
    number: 0,
  };
};

const withOrderDetails = async (response: OrdersResponse) => {
  const content = await Promise.all(
    response.content.map(async (order) => {
      if ((order.items?.length ?? 0) > 0 || !order.orderId) {
        return order;
      }

      try {
        const detail = await orderService.getOrderById(order.orderId);

        return {
          ...order,
          ...detail,
          items: detail.items?.length ? detail.items : order.items,
        };
      } catch (error) {
        console.error("Failed to fetch admin order detail:", error);
        return order;
      }
    }),
  );

  return {
    ...response,
    content,
  };
};

export const orderService = {
  // ================= GET ORDERS (PAGINATED) =================
  getOrders: async (params: {
    page?: number;
    size?: number;
    sort?: string;
    status?: string;
    keyword?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<OrdersResponse> => {
    const response = await axiosClient.get("/orders", {
      params,
    });
    return withOrderDetails(toOrdersResponse(response.data.result));
  },

  // ================= GET ORDER DETAIL =================
  getOrderById: async (id: number): Promise<Order> => {
    const response = await axiosClient.get(`/orders/${id}`);
    return response.data.result;
  },

  // ================= APPROVE ORDER =================
  approveOrder: async (id: number): Promise<Order> => {
    try {
      const response = await axiosClient.put(`/orders/${id}/approve`, {});

      return response.data.result;
    } catch (error: any) {
      console.error(
        "APPROVE ORDER ERROR:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
  // ================= CANCEL ORDER =================
  cancelOrder: async (id: number): Promise<Order> => {
    try {
      const response = await axiosClient.post(`/orders/${id}/cancel`);
      return response.data.result;
    } catch (error: any) {
      console.error(
        "CANCEL ORDER ERROR:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // ================= UPDATE ORDER STATUS =================
  updateOrderStatus: async (
    id: number,
    status: OrderStatus,
  ): Promise<Order> => {
    const response = await axiosClient.patch(`/orders/${id}`, {
      status,
    });

    return response.data.result;
  },

  // ================= EXPORT EXCEL =================
  exportOrders: async (): Promise<Blob> => {
    const response = await axiosClient.get("/orders/export", {
      responseType: "blob",
    });

    return response.data;
  },
};

export default orderService;
