import type { Book } from "../features/product/types/Book";
import type { Publisher } from "../features/book-category/types/category";
import type { Category } from "../features/book-category/types/category";


// ================= HELPERS =================
const placeholderImage = (id: number, w = 200, h = 280) =>
  `https://picsum.photos/seed/book${id}/${w}/${h}`;

// ================= MOCK DATA =================
export const MOCK_ALL_BOOKS: Book[] = [
  {
    bookId: 1,
    title: "Harry Potter và Hòn Đá Phù Thủy",
    price: 96000,
    oldPrice: 120000,
    salePercent: 20,
    authorName: "J.K. Rowling",
    description: "Cuốn sách đầu tiên trong series Harry Potter.",
    coverImgUrl: placeholderImage(1),
    stockQuantity: 20,

    publishers: {
      publisherId: 1,
      publisherName: "NXB Trẻ",
    },

    isbn: "9780747532699",
    publicationDate: "1997-06-26",
    dimensions: "14x20 cm",
    coverType: "Bìa mềm",
    numPages: 350,
    isActive: true,
    avgRating: 4.8,
    reviewCount: 1523,

    categories: [
      { categoryId: 1, categoryName: "Văn học" },
      { categoryId: 2, categoryName: "Giả tưởng" },
    ],
  },

  {
    bookId: 2,
    title: "Clean Code",
    price: 150000,
    authorName: "Robert C. Martin",
    description: "Cuốn sách kinh điển về viết code sạch.",
    coverImgUrl: placeholderImage(2),
    stockQuantity: 15,

    publishers: {
      publisherId: 2,
      publisherName: "Pearson",
    },

    isbn: "9780132350884",
    publicationDate: "2008-08-01",
    dimensions: "18x24 cm",
    coverType: "Bìa cứng",
    numPages: 464,
    isActive: true,
    avgRating: 4.9,
    reviewCount: 2800,

    categories: [
      { categoryId: 3, categoryName: "Công nghệ" },
      { categoryId: 4, categoryName: "Lập trình" },
    ],
  },

  {
    bookId: 3,
    title: "Mắt biếc",
    price: 75600,
    oldPrice: 108000,
    salePercent: 30,
    authorName: "Nguyễn Nhật Ánh",
    description: "Câu chuyện tình buồn.",
    coverImgUrl: placeholderImage(3, 320, 450),
    stockQuantity: 0,

    publishers: {
      publisherId: 1,
      publisherName: "NXB Trẻ",
    },

    isbn: "9786041147041",
    publicationDate: "2019-01-01",
    dimensions: "13x20 cm",
    coverType: "Bìa mềm",
    numPages: 300,
    isActive: true,
    avgRating: 4.5,
    reviewCount: 3500,

    categories: [
      { categoryId: 1, categoryName: "Văn học" },
      { categoryId: 5, categoryName: "Lãng mạn" },
    ],
  },

  {
    bookId: 4,
    title: "Sapiens: Lược Sử Loài Người",
    price: 245000,
    authorName: "Yuval Noah Harari",
    description: "Lịch sử loài người.",
    coverImgUrl: placeholderImage(4),
    stockQuantity: 10,

    publishers: {
      publisherId: 3,
      publisherName: "NXB Thế Giới",
    },

    isbn: "9786047732296",
    publicationDate: "2014-01-01",
    dimensions: "16x24 cm",
    coverType: "Bìa mềm",
    numPages: 560,
    isActive: true,
    avgRating: 4.7,
    reviewCount: 5430,

    categories: [
      { categoryId: 6, categoryName: "Lịch sử" },
      { categoryId: 7, categoryName: "Khoa học" },
    ],
  },

  {
    bookId: 5,
    title: "Nhà Giả Kim",
    price: 71200,
    oldPrice: 89000,
    salePercent: 20,
    authorName: "Paulo Coelho",
    description: "Hành trình tìm vận mệnh.",
    coverImgUrl: placeholderImage(5),
    stockQuantity: 50,

    publishers: {
      publisherId: 4,
      publisherName: "NXB Văn Học",
    },

    isbn: "9786045635211",
    publicationDate: "1988-01-01",
    dimensions: "13x20 cm",
    coverType: "Bìa mềm",
    numPages: 228,
    isActive: true,
    avgRating: 4.9,
    reviewCount: 9800,

    categories: [
      { categoryId: 1, categoryName: "Văn học" },
      { categoryId: 8, categoryName: "Triết lý" },
    ],
  },

  {
    bookId: 6,
    title: "Tâm Lý Học Tội Phạm",
    price: 135000,
    authorName: "Nhiều tác giả",
    description: "Phân tích tâm lý tội phạm.",
    coverImgUrl: placeholderImage(6),
    stockQuantity: 5,

    publishers: {
      publisherId: 5,
      publisherName: "NXB Lao Động",
    },

    isbn: "9786043015485",
    publicationDate: "2020-01-01",
    dimensions: "14x20 cm",
    coverType: "Bìa mềm",
    numPages: 400,
    isActive: true,
    avgRating: 4.4,
    reviewCount: 432,

    categories: [
      { categoryId: 9, categoryName: "Tâm lý" },
      { categoryId: 10, categoryName: "Tội phạm" },
    ],
  },

  {
    bookId: 7,
    title: "Đắc Nhân Tâm",
    price: 95000,
    authorName: "Dale Carnegie",
    description: "Giao tiếp & ứng xử.",
    coverImgUrl: placeholderImage(7),
    stockQuantity: 100,

    publishers: {
      publisherId: 6,
      publisherName: "NXB Tổng Hợp",
    },

    isbn: "9786045880710",
    publicationDate: "1936-01-01",
    dimensions: "14x20 cm",
    coverType: "Bìa mềm",
    numPages: 320,
    isActive: true,
    avgRating: 4.8,
    reviewCount: 12500,

    categories: [
      { categoryId: 11, categoryName: "Kỹ năng sống" },
    ],
  },

  {
    bookId: 8,
    title: "Atomic Habits",
    price: 180000,
    authorName: "James Clear",
    description: "Thói quen nhỏ thay đổi cuộc đời.",
    coverImgUrl: placeholderImage(8),
    stockQuantity: 12,

    publishers: {
      publisherId: 5,
      publisherName: "NXB Lao Động",
    },

    isbn: "9786043015119",
    publicationDate: "2018-01-01",
    dimensions: "14x20 cm",
    coverType: "Bìa mềm",
    numPages: 320,
    isActive: true,
    avgRating: 4.9,
    reviewCount: 6500,

    categories: [
      { categoryId: 11, categoryName: "Kỹ năng sống" },
      { categoryId: 9, categoryName: "Tâm lý" },
    ],
  },

  {
    bookId: 9,
    title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    price: 125000,
    authorName: "Nguyễn Nhật Ánh",
    description: "Tuổi thơ vùng quê.",
    coverImgUrl: placeholderImage(9),
    stockQuantity: 0,

    publishers: {
      publisherId: 1,
      publisherName: "NXB Trẻ",
    },

    isbn: "9786041065017",
    publicationDate: "2010-01-01",
    dimensions: "13x20 cm",
    coverType: "Bìa mềm",
    numPages: 378,
    isActive: true,
    avgRating: 4.8,
    reviewCount: 4500,

    categories: [
      { categoryId: 1, categoryName: "Văn học" },
    ],
  },

  {
    bookId: 10,
    title: "Deep Work",
    price: 155000,
    authorName: "Cal Newport",
    description: "Tập trung sâu để hiệu suất cao.",
    coverImgUrl: placeholderImage(10),
    stockQuantity: 8,

    publishers: {
      publisherId: 5,
      publisherName: "NXB Lao Động",
    },

    isbn: "9786043016222",
    publicationDate: "2016-01-01",
    dimensions: "14x20 cm",
    coverType: "Bìa mềm",
    numPages: 300,
    isActive: true,
    avgRating: 4.6,
    reviewCount: 3200,

    categories: [
      { categoryId: 11, categoryName: "Kỹ năng sống" },
      { categoryId: 3, categoryName: "Công nghệ" },
    ],
  },
];

export const getHotSearchBooks = (): Book[] => {
  return MOCK_ALL_BOOKS.slice(0, 10);
};

export const getTopSellingBooks = (limit: number = 10): Book[] => {
  return MOCK_ALL_BOOKS.slice(0, limit);
};

export const getFeaturedBook = (): Book => {
  return MOCK_ALL_BOOKS[0];
};