import type { Order } from '../types/order';

export const mockOrders: Order[] = [
  { id: '#1025', customerName: 'Nguyễn Văn An', phoneNumber: '0912345678', productCount: 3, totalAmount: 285000, paymentMethod: 'COD', orderDate: '05/03/2026', status: 'Chờ xác nhận' },
  { id: '#1024', customerName: 'Trần Thị Bình', phoneNumber: '0923456789', productCount: 5, totalAmount: 425000, paymentMethod: 'Chuyển khoản', orderDate: '05/03/2026', status: 'Đã xác nhận' },
  { id: '#1023', customerName: 'Lê Minh Cường', phoneNumber: '0934567890', productCount: 2, totalAmount: 199000, paymentMethod: 'COD', orderDate: '04/03/2026', status: 'Đang giao' },
  { id: '#1022', customerName: 'Phạm Thu Hà', phoneNumber: '0945678901', productCount: 1, totalAmount: 125000, paymentMethod: 'COD', orderDate: '04/03/2026', status: 'Đã giao' },
  { id: '#1021', customerName: 'Hoàng Văn Đức', phoneNumber: '0956789012', productCount: 6, totalAmount: 160000, paymentMethod: 'Chuyển khoản', orderDate: '03/03/2026', status: 'Đã giao' },
  { id: '#1020', customerName: 'Vũ Thị Mai', phoneNumber: '0967890123', productCount: 2, totalAmount: 184000, paymentMethod: 'COD', orderDate: '03/03/2026', status: 'Đang giao' },
  { id: '#1019', customerName: 'Đặng Quốc Hưng', phoneNumber: '0978901234', productCount: 1, totalAmount: 189000, paymentMethod: 'COD', orderDate: '02/03/2026', status: 'Đã hủy' },
  { id: '#1018', customerName: 'Bùi Thị Lan', phoneNumber: '0989012345', productCount: 4, totalAmount: 316000, paymentMethod: 'Chuyển khoản', orderDate: '02/03/2026', status: 'Đã giao' },
];
