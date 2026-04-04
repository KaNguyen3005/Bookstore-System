import type { Order, OrderStatus } from "../data/orders";
import { mockOrders } from "../data/purchaseOrder";

// lấy tất cả order (fake API)
export const getOrders = async (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOrders);
    }, 300);
  });
};

// ✅ FIX: lọc theo BOTH user + status
export const getOrdersByStatus = async (
  status: OrderStatus,
  userId: number
): Promise<Order[]> => {
  const orders = await getOrders();

  return orders.filter(
    (o) => o.status === status && o.user_id === userId
  );
};