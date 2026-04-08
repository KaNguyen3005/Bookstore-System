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
  removePurchasedItems: (bookIds: number[]) => Promise<void>;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const initialCartState: CartItemType[] = [];

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) {
        const parsedUser = JSON.parse(u);
        const saved = localStorage.getItem(`cart_${parsedUser.user_id}`);
        if (saved) {
          return JSON.parse(saved);
        }
      }
    } catch (e) {
      console.error("Failed to load cart from local storage", e);
    }
    return initialCartState;
  });

  useEffect(() => {
    if (user?.user_id) {
      localStorage.setItem(`cart_${user.user_id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  useEffect(() => {
    const syncCart = async () => {
      setIsLoading(true);
      if (isAuthenticated && user?.user_id) {
        try {
          const serverCart = await cartApi.getCart();
          setCartItems(serverCart);
        } catch (error) {
          console.error("Failed to fetch cart from server:", error);
        }
      } else {
        // Clear UI and set to [] for unauthenticated users / after logout
        setCartItems([]);
      }
      setIsLoading(false);
    };

    syncCart();
  }, [isAuthenticated, user]);

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

  const removePurchasedItems = async (bookIds: number[]) => {
    if (isAuthenticated) {
      try {
        // Send a DELETE request for each item to sync with DB
        await Promise.all(bookIds.map((id) => cartApi.removeCartItem(id)));
      } catch (error) {
        console.error("Failed to remove purchased cart items from server:", error);
      }
    }
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
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


