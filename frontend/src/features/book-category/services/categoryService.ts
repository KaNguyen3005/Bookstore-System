import axiosClient from "../../../services/axiosClient";
import type { Category } from "../types/category";
import { categoriesData } from "../../../data/categoriesData";

const IS_MOCK = false;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export type CategoryId = number | string;

export interface CategoryPayload {
  categoryName: string;
  parentCategoryId?: CategoryId | null;
}

const toApiPayload = (payload: CategoryPayload) => {
  return {
    categoryName: payload.categoryName.trim(),
    parentId: payload.parentCategoryId || null,
  };
};

export const categoryService = {

  getCategories: async (): Promise<Category[]> => {
    if (IS_MOCK) {
      await delay(300);
      return categoriesData;
    }
    const res: any = await axiosClient.get("/categories");

    const categories = res.data.result;

    return Array.isArray(categories) ? categories : [];
  },

  getCategoryById: async (id: CategoryId): Promise<Category | null> => {
    if (IS_MOCK) {
      await delay(200);
      return categoriesData.find((c) => String(c.categoryId) === String(id)) || null;
    }

    const res: any = await axiosClient.get(`/categories/${id}`);

    return res.data.result;
  },

  createCategory: async (payload: CategoryPayload): Promise<Category> => {
    if (IS_MOCK) {
      await delay(250);
      return {
        categoryId: Date.now(),
        categoryName: payload.categoryName,
        parentCategoryId: payload.parentCategoryId ?? null,
        children: [],
      };
    }

    const res: any = await axiosClient.post("/categories", toApiPayload(payload));

    return res.data.result;
  },

  updateCategory: async (
    id: CategoryId,
    payload: CategoryPayload,
  ): Promise<Category> => {
    if (IS_MOCK) {
      await delay(250);
      return {
        categoryId: id,
        categoryName: payload.categoryName,
        parentCategoryId: payload.parentCategoryId ?? null,
        children: [],
      };
    }

    const res: any = await axiosClient.patch(
      `/categories/${id}`,
      toApiPayload(payload),
    );

    return res.data.result;
  },

  deleteCategory: async (id: CategoryId): Promise<void> => {
    if (IS_MOCK) {
      await delay(200);
      return;
    }

    await axiosClient.delete(`/categories/${id}`);
  },

  restoreCategory: async (id: CategoryId): Promise<Category | null> => {
    if (IS_MOCK) {
      await delay(200);
      return categoriesData.find((c) => String(c.categoryId) === String(id)) || null;
    }

    const res: any = await axiosClient.post(`/categories/${id}/restore`);

    return res.data.result;
  },
};
