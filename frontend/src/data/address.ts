export interface Address {
  addressId: number;
  userId: number;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  customerName: string;
  customerPhone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export const mockAddresses: Address[] = [
  {
    addressId: 1,
    userId: 1,
    province: "TP.HCM",
    district: "Quận 1",
    ward: "Bến Nghé",
    detailAddress: "123 Lê Lợi",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    isDefault: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    deletedAt: null
  },
  {
    addressId: 2,
    userId: 1,
    province: "TP.HCM",
    district: "Quận 5",
    ward: "Phường 5",
    detailAddress: "456 Nguyễn Trãi",
    customerName: "Nguyễn Văn A",
    customerPhone: "0988888888",
    isDefault: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    deletedAt: null
  },
  {
    addressId: 3,
    userId: 1,
    province: "TP.HCM",
    district: "Quận 1",
    ward: "Bến Nghé",
    detailAddress: "123 Lê Lợi",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    isDefault: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    deletedAt: null
  },
  {
    addressId: 4,
    userId: 5,
    province: "Ha Noi",
    district: "Quan Dong Da",
    ward: "Bến Nghé",
    detailAddress: "123 Lê Lợi",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    isDefault: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    deletedAt: null
  }
];