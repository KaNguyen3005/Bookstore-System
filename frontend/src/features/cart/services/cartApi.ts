import axiosClient from "../../../services/axiosClient";

const IS_MOCK = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface CartItemType {
  cartId?: number;
  bookId: number;
  title: string;
  price: number;
  salePercent: number;
  coverImgUrl: string;
  quantity: number;
  stockQuantity: number;
  selected: boolean;
}

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
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse mockCart from localStorage", e);
  }
  return [];
};

const saveMockCart = (cart: CartItemType[]) => {
  const userId = getUserId();
  if (userId) {
    localStorage.setItem(`mockCart_${userId}`, JSON.stringify(cart));
  }
};

export const cartApi = {
  getCart: async (): Promise<CartItemType[]> => {
    if (IS_MOCK) {
      await delay(500);
      return getMockCart();
    }

    const res: any = await axiosClient.get("/cart");
    return res?.data || res;
  },

  addToCart: async (item: CartItemType): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);

      const cart = getMockCart();
      const existing = cart.find((i) => i.bookId === item.bookId);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        cart.push({ ...item, selected: true });
      }

      saveMockCart(cart);
      return { message: "Added to cart", cart };
    }

    return axiosClient.post("/cart", item);
  },

  updateCartItem: async (bookId: number, quantity: number): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);

      const cart = getMockCart().map((item) =>
        item.bookId === bookId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );

      saveMockCart(cart);
      return { message: "Updated quantity", cart };
    }

    return axiosClient.put(`/cart/${bookId}`, { quantity });
  },

  removeCartItem: async (bookId: number): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);

      const cart = getMockCart().filter((item) => item.bookId !== bookId);

      saveMockCart(cart);
      return { message: "Removed from cart", cart };
    }

    return axiosClient.delete(`/cart/${bookId}`);
  },

  clearCart: async (): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);
      saveMockCart([]);
      return { message: "Cleared cart" };
    }

    return axiosClient.delete("/cart");
  },
};