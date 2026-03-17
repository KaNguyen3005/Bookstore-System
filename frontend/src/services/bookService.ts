import type { Book } from "../types/Book";
import { mockCategoryBooks } from "../Data/mockCategoryBooks";

// ===== Mapper =====
const mapBook = (item: any): Book => {
  return {
    book_id: item.book_id,
    title: item.title,
    price: item.price,
    cover_image_url: item.cover_image_url,
    avg_rating: item.avg_rating,
    sale_percent: item.sale_percent,
    author_name: item.author_name,

    // UI fields (fake)
    oldPrice: item.oldPrice ?? (
      item.sale_percent
        ? item.price + (item.price * item.sale_percent) / 100
        : undefined
    ),
    reviewCount: item.reviewCount ?? Math.floor(Math.random() * 5000),
  };
};

// ===== Fake API =====
export const getBooks = async (): Promise<Book[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = mockCategoryBooks.map(mapBook);
      resolve(data);
    }, 500);
  });
};