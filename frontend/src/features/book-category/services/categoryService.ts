import axiosClient from "../../../services/axiosClient";
import type { Category } from "../types/category";
import { categoriesData } from "../../../data/categoriesData";

const IS_MOCK = false;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const categoryService = {
  /**
   * 📌 Lấy danh sách category cho sidebar
   */
  getCategories: async (): Promise<Category[]> => {
    if (IS_MOCK) {
      await delay(300);
      return categoriesData;
    }

    const res: any = await axiosClient.get("/categories");

    return res?.data?.result || [];
  },

  /**
   * 📌 Lấy chi tiết 1 category
   */
  getCategoryById: async (id: number): Promise<Category | null> => {
    if (IS_MOCK) {
      await delay(200);
      return categoriesData.find((c) => c.categoryId === id) || null;
    }

    const res: any = await axiosClient.get(`/categories/${id}`);

    return res?.data?.result || null;
  },
};