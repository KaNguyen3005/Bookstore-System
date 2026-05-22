import axiosClient from "../../../services/axiosClient";
import type { CartItemType } from "../types/cartItemType";
const IS_MOCK = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const getUserId = () => {
  try {
    const u = localStorage.getItem("user");
    if (u) return JSON.parse(u).userId;
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
  }
  return null;
};
const getMockCart = (): CartItemType[] => {
  const userId = getUserId();
  if (!userId) return [];

  try {
    const saved = localStorage.getItem(`mockCart_${userId}`);
    if (!saved) return [];

    const parsed = JSON.parse(saved);

    //  validate là array + lọc data rác
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => item && item.book && item.book.bookId);
  } catch (e) {
    console.error("Failed to parse mockCart from localStorage", e);
    return [];
  }
};
const saveMockCart = (cart: CartItemType[]) => {
  const userId = getUserId();
  if (userId) {
    const safeCart = cart.filter((item) => item?.book);
    localStorage.setItem(`mockCart_${userId}`, JSON.stringify(safeCart));
  }
};

export const cartApi = {
  getCart: async (): Promise<CartItemType[]> => {
    if (IS_MOCK) {
      await delay(500);

      return getMockCart().filter((item) => item?.book); // 🔥 quan trọng
    }

    const res = await axiosClient.get("/cart/items");

    return (res.data.result || []).filter((item: any) => item?.book);
  },
  addToCart: async (item: CartItemType): Promise<any> => {
    if (!item?.book?.bookId) return;

    if (IS_MOCK) {
      await delay(500);

      const cart = getMockCart();
      const existing = cart.find((i) => i?.book?.bookId === item.book.bookId);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        cart.push({
          book: item.book,
          quantity: item.quantity,
          bookCartId: Date.now(),
          selected: true,
        });
      }

      saveMockCart(cart);
      return { message: "Added to cart", cart };
    }

    return axiosClient.post(`/cart/items/${item.book.bookId}`, {
      quantity: item.quantity,
    });
  },

  updateCartItem: async (
    bookCartId: number,
    quantity: number,
  ): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);

      const cart = getMockCart().map((item) =>
        item.bookCartId === bookCartId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      );

      saveMockCart(cart);
      return { message: "Updated quantity", cart };
    }

    return axiosClient.patch(`/cart/items/${bookCartId}`, { quantity });
  },
  removeCartItem: async (bookCartId: number): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);

      const cart = getMockCart().filter(
        (item) => item.bookCartId !== bookCartId,
      );

      saveMockCart(cart);
      return { message: "Removed from cart", cart };
    }

    return axiosClient.delete(`/cart/items/${bookCartId}`);
  },

  // clearCart: async (): Promise<any> => {
  //   if (IS_MOCK) {
  //     await delay(500);
  //     saveMockCart([]);
  //     return { message: "Cleared cart" };
  //   }

  //   return axiosClient.delete("/cart");
  // },
};
