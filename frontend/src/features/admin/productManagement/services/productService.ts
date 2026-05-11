import axiosClient from "../../../../services/axiosClient";
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
