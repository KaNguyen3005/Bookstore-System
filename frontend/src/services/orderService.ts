import type { Order } from "../data/purchaseOrder";
import { mockOrders } from "../data/purchaseOrder";
import type { OrderStatus } from "../data/purchaseOrder";

// giả lập API (sau này thay bằng fetch/axios)
export const getOrders = async (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOrders);
    }, 300);
  });
};

//lọc theo status
export const getOrdersByStatus = async (
  status: OrderStatus
): Promise<Order[]> => {
  const orders = await getOrders();
  return orders.filter((o) => o.status === status);
};

export const createOrder = async (orderData: any): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Order created successfully:", orderData);
      resolve({ success: true, message: "Mua hàng thành công", order_id: Date.now() });
    }, 1000);
  });
};