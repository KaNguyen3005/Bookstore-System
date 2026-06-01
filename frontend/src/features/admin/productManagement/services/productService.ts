import axiosClient from "../../../../services/axiosClient";
import type { Book } from "../../../product/types/Book";

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
  coverImgUrl?: string;
  bookImgFiles?: File[];
  stockQuantity?: number;
  price: number;
  avgRating?: number;
  salePercent?: number;
  categoryIds: number[];
}

export interface UpdateBookPayload {
  title: string;
  authorIds: number[];
  publisherId?: number;
  isbn: string;
  language: string;
  description?: string;
  pageCount?: number;
  coverType: string;
  coverImg?: File;
  bookImgFiles?: File[];
  stockQuantity?: number;
  isActive?: boolean;
  price: number;
  avgRating?: number;
  salePercent?: number;
  categories: number[];
}

export interface UpdateProductStatusPayload {
  isActive: boolean;
  stockQuantity: number;
}

const isDeletedBook = (book: Book) => {
  return Boolean(book.deletedAt);
};

const normalizeProductsResponse = (result: any) => {
  const content: Book[] = result.content ?? [];
  const visibleContent = content.filter((book) => !isDeletedBook(book));

  return {
    ...result,
    content: visibleContent,
    numberOfElements: visibleContent.length,
  };
};

const appendIfDefined = (
  formData: FormData,
  key: string,
  value: string | number | File | undefined,
) => {
  if (value === undefined || value === "") return;

  formData.append(key, value instanceof File ? value : String(value));
};

const uploadBookImages = async (bookId: number, files: File[]) => {
  if (files.length === 0) return;

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  await axiosClient.post(`/books/${bookId}/book-images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

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

    return normalizeProductsResponse(response.data.result);
  },

  // ================= SEARCH =================
  async searchProducts(keyword: string) {
    const response = await axiosClient.get("/books/search", {
      params: { keyword },
    });

    return normalizeProductsResponse(response.data.result).content;
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

    const createdBook = response.data.result;

    if (payload.bookImgFiles?.length && createdBook?.bookId) {
      await uploadBookImages(createdBook.bookId, payload.bookImgFiles);

      return productService.getProductDetail(createdBook.bookId);
    }

    return createdBook;
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
  async updateProduct(bookId: number, payload: UpdateBookPayload) {
    const formData = new FormData();

    appendIfDefined(formData, "title", payload.title);
    payload.authorIds.forEach((id) => formData.append("authorIds", String(id)));
    appendIfDefined(formData, "publisherId", payload.publisherId);
    appendIfDefined(formData, "isbn", payload.isbn);
    appendIfDefined(formData, "language", payload.language);
    appendIfDefined(formData, "description", payload.description);
    appendIfDefined(formData, "pageCount", payload.pageCount);
    appendIfDefined(formData, "coverType", payload.coverType);
    appendIfDefined(formData, "coverImg", payload.coverImg);
    appendIfDefined(formData, "stockQuantity", payload.stockQuantity);
    appendIfDefined(
      formData,
      "isActive",
      payload.isActive === undefined ? undefined : String(payload.isActive),
    );
    appendIfDefined(formData, "price", payload.price);
    appendIfDefined(formData, "avgRating", payload.avgRating);
    appendIfDefined(formData, "salePercent", payload.salePercent);
    payload.categories.forEach((id) => formData.append("categories", String(id)));

    const response = await axiosClient.patch(`/books/${bookId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (payload.bookImgFiles?.length) {
      await uploadBookImages(bookId, payload.bookImgFiles);

      return productService.getProductDetail(bookId);
    }

    return response.data.result;
  },

  async updateProductStatus(
    bookId: number,
    payload: UpdateProductStatusPayload,
  ) {
    const formData = new FormData();

    appendIfDefined(formData, "isActive", String(payload.isActive));
    appendIfDefined(formData, "stockQuantity", payload.stockQuantity);

    const response = await axiosClient.patch(`/books/${bookId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.result;
  },
};

export default productService;
