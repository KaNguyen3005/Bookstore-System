import type { Order } from "../Data/orders";
import { mockOrders } from "../Data/orders";
import type { OrderStatus } from "../Data/orders";

// 🔥 giả lập API (sau này thay bằng fetch/axios)
export const getOrders = async (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOrders);
    }, 300);
  });
};

// 🔥 lọc theo status
export const getOrdersByStatus = async (
  status: OrderStatus
): Promise<Order[]> => {
  const orders = await getOrders();
  return orders.filter((o) => o.status === status);
};