import type { Book } from "../types/Book";
import { mockCategoryBooks } from "../Data/mockCategoryBooks";
import { HOT_SEARCH_BOOKS, TOP_SELLING_BOOKS, FEATURED_BOOK } from "../Data/homeBooks";

// Combine all sources for detail lookup
const ALL_BOOKS = [
  ...mockCategoryBooks,
  ...HOT_SEARCH_BOOKS,
  ...TOP_SELLING_BOOKS,
  FEATURED_BOOK
];

// ===== Mapper =====
export const mapBook = (item: any): Book => {
  return {
    book_id: item.book_id,
    title: item.title,
    price: item.price,
    cover_image_url: item.cover_image_url,
    avg_rating: item.avg_rating,
    sale_percent: item.sale_percent,
    author_name: item.author_name,
    description: item.description,
    publisher: item.publisher,
    publication_date: item.publication_date,
    dimensions: item.dimensions,
    cover_type: item.cover_type,
    num_pages: item.num_pages,

    // UI fields (fallback/fake logic if needed)
    oldPrice: item.oldPrice ?? (
      item.sale_percent
        ? Math.round(item.price / (1 - item.sale_percent / 100))
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

export const getBookById = async (id: number): Promise<Book | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const book = ALL_BOOKS.find(b => b.book_id === id);
      resolve(book ? mapBook(book) : null);
    }, 500);
  });
};

export const getRelatedBooks = async (bookId: number): Promise<Book[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return some random books except the current one
      const related = mockCategoryBooks
        .filter(b => b.book_id !== bookId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 15)
        .map(mapBook);
      resolve(related);
    }, 500);
  });
};