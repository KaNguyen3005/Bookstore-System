export interface Address {
  address_id: number;
  user_id: number;
  province: string;
  district: string;
  ward: string;
  detail_address: string;
  customer_name: string;
  customer_phone: string;
  is_default: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export const mockAddresses: Address[] = [
  {
    address_id: 1,
    user_id: 1,
    province: "TP.HCM",
    district: "Quận 1",
    ward: "Bến Nghé",
    detail_address: "123 Lê Lợi",
    customer_name: "Nguyễn Văn A",
    customer_phone: "0901234567",
    is_default: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    deletedAt: null
  },
  {
    address_id: 2,
    user_id: 1,
    province: "TP.HCM",
    district: "Quận 5",
    ward: "Phường 5",
    detail_address: "456 Nguyễn Trãi",
    customer_name: "Nguyễn Văn A",
    customer_phone: "0988888888",
    is_default: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    deletedAt: null
  },
  {
    address_id: 3,
    user_id: 1,
    province: "TP.HCM",
    district: "Quận 1",
    ward: "Bến Nghé",
    detail_address: "123 Lê Lợi",
    customer_name: "Nguyễn Văn A",
    customer_phone: "0901234567",
    is_default: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    deletedAt: null
  },
  {
    address_id: 4,
    user_id: 5,
    province: "Ha Noi",
    district: "Quan Dong Da",
    ward: "Bến Nghé",
    detail_address: "123 Lê Lợi",
    customer_name: "Nguyễn Văn A",
    customer_phone: "0901234567",
    is_default: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    deletedAt: null
  }

];