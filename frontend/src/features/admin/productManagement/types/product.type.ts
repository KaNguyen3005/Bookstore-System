export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminProduct {
  id: number;
  thumbnail: string;
  name: string;
  author: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  status: "Đang bán" | "Hết hàng" | "Tạm ngưng"; // Based on UI badges
}

export interface ProductFilters {
  category: string;
  status: string;
  search: string;
}

export interface ProductSummary {
  total: number;
  inStock: number;
  outOfStock: number;
}
