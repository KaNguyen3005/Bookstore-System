import type { Product } from "../types/Product";
import { mapBookData } from "@/shared/utils/mappers";
import { getProducts as getProductsMock, getProductById as getProductByIdMock, getRelatedProducts as getRelatedProductsMock } from "@/shared/mocks/product.mock";

/**
 * Fetch all products from catalog
 */
export const getProducts = async (): Promise<Product[]> => {
  const res = await getProductsMock();
  return res.data.map(mapBookData) as Product[];
};

/**
 * Fetch product by ID
 */
export const getProductById = async (id: number): Promise<Product | null> => {
  const res = await getProductByIdMock(id);
  return res.data ? (mapBookData(res.data) as Product) : null;
};

/**
 * Fetch related products for a given book
 */
export const getRelatedProducts = async (bookId: number): Promise<Product[]> => {
  const res = await getRelatedProductsMock(bookId);
  return res.data.map(mapBookData) as Product[];
};
