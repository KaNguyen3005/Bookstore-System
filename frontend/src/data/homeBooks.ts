import type { Book } from "../features/product/types/Book";

const placeholderImage = (id: number, w = 200, h = 280) =>
  `https://picsum.photos/seed/book${id}/${w}/${h}`;

// ================= FEATURED =================
export const FEATURED_BOOK: Book = {
  book_id: 0,
  title: "Mắt biếc",
  price: 108000,
  cover_image_url: placeholderImage(0, 320, 450),
  sale_percent: 10,
  avg_rating: 4.5,
  author_name: "Nguyễn Nhật Ánh",

  // UI fields
  oldPrice: 120000,
  reviewCount: 1523,
};

// ================= HOT SEARCH =================
export const HOT_SEARCH_BOOKS: Book[] = [
  {
    book_id: 1,
    title: "Nhật ký cầu nguyện của tôi",
    price: 85000,
    cover_image_url: placeholderImage(1),
    avg_rating: 4.8,
    sale_percent: 5,

    oldPrice: 89000,
    reviewCount: 890,
  },
  {
    book_id: 2,
    title: "Đơn giản",
    price: 79000,
    cover_image_url: placeholderImage(2),
    avg_rating: 4.6,

    reviewCount: 1200,
  },
  {
    book_id: 3,
    title: "Những quý cô thời trang",
    price: 120000,
    cover_image_url: placeholderImage(3),
    avg_rating: 4.4,
    sale_percent: 15,

    oldPrice: 141000,
    reviewCount: 567,
  },
  {
    book_id: 4,
    title: "Tô bình yên",
    price: 95000,
    cover_image_url: placeholderImage(4),
    avg_rating: 4.7,

    reviewCount: 2100,
  },
  {
    book_id: 5,
    title: "Nội giới và ngoại giới",
    price: 110000,
    cover_image_url: placeholderImage(5),
    avg_rating: 4.3,
    sale_percent: 8,

    oldPrice: 119000,
    reviewCount: 432,
  },
  {
    book_id: 6,
    title: "Mắt biếc",
    price: 90000,
    cover_image_url: placeholderImage(6),
    avg_rating: 4.9,
    sale_percent: 10,

    oldPrice: 100000,
    reviewCount: 3500,
  },
];

// ================= TOP SELLING =================
export const TOP_SELLING_BOOKS: Book[] = [
  {
    book_id: 10,
    title: "Mắt biếc",
    price: 108000,
    cover_image_url: placeholderImage(10),
    sale_percent: 10,
    avg_rating: 4.9,
    author_name: "Nguyễn Nhật Ánh",

    oldPrice: 120000,
    reviewCount: 3500,
  },
  {
    book_id: 11,
    title: "Tôi thấy hoa vàng trên cỏ xanh",
    price: 90000,
    cover_image_url: placeholderImage(11),
    sale_percent: 10,
    avg_rating: 4.8,
    author_name: "Nguyễn Nhật Ánh",

    oldPrice: 100000,
    reviewCount: 2800,
  },
  {
    book_id: 12,
    title: "Clean Code",
    price: 180000,
    cover_image_url: placeholderImage(12),
    avg_rating: 4.7,
    author_name: "Robert C. Martin",

    reviewCount: 4200,
  },
  {
    book_id: 13,
    title: "Atomic Habits",
    price: 135000,
    cover_image_url: placeholderImage(13),
    sale_percent: 10,
    avg_rating: 4.6,
    author_name: "James Clear",

    oldPrice: 150000,
    reviewCount: 5600,
  },
  {
    book_id: 14,
    title: "Deep Work",
    price: 132000,
    cover_image_url: placeholderImage(14),
    sale_percent: 12,
    avg_rating: 4.5,
    author_name: "Cal Newport",

    oldPrice: 150000,
    reviewCount: 3200,
  },
];