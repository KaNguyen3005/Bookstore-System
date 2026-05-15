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
  const categoryName = payload.categoryName.trim();
  const parentCategoryId = payload.parentCategoryId || null;

  return {
    categoryName,
    parentCategoryId,
    name: categoryName,
    parentId: parentCategoryId,
  };
};

type RawCategory = Partial<Category> & {
  id?: CategoryId;
  name?: string;
  parentId?: CategoryId | null;
  children?: RawCategory[];
};

const getResponsePayload = (responseData: any) => {
  return responseData?.result ?? responseData?.data ?? responseData;
};

const normalizeCategory = (
  rawCategory: RawCategory = {},
  parentId: CategoryId | null = null,
): Category => {
  const categoryId = rawCategory.categoryId ?? rawCategory.id ?? "";
  const categoryName = rawCategory.categoryName ?? rawCategory.name ?? "";
  const parentCategoryId =
    rawCategory.parentCategoryId ?? rawCategory.parentId ?? parentId;

  return {
    ...rawCategory,
    categoryId,
    categoryName,
    parentCategoryId: parentCategoryId ?? null,
    children: Array.isArray(rawCategory.children)
      ? rawCategory.children.map((child) =>
          normalizeCategory(child, categoryId),
        )
      : [],
  };
};

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

    const categories = getResponsePayload(res.data);

    return Array.isArray(categories)
      ? categories.map((category) => normalizeCategory(category))
      : [];
  },

  /**
   * 📌 Lấy chi tiết 1 category
   */
  getCategoryById: async (id: CategoryId): Promise<Category | null> => {
    if (IS_MOCK) {
      await delay(200);
      return categoriesData.find((c) => String(c.categoryId) === String(id)) || null;
    }

    const res: any = await axiosClient.get(`/categories/${id}`);

    const category = getResponsePayload(res.data);

    return category ? normalizeCategory(category) : null;
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

    return normalizeCategory(getResponsePayload(res.data));
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

    return normalizeCategory(getResponsePayload(res.data));
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

    const category = getResponsePayload(res.data);

    return category ? normalizeCategory(category) : null;
  },
};
