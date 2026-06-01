import type { Book } from "../features/product/types/Book";

const placeholderImage = (id: number, w = 200, h = 280) =>
  `https://picsum.photos/seed/cat_${id}/${w}/${h}`;

export const mockCategoryBooks: Book[] = [
  {
    book_id: 101,
    title: "Người Hành Hương",
    author_name: "Paulo Coelho",
    price: 98000,
    cover_image_url: placeholderImage(101),
    sale_percent: 18,
    avg_rating: 4.8,

    oldPrice: 120000,
    reviewCount: 342,
  },
  {
    book_id: 102,
    title: "Sức Mạnh Của Thói Quen",
    author_name: "Charles Duhigg",
    price: 135000,
    cover_image_url: placeholderImage(102),
    sale_percent: 10,
    avg_rating: 4.7,

    oldPrice: 150000,
    reviewCount: 1250,
  },
  {
    book_id: 103,
    title: "Chiến Binh Cầu Vồng",
    author_name: "Andrea Hirata",
    price: 85000,
    cover_image_url: placeholderImage(103),
    avg_rating: 4.9,

    reviewCount: 890,
  },
  {
    book_id: 104,
    title: "Sapiens: Lược Sử Loài Người",
    author_name: "Yuval Noah Harari",
    price: 245000,
    cover_image_url: placeholderImage(104),
    sale_percent: 18,
    avg_rating: 4.9,

    oldPrice: 300000,
    reviewCount: 5430,
  },
  {
    book_id: 105,
    title: "Think and Grow Rich",
    author_name: "Napoleon Hill",
    price: 110000,
    cover_image_url: placeholderImage(105),
    sale_percent: 15,
    avg_rating: 4.6,

    oldPrice: 129000,
    reviewCount: 2100,
  },
  {
    book_id: 106,
    title: "Cây Cam Ngọt Của Tôi",
    author_name: "José Mauro de Vasconcelos",
    price: 95000,
    cover_image_url: placeholderImage(106),
    sale_percent: 14,
    avg_rating: 4.8,

    oldPrice: 110000,
    reviewCount: 1750,
  },
  {
    book_id: 107,
    title: "Nhà Giả Kim",
    author_name: "Paulo Coelho",
    price: 89000,
    cover_image_url: placeholderImage(107),
    avg_rating: 4.9,

    reviewCount: 9800,
  },
  {
    book_id: 108,
    title: "Thao Túng Tâm Lý",
    author_name: "George K. Simon",
    price: 125000,
    cover_image_url: placeholderImage(108),
    sale_percent: 11,
    avg_rating: 4.5,

    oldPrice: 140000,
    reviewCount: 650,
  },
];