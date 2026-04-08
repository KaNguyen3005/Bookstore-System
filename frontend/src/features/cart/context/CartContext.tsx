import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { cartApi } from '../services/cartApi';

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

interface CartContextType {
  cartItems: CartItemType[];
  selectedItems: CartItemType[];
  addToCart: (item: CartItemType) => void;
  updateQuantity: (book_id: number, quantity: number) => void;
  removeItem: (book_id: number) => void;
  toggleSelect: (book_id: number) => void;
  selectAll: (isSelected: boolean) => void;
  calculateTotal: () => { subtotal: number; discount: number; total: number };
  clearCart: () => void;
  removePurchasedItems: (bookIds: number[]) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const initialCartState: CartItemType[] = [
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
  }
];

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load cart from local storage", e);
    }
    return initialCartState;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync cart with server when login/logout
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated) {
        try {
          const serverCart = await cartApi.getCart();
          setCartItems(serverCart);
        } catch (error) {
          console.error("Failed to fetch cart from server:", error);
        }
      } else {
        // Clear UI only when logout
        setCartItems([]);
      }
    };

    syncCart();
  }, [isAuthenticated]);

  const selectedItems = cartItems.filter((item) => item.selected);

  const addToCart = async (newItem: CartItemType) => {
    // 1. Update Server first if logged in
    if (isAuthenticated) {
      try {
        await cartApi.addToCart(newItem);
      } catch (error) {
        console.error("Failed to add to server cart:", error);
      }
    }

    // 2. Update Local State
    setCartItems((prev) => {
      const existing = prev.find((item) => item.book_id === newItem.book_id);
      if (existing) {
        return prev.map((item) =>
          item.book_id === newItem.book_id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, { ...newItem, selected: true }];
    });
  };

  const updateQuantity = async (book_id: number, quantity: number) => {
    const newQuantity = Math.max(1, quantity);

    if (isAuthenticated) {
      try {
        await cartApi.updateCartItem(book_id, newQuantity);
      } catch (error) {
        console.error("Failed to update cart item on server:", error);
      }
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.book_id === book_id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = async (book_id: number) => {
    if (isAuthenticated) {
      try {
        await cartApi.removeCartItem(book_id);
      } catch (error) {
        console.error("Failed to remove cart item from server:", error);
      }
    }

    setCartItems((prev) => prev.filter((item) => item.book_id !== book_id));
  };

  const toggleSelect = (book_id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.book_id === book_id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectAll = (isSelected: boolean) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, selected: isSelected })));
  };

  const calculateTotal = () => {
    let subtotal = 0;
    let discount = 0;

    selectedItems.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      const itemDiscount = (item.price * item.sale_percent) / 100 * item.quantity;

      subtotal += itemSubtotal;
      discount += itemDiscount;
    });

    return {
      subtotal,
      discount,
      total: subtotal - discount,
    };
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const removePurchasedItems = (bookIds: number[]) => {
    setCartItems((prev) => prev.filter((item) => !bookIds.includes(item.book_id)));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedItems,
        addToCart,
        updateQuantity,
        removeItem,
        toggleSelect,
        selectAll,
        calculateTotal,
        clearCart,
        removePurchasedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


