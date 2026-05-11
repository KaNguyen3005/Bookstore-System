export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED';

export type ShippingStatus =
  | 'PICKING_UP'
  | 'DELIVERING'
  | 'DELIVERED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED';

export interface Voucher {
  voucherId: number;
  voucherCode: string;
  title: string;
  description: string;
}

export interface OrderItem {
  bookId: number;
  bookTitle: string;
  quantity: number;
  price: number;
  rate: number;
  content: string;
  unit: string;
}

export interface Order {
  orderId: number;

  vatRate: number;
  vatAmount: number;

  voucher?: Voucher;

  totalAmount: number;
  subtotal: number;

  items: OrderItem[];

  staffName: string;
  customerName: string;

  status: OrderStatus;

  shippingStatus: ShippingStatus;
  paymentStatus: PaymentStatus;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}