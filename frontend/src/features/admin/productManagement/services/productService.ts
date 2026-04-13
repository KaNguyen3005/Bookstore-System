import { adminProductsMock } from "../data/products";
import type { AdminProduct, BaseResponse, ProductFilters, ProductSummary } from "../types/product.type";

// Giả lập Database trong RAM để test chức năng xóa/sửa
let adminProductsDB: AdminProduct[] = [...adminProductsMock];

export const productService = {
  // Lấy danh sách sản phẩm với filter
  getProducts: async (filters?: ProductFilters): Promise<BaseResponse<AdminProduct[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...adminProductsDB];

        if (filters) {
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
              (p) =>
                p.name.toLowerCase().includes(searchLower) ||
                p.id.toString().includes(searchLower)
            );
          }
          if (filters.category && filters.category !== "Tất cả thể loại") {
            result = result.filter((p) => p.category === filters.category);
          }
          if (filters.status && filters.status !== "Tất cả trạng thái") {
            result = result.filter((p) => p.status === filters.status);
          }
        }

        resolve({
          success: true,
          message: "Lấy danh sách sản phẩm thành công",
          data: result,
        });
      }, 500); // Fake delay 500ms
    });
  },

  // Xóa sản phẩm
  deleteProduct: async (id: number): Promise<BaseResponse<null>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        adminProductsDB = adminProductsDB.filter((p) => p.id !== id);
        resolve({
          success: true,
          message: "Đã xóa sản phẩm thành công",
          data: null,
        });
      }, 300);
    });
  },

  // Cập nhật trạng thái
  updateStatus: async (id: number, status: AdminProduct["status"]): Promise<BaseResponse<AdminProduct>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = adminProductsDB.findIndex((p) => p.id === id);
        if (index !== -1) {
          adminProductsDB[index].status = status;
          resolve({
            success: true,
            message: "Cập nhật trạng thái thành công",
            data: adminProductsDB[index],
          });
        } else {
          reject(new Error("Sản phẩm không tồn tại"));
        }
      }, 300);
    });
  },

  // Lấy thống kê
  getSummary: async (): Promise<BaseResponse<ProductSummary>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = adminProductsDB.length;
        const inStock = adminProductsDB.filter((p) => p.stock > 0 && p.status === "Đang bán").length;
        const outOfStock = adminProductsDB.filter((p) => p.stock === 0 || p.status === "Hết hàng").length;

        resolve({
          success: true,
          message: "Lấy thống kê thành công",
          data: { total, inStock, outOfStock },
        });
      }, 400);
    });
  },
};
