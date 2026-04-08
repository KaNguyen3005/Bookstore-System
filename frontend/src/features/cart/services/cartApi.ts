import axiosClient from "../../../services/axiosClient";

const IS_MOCK = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface CartItemType {
  cart_id?: number;
  book_id: number;
  title: string;
  price: number;
  sale_percent: number;
  cover_image_url: string;
  quantity: number;
  stock_quantity: number;
  selected: boolean;
}

const getUserId = () => {
  try {
    const u = localStorage.getItem("user");
    if (u) return JSON.parse(u).user_id;
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
  }
  return null;
};

const getMockCart = (): CartItemType[] => {
  const userId = getUserId();
  if (!userId) return []; // Guest does not have persistent mock storage

  try {
    const saved = localStorage.getItem(`mock_cart_${userId}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse mock_cart from localStorage", e);
  }
  return [];
};

const saveMockCart = (cart: CartItemType[]) => {
  const userId = getUserId();
  if (userId) {
    localStorage.setItem(`mock_cart_${userId}`, JSON.stringify(cart));
  }
};

export const cartApi = {
  getCart: async (): Promise<CartItemType[]> => {
    if (IS_MOCK) {
      await delay(500);
      return getMockCart();
    }
    return axiosClient.get("/cart");
  },

  addToCart: async (item: CartItemType): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);
      const cart = getMockCart();
      const existing = cart.find((i) => i.book_id === item.book_id);
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

  updateCartItem: async (book_id: number, quantity: number): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);
      const cart = getMockCart().map((item) =>
        item.book_id === book_id ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      saveMockCart(cart);
      return { message: "Updated quantity", cart };
    }
    return axiosClient.put(`/cart/${book_id}`, { quantity });
  },

  removeCartItem: async (book_id: number): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);
      const cart = getMockCart().filter((item) => item.book_id !== book_id);
      saveMockCart(cart);
      return { message: "Removed from cart", cart };
    }
    return axiosClient.delete(`/cart/${book_id}`);
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
