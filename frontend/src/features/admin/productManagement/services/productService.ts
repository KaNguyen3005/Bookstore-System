import axiosClient from "../../../../services/axiosClient";

export interface CreateBookPayload {
  title: string;
  authorIds: number[];
  publisherId?: number;
  isbn: string;
  language: string;
  description?: string;
  pageCount?: number;
  coverType: string;
  coverImgFile?: File;
  stockQuantity?: number;
  price: number;
  avgRating?: number;
  salePercent?: number;
  categoryIds: number[];
}

export const productService = {
  // ================= GET PRODUCTS (FILTER FULL) =================
  async getProducts(params: {
    page?: number;
    size?: number;
    keyword?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    publisherId?: number;
  }) {
    const hasSearch =
      params.keyword ||
      params.categoryId ||
      params.minPrice ||
      params.maxPrice ||
      params.sort ||
      params.publisherId;

    const endpoint = hasSearch ? "/books/search" : "/books";

    const response = await axiosClient.get(endpoint, {
      params,
    });

    return response.data.result;
  },

  // ================= SEARCH =================
  async searchProducts(keyword: string) {
    const response = await axiosClient.get("/books/search", {
      params: { keyword },
    });

    return response.data.result.content;
  },

  // ================= CATEGORIES =================
  async getCategories() {
    const response = await axiosClient.get("/categories");

    return response.data.result;
  },

  // ================= CREATE PRODUCT =================
  async createProduct(payload: CreateBookPayload) {
    const formData = new FormData();

    formData.append("title", payload.title);

    payload.authorIds.forEach((id) => {
      formData.append("authorIds", String(id));
    });

    if (payload.publisherId !== undefined) {
      formData.append("publisherId", String(payload.publisherId));
    }

    formData.append("isbn", payload.isbn);
    formData.append("language", payload.language);

    if (payload.description) {
      formData.append("description", payload.description);
    }

    if (payload.pageCount !== undefined) {
      formData.append("pageCount", String(payload.pageCount));
    }

    formData.append("coverType", payload.coverType);

    if (payload.coverImgFile) {
      formData.append("coverImgFile", payload.coverImgFile);
    }

    if (payload.stockQuantity !== undefined) {
      formData.append(
        "stockQuantity",
        String(payload.stockQuantity)
      );
    }

    formData.append("price", String(payload.price));

    if (payload.avgRating !== undefined) {
      formData.append("avgRating", String(payload.avgRating));
    }

    if (payload.salePercent !== undefined) {
      formData.append(
        "salePercent",
        String(payload.salePercent)
      );
    }

    payload.categoryIds.forEach((id) => {
      formData.append("categoryIds", String(id));
    });

    const response = await axiosClient.post(
      "/books",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.result;
  },

  // ================= DELETE =================
  async deleteProduct(bookId: number) {
    return axiosClient.delete(`/books/${bookId}`);
  },

  // ================= DETAIL =================
  async getProductDetail(bookId: number) {
    const response = await axiosClient.get(`/books/${bookId}`);

    return response.data.result;
  },

  // ================= UPDATE =================
  async updateProduct(bookId: number, payload: unknown) {
    return axiosClient.patch(`/books/${bookId}`, payload);
  },
};

export default productService;