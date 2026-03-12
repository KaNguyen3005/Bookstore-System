import type { Book } from "../types/Book";

const placeholderImage = (id: number, w = 200, h = 280) =>
  `https://picsum.photos/seed/book${id}/${w}/${h}`;

export const FEATURED_BOOK: Book = {
  id: 0,
  title: "Mắt biếc",
  price: 108000,
  oldPrice: 120000,
  image: placeholderImage(0, 320, 450),
  discount: 10,
  author: "Nguyễn Nhật Ánh",
  rating: 4.5,
  reviewCount: 1523,
};

export const HOT_SEARCH_BOOKS: Book[] = [
  { id: 1, title: "Nhật ký cầu nguyện của tôi", price: 85000, image: placeholderImage(1), rating: 4.8, reviewCount: 890, discount: 5, oldPrice: 89000 },
  { id: 2, title: "Đơn giản", price: 79000, image: placeholderImage(2), rating: 4.6, reviewCount: 1200 },
  { id: 3, title: "Những quý cô thời trang", price: 120000, image: placeholderImage(3), rating: 4.4, reviewCount: 567, discount: 15, oldPrice: 141000 },
  { id: 4, title: "Tô bình yên", price: 95000, image: placeholderImage(4), rating: 4.7, reviewCount: 2100 },
  { id: 5, title: "Nội giới và ngoại giới", price: 110000, image: placeholderImage(5), rating: 4.3, reviewCount: 432, discount: 8, oldPrice: 119000 },
  { id: 6, title: "Mắt biếc", price: 90000, image: placeholderImage(6), rating: 4.9, reviewCount: 3500, discount: 10, oldPrice: 100000 },
];

export const TOP_SELLING_BOOKS: Book[] = [
  {
    id: 10,
    title: "Mắt biếc",
    price: 108000,
    oldPrice: 120000,
    image: placeholderImage(10),
    discount: 10,
    author: "Nguyễn Nhật Ánh",
    rating: 4.9,
    reviewCount: 3500,
  },
  {
    id: 11,
    title: "Tôi thấy hoa vàng trên cỏ xanh",
    price: 90000,
    oldPrice: 100000,
    image: placeholderImage(11),
    discount: 10,
    author: "Nguyễn Nhật Ánh",
    rating: 4.8,
    reviewCount: 2800,
  },
  {
    id: 12,
    title: "Clean Code",
    price: 180000,
    image: placeholderImage(12),
    author: "Robert C. Martin",
    rating: 4.7,
    reviewCount: 4200,
  },
  {
    id: 13,
    title: "Atomic Habits",
    price: 135000,
    oldPrice: 150000,
    image: placeholderImage(13),
    discount: 10,
    author: "James Clear",
    rating: 4.6,
    reviewCount: 5600,
  },
  {
    id: 14,
    title: "Deep Work",
    price: 132000,
    oldPrice: 150000,
    image: placeholderImage(14),
    discount: 12,
    author: "Cal Newport",
    rating: 4.5,
    reviewCount: 3200,
  },
];
