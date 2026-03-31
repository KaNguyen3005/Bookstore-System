type OrderStatus =
  | "pending"
  | "pickup"
  | "shipping"
  | "delivered"
  | "return"
  | "cancel";

interface Order {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  status: OrderStatus;
}