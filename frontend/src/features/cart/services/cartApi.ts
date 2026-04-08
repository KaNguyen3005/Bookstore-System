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

// Initial mock data
let mockCart: CartItemType[] = [
  {
    book_id: 1,
    title: "The Great Gatsby",
    price: 150000,
    sale_percent: 10,
    cover_image_url: "https://picsum.photos/seed/book1/200/280",
    quantity: 1,
    stock_quantity: 10,
    selected: true,
  },
  {
    book_id: 2,
    title: "1984 by George Orwell",
    price: 120000,
    sale_percent: 20,
    cover_image_url: "https://picsum.photos/seed/book2/200/280",
    quantity: 2,
    stock_quantity: 5,
    selected: false,
  },
];

export const cartApi = {
  getCart: async (): Promise<CartItemType[]> => {
    if (IS_MOCK) {
      await delay(500);
      return mockCart;
    }
    return axiosClient.get("/cart");
  },

  addToCart: async (item: CartItemType): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);
      const existing = mockCart.find((i) => i.book_id === item.book_id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        mockCart.push({ ...item, selected: true });
      }
      return { message: "Added to cart", cart: mockCart };
    }
    return axiosClient.post("/cart", item);
  },

  updateCartItem: async (book_id: number, quantity: number): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);
      mockCart = mockCart.map((item) =>
        item.book_id === book_id ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      return { message: "Updated quantity", cart: mockCart };
    }
    return axiosClient.put(`/cart/${book_id}`, { quantity });
  },

  removeCartItem: async (book_id: number): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);
      mockCart = mockCart.filter((item) => item.book_id !== book_id);
      return { message: "Removed from cart", cart: mockCart };
    }
    return axiosClient.delete(`/cart/${book_id}`);
  },

  clearCart: async (): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);
      mockCart = [];
      return { message: "Cleared cart" };
    }
    return axiosClient.delete("/cart");
  },
};
