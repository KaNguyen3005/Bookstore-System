import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { cartApi } from "../services/cartApi";
import type { CartItemType } from "../types/cartItemType";

interface CartContextType {
  cartItems: CartItemType[];
  selectedItems: CartItemType[];
  addToCart: (item: CartItemType) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  removeItem: (bookId: number) => void;
  toggleSelect: (bookId: number) => void;
  selectAll: (isSelected: boolean) => void;
  calculateTotal: () => { subtotal: number; discount: number; total: number };
  clearCart: () => void;
  removePurchasedItems: (bookIds: number[]) => Promise<void>;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

const initialCartState: CartItemType[] = [];

const getCartItemId = (item: CartItemType) =>
  item.bookCartId ?? item.itemId ?? item.cartItemId;

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) {
        const parsedUser = JSON.parse(u);
        const saved = localStorage.getItem(`cart_${parsedUser.userId}`);
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
    if (user?.userId) {
      localStorage.setItem(`cart_${user.userId}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  useEffect(() => {
    const syncCart = async () => {
      setIsLoading(true);
      if (isAuthenticated && user?.userId) {
        try {
          const serverCart = await cartApi.getCart();
          setCartItems(serverCart);
        } catch (error) {
          console.error("Failed to fetch cart from server:", error);
        }
      } else {
        setCartItems([]);
      }
      setIsLoading(false);
    };

    syncCart();
  }, [isAuthenticated, user]);

  const selectedItems = cartItems.filter((item) => item.selected);

  const addToCart = async (newItem: CartItemType) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.book.bookId === newItem.book.bookId,
      );

      if (existing) {
        return prev.map((item) =>
          item.book.bookId === newItem.book.bookId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item,
        );
      }

      return [...prev, { ...newItem, selected: true }];
    });

    if (isAuthenticated) {
      try {
        await cartApi.addToCart(newItem);
      } catch (error) {
        console.error("Failed to add to server cart:", error);
      }
    }
  };

  const updateQuantity = async (bookId: number, quantity: number) => {
    const newQuantity = Math.max(1, quantity);
    const targetItem = cartItems.find((item) => item.book.bookId === bookId);
    const cartItemId = targetItem ? getCartItemId(targetItem) : undefined;

    if (isAuthenticated && cartItemId) {
      try {
        await cartApi.updateCartItem(cartItemId, newQuantity);
      } catch (error) {
        console.error("Failed to update cart item on server:", error);
      }
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.book.bookId === bookId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeItem = async (bookId: number) => {
    const targetItem = cartItems.find((item) => item.book.bookId === bookId);
    const cartItemId = targetItem ? getCartItemId(targetItem) : undefined;

    if (isAuthenticated && cartItemId) {
      try {
        await cartApi.removeCartItem(cartItemId);
      } catch (error) {
        console.error("Failed to remove cart item from server:", error);
      }
    }

    setCartItems((prev) => prev.filter((item) => item.book.bookId !== bookId));
  };

  const toggleSelect = (bookId: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.book.bookId === bookId
          ? { ...item, selected: !item.selected }
          : item,
      ),
    );
  };

  const selectAll = (isSelected: boolean) => {
    setCartItems((prev) =>
      prev.map((item) => ({ ...item, selected: isSelected })),
    );
  };

  const calculateTotal = () => {
    let subtotal = 0;

    selectedItems.forEach((item) => {
      const itemSubtotal = item.book.price * item.quantity;

      subtotal += itemSubtotal;
    });

    return {
      subtotal,
      discount: 0,
      total: subtotal,
    };
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const removePurchasedItems = async (bookIds: number[]) => {
    const purchasedBookIds = new Set(bookIds);
    const purchasedItems = cartItems.filter((item) =>
      purchasedBookIds.has(item.book.bookId),
    );

    if (isAuthenticated) {
      try {
        await Promise.all(
          purchasedItems
            .map(getCartItemId)
            .filter((id): id is number => Boolean(id))
            .map((id) => cartApi.removeCartItem(id)),
        );
      } catch (error) {
        console.error(
          "Failed to remove purchased cart items from server:",
          error,
        );
      }
    }
    setCartItems((prev) =>
      prev.filter((item) => !purchasedBookIds.has(item.book.bookId)),
    );
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
