import axiosClient from "./axiosClient";
import { mockOrders } from "../data/purchaseOrder";

const IS_MOCK = false;

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
    const order = mockOrders.find((o: any) => o.id === id);
    if (!order) throw new Error("Order not found");
    return order;
  }
  return axiosClient.get(`/orders/${id}`);
};

// --- Dashboard Specific (v2) ---
export const getRecentOrders = async (): Promise<any[]> => {
  if (IS_MOCK) {
    await delay(500);
    return [
      { order_id: 1021, date: "12/04", total: 500000, status: "Thành công" },
      { order_id: 1022, date: "11/04", total: 200000, status: "Chờ xử lý" },
      { order_id: 1023, date: "11/04", total: 300000, status: "Thành công" },
      { order_id: 1025, date: "10/04", total: 300000, status: "Thành công" },
      { order_id: 1026, date: "10/04", total: 500000, status: "Đã hủy" },
      { order_id: 1027, date: "10/04", total: 300000, status: "Thành công" },
    ];
  }
  return axiosClient.get("/admin/recent-orders");
};

export const getRevenueData = async (): Promise<any[]> => {
  if (IS_MOCK) {
    await delay(500);
    return [
      { name: "01/04", value: 1000000 },
      { name: "03/04", value: 1500000 },
      { name: "05/04", value: 1200000 },
      { name: "07/04", value: 2500000 },
      { name: "09/04", value: 3800000 },
      { name: "11/04", value: 4200000 },
      { name: "12/04", value: 4000000 },
    ];
  }
  return axiosClient.get("/admin/revenue");
};

export const orderApi = {
  getOrders,
  getOrdersByStatus,
  createOrder,
  getOrderById,
  getRecentOrders,
  getRevenueData,
};

