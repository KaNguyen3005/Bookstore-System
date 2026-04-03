import { getCart as getCartMock, addToCart as addToCartMock, updateCartItem as updateCartItemMock, removeCartItem as removeCartItemMock } from '@/shared/mocks/cart.mock';

import type { CartItemType, CartResponse, CartActionResponse } from '../types';

export const getCart = async (): Promise<CartResponse> => {
  const res = await getCartMock();
  return { success: true, data: res.data };
};

export const addToCart = async (item: CartItemType): Promise<CartActionResponse> => {
  const res = await addToCartMock(item);
  return { success: true, data: res.data, message: 'Sản phẩm đã được thêm vào giỏ hàng' };
};

export const updateCartItem = async (book_id: number, quantity: number): Promise<CartActionResponse> => {
  const res = await updateCartItemMock(book_id, quantity);
  return { success: true, data: res.data, message: 'Cập nhật số lượng thành công' };
};

export const removeCartItem = async (book_id: number): Promise<CartActionResponse> => {
  const res = await removeCartItemMock(book_id);
  return { success: true, data: res.data, message: 'Sản phẩm đã được xóa khỏi giỏ hàng' };
};
