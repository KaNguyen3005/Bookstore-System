import axiosClient from "../../../../services/axiosClient";

export const productService = {
  async getProducts(
    page = 0,
    size = 10
  ) {
    const response =
      await axiosClient.get(
        `/books?page=${page}&size=${size}`
      );

    return response.data.result;
  },

  async searchProducts(keyword: string) {
    const response = await axiosClient.get(`/books/search?keyword=${keyword}`);

    return response.data.result.content;
  },

  async getCategories() {
    const response = await axiosClient.get("/categories");

    return response.data.result;
  },

  async deleteProduct(bookId: number) {
    return axiosClient.delete(`/books/${bookId}`);
  },

  async getProductDetail(bookId: number) {
    const response = await axiosClient.get(`/books/${bookId}`);

    return response.data.result;
  },

  async updateProduct(bookId: number, payload: unknown) {
    return axiosClient.patch(`/books/${bookId}`, payload);
  },
};

export default productService;
