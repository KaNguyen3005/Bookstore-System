export type OrderStatus = 'Chờ xác nhận' | 'Đã xác nhận' | 'Đang giao' | 'Đã giao' | 'Đã hủy';
export type PaymentMethod = 'COD' | 'Chuyển khoản';

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  productCount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  orderDate: string;
  status: OrderStatus;
}
