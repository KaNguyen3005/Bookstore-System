import axiosClient from '../../../../services/axiosClient';
import { adminProductsMock } from "../data/mockProducts";
import type { AdminProduct, BaseResponse, ProductSummary } from "../types/product";

const IS_MOCK = true;

// Simulating a database for mock mode
let adminProductsDB: AdminProduct[] = [...adminProductsMock];

export const productService = {
  // 1. Fetch products from API or Mock
  getProducts: async (): Promise<BaseResponse<AdminProduct[]>> => {
    if (IS_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        success: true,
        message: "Lấy danh sách sản phẩm thành công (Mock)",
        data: adminProductsDB,
      };
    }
    const response = await axiosClient.get('/admin/products');
    return response as unknown as BaseResponse<AdminProduct[]>;
  },

  // 2. Fetch summary stats
  getSummary: async (): Promise<BaseResponse<ProductSummary>> => {
    if (IS_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const total = adminProductsDB.length;
      const inStock = adminProductsDB.filter((p) => p.stock > 0 && p.status === "Đang bán").length;
      const outOfStock = adminProductsDB.filter((p) => p.stock === 0 || p.status === "Hết hàng").length;

      return {
        success: true,
        message: "Lấy thống kê thành công (Mock)",
        data: { total, inStock, outOfStock },
      };
    }
    const response = await axiosClient.get('/admin/products/summary');
    return response as unknown as BaseResponse<ProductSummary>;
  },

  // 3. Status/Action methods
  deleteProduct: async (id: number): Promise<BaseResponse<null>> => {
    if (IS_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      adminProductsDB = adminProductsDB.filter((p) => p.id !== id);
      return { success: true, message: "Đã xóa sản phẩm thành công", data: null };
    }
    const response = await axiosClient.delete(`/admin/products/${id}`);
    return response as unknown as BaseResponse<null>;
  },

  updateStatus: async (id: number, status: AdminProduct["status"]): Promise<BaseResponse<AdminProduct>> => {
    if (IS_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = adminProductsDB.findIndex((p) => p.id === id);
      if (index !== -1) {
        adminProductsDB[index].status = status;
        return { success: true, message: "Cập nhật trạng thái thành công", data: adminProductsDB[index] };
      }
      throw new Error("Sản phẩm không tồn tại");
    }
    const response = await axiosClient.patch(`/admin/products/${id}/status`, { status });
    return response as unknown as BaseResponse<AdminProduct>;
  }
};

export default productService;
