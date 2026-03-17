// kdl
export interface Order {
  id: number;
  status: OrderStatus;
  name: string;
  price: number;
}

// FE + BE
export type OrderStatus =
  | "pending"
  | "pickup"
  | "shipping"
  | "delivered"
  | "return"
  | "cancel";

// UI
export const orderStatusLabel: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  pickup: "Chờ lấy hàng",
  shipping: "Chờ giao hàng",
  delivered: "Đã giao",
  return: "Trả hàng",
  cancel: "Đã hủy",
};

export const mockOrders: Order[] = [
  {
    id: 1,
    status: "pending",
    name: "Sách React cơ bản",
    price: 120000,
  },
  {
    id: 2,
    status: "delivered",
    name: "Sách JavaScript nâng cao",
    price: 180000,
  },
    {
    id: 3,
    status: "return",
    name: "Học chi quá là mệt",
    price: 180000,
  },
];