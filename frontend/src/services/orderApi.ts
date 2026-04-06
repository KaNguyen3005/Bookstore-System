import axiosClient from "./axiosClient";
import { mockOrders } from "../data/purchaseOrder";

const IS_MOCK = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getOrders = async (): Promise<any[]> => {
  if (IS_MOCK) {
    await delay(500);
    return mockOrders;
  }
  return axiosClient.get("/orders");
};

export const getOrdersByStatus = async (status: string, userId?: number): Promise<any[]> => {
  if (IS_MOCK) {
    await delay(500);
    return mockOrders.filter((o) => {
      const matchStatus = o.status === status;
      const matchUser = userId ? o.user_id === userId : true;
      return matchStatus && matchUser;
    });
  }
  return axiosClient.get("/orders", { params: { status, userId } });
};

export const createOrder = async (orderData: any): Promise<any> => {
  if (IS_MOCK) {
    await delay(500);
    const newOrder = {
      ...orderData,
      order_id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    // In a real scenario, we'd push to mockOrders, but for now we just return success
    return { success: true, message: "Mua hàng thành công", order_id: newOrder.order_id };
  }
  return axiosClient.post("/orders", orderData);
};

export const getOrderById = async (id: number): Promise<any> => {
  if (IS_MOCK) {
    await delay(500);
    const order = mockOrders.find((o) => o.order_id === id);
    if (!order) throw new Error("Order not found");
    return order;
  }
  return axiosClient.get(`/orders/${id}`);
};

export const orderApi = {
  getOrders,
  getOrdersByStatus,
  createOrder,
  getOrderById,
};

