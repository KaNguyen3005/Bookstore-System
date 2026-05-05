import { useState, useEffect } from "react";
import { bookApi } from "../../../../services/bookApi";
import type { Book } from "../types/Book";
import { useCartActions } from "../../../cart/hooks/useCartActions";

export const useProductDetail = (id: string | undefined) => {
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  
  const { onAddToCart, onBuyNow } = useCartActions();

  useEffect(() => {
    const fetchBookData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const bookId = parseInt(id);
        const [bookData, relatedData] = await Promise.all([
          bookApi.getBookById(bookId),
          bookApi.getRelatedBooks(bookId),
        ]);
        setBook(bookData);
        setRelatedBooks(relatedData);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    fetchBookData();
  }, [id]);

  const getCartItem = () => {
    if (!book) return null;
    return {
      book_id: book.book_id,
      title: book.title,
      price: book.oldPrice || book.price,
      sale_percent: book.sale_percent || 0,
      cover_image_url: book.cover_image_url || `https://picsum.photos/seed/book${book.book_id}/400/600`,
      quantity: quantity,
      stock_quantity: 100, // mock stock
      selected: true
    };
  };

  const handleAddToCart = async () => {
    const item = getCartItem();
    if (!item) return;

    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onAddToCart(item);
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    const item = getCartItem();
    if (!item) return;

    setIsBuying(true);
    onBuyNow(item);
    setTimeout(() => setIsBuying(false), 2000);
  };

  return {
    book,
    relatedBooks,
    loading,
    quantity,
    setQuantity,
    isAdding,
    isBuying,
    handleAddToCart,
    handleBuyNow
  };
};
