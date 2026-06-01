import axiosClient from "./axiosClient";

export interface SearchBooksParams {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  publisherId?: number;
  page?: number;
  size?: number;
}

export const searchBooks = async (params: SearchBooksParams) => {
  const response = await axiosClient.get("/books/search", {
    params,
    skipAuth: true,
    skipAuthRedirect: true,
  } as any);

  return response.data;
};
