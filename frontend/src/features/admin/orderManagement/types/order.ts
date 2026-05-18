export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export type ShippingStatus =
  | 'PICKING_UP'
  | 'DELIVERING'
  | 'DELIVERED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED';

export type PaymentMethod =
  | 'COD'
  | 'VNPAY';

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
  lineTotal?: number;
  rate: number;
  content: string;
  unit: string;
}

export interface ShippingSnapshot {
  receiverName?: string;
  receiverPhone?: string;
  line1?: string;
  line2?: string;
  ward?: string;
  district?: string;
  city?: string;
  country?: string;
}

export interface ShippingAddress {
  customerName?: string;
  customerPhone?: string;
  detailAddress?: string;
  ward?: string;
  district?: string;
  province?: string;
}

export interface Shipment {
  address?: ShippingAddress;
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
  shipment?: Shipment;
  shipping?: ShippingSnapshot;

  status: OrderStatus;

  shippingStatus: ShippingStatus;
  paymentStatus: PaymentStatus;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
