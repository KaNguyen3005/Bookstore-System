import type { Book } from "../features/product/types/Book";

// ================= HELPERS (Private) =================
const placeholderImage = (id: number, w = 200, h = 280) =>
  `https://picsum.photos/seed/book${id}/${w}/${h}`;

// ================= MOCK ALL BOOKS =================
export const MOCK_ALL_BOOKS: Book[] = [
  {
    book_id: 1,
    title: "Harry Potter và Hòn Đá Phù Thủy",
    price: 96000,
    oldPrice: 120000,
    sale_percent: 20,
    author_name: "J.K. Rowling",
    description: "Cuốn sách đầu tiên trong series Harry Potter, kể về cậu bé phù thủy Harry Potter.",
    cover_image_url: placeholderImage(1),
    stock_quantity: 20,
    publisher_name: "NXB Trẻ",
    isbn: "9780747532699",
    publication_date: "1997-06-26",
    dimensions: "14x20 cm",
    cover_type: "Bìa mềm",
    num_pages: 350,
    is_active: true,
    avg_rating: 4.8,
    reviewCount: 1523,
    categories: [{ category_id: 1, name: "Văn học" }, { category_id: 2, name: "Giả tưởng" }],
  },
  {
    book_id: 2,
    title: "Clean Code",
    price: 150000,
    author_name: "Robert C. Martin",
    description: "Cuốn sách kinh điển về cách viết code sạch, dễ bảo trì.",
    cover_image_url: placeholderImage(2),
    stock_quantity: 15,
    publisher_name: "Pearson",
    isbn: "9780132350884",
    publication_date: "2008-08-01",
    dimensions: "18x24 cm",
    cover_type: "Bìa cứng",
    num_pages: 464,
    is_active: true,
    avg_rating: 4.9,
    reviewCount: 2800,
    categories: [{ category_id: 3, name: "Công nghệ" }, { category_id: 4, name: "Lập trình" }],
  },
  {
    book_id: 3,
    title: "Mắt biếc",
    price: 75600,
    oldPrice: 108000,
    sale_percent: 30,
    author_name: "Nguyễn Nhật Ánh",
    description: "Câu chuyện tình buồn giữa Ngạn và Hà Lan.",
    cover_image_url: placeholderImage(3, 320, 450),
    stock_quantity: 0, // Out of stock example
    publisher_name: "NXB Trẻ",
    isbn: "9786041147041",
    publication_date: "2019-01-01",
    dimensions: "13x20 cm",
    cover_type: "Bìa mềm",
    num_pages: 300,
    is_active: true,
    avg_rating: 4.5,
    reviewCount: 3500,
    categories: [{ category_id: 1, name: "Văn học" }, { category_id: 5, name: "Lãng mạn" }],
  },
  {
    book_id: 4,
    title: "Sapiens: Lược Sử Loài Người",
    price: 245000,
    author_name: "Yuval Noah Harari",
    description: "Khám phá lịch sử loài người từ thời kỳ đồ đá đến thế kỷ 21.",
    cover_image_url: placeholderImage(4),
    stock_quantity: 10,
    publisher_name: "NXB Thế Giới",
    isbn: "9786047732296",
    publication_date: "2014-01-01",
    dimensions: "16x24 cm",
    cover_type: "Bìa mềm",
    num_pages: 560,
    is_active: true,
    avg_rating: 4.7,
    reviewCount: 5430,
    categories: [{ category_id: 6, name: "Lịch sử" }, { category_id: 7, name: "Khoa học" }],
  },
  {
    book_id: 5,
    title: "Nhà Giả Kim",
    price: 71200,
    oldPrice: 89000,
    sale_percent: 20,
    author_name: "Paulo Coelho",
    description: "Hành trình theo đuổi vận mệnh của cậu bé chăn cừu Santiago.",
    cover_image_url: placeholderImage(5),
    stock_quantity: 50,
    publisher_name: "NXB Văn Học",
    isbn: "9786045635211",
    publication_date: "1988-01-01",
    dimensions: "13x20 cm",
    cover_type: "Bìa mềm",
    num_pages: 228,
    is_active: true,
    avg_rating: 4.9,
    reviewCount: 9800,
    categories: [{ category_id: 1, name: "Văn học" }, { category_id: 8, name: "Triết lý" }],
  },
  {
    book_id: 6,
    title: "Tâm Lý Học Tội Phạm",
    price: 135000,
    author_name: "Nhiều tác giả",
    description: "Phân tích tâm lý và hành vi của những tên tội phạm nguy hiểm.",
    cover_image_url: placeholderImage(6),
    stock_quantity: 5,
    publisher_name: "NXB Lao Động",
    isbn: "9786043015485",
    publication_date: "2020-01-01",
    dimensions: "14x20 cm",
    cover_type: "Bìa mềm",
    num_pages: 400,
    is_active: true,
    avg_rating: 4.4,
    reviewCount: 432,
    categories: [{ category_id: 9, name: "Tâm lý" }, { category_id: 10, name: "Tội phạm" }],
  },
  {
    book_id: 7,
    title: "Đắc Nhân Tâm",
    price: 95000,
    author_name: "Dale Carnegie",
    description: "Cuốn sách về nghệ thuật ứng xử và giao tiếp.",
    cover_image_url: placeholderImage(7),
    stock_quantity: 100,
    publisher_name: "NXB Tổng Hợp",
    isbn: "9786045880710",
    publication_date: "1936-01-01",
    dimensions: "14x20 cm",
    cover_type: "Bìa mềm",
    num_pages: 320,
    is_active: true,
    avg_rating: 4.8,
    reviewCount: 12500,
    categories: [{ category_id: 11, name: "Kỹ năng sống" }],
  },
  {
    book_id: 8,
    title: "Atomic Habits",
    price: 180000,
    author_name: "James Clear",
    description: "Thay đổi nhỏ, kết quả lớn thông qua việc xây dựng thói quen.",
    cover_image_url: placeholderImage(8),
    stock_quantity: 12,
    publisher_name: "NXB Lao Động",
    isbn: "9786043015119",
    publication_date: "2018-01-01",
    dimensions: "14x20 cm",
    cover_type: "Bìa mềm",
    num_pages: 320,
    is_active: true,
    avg_rating: 4.9,
    reviewCount: 6500,
    categories: [{ category_id: 11, name: "Kỹ năng sống" }, { category_id: 9, name: "Tâm lý" }],
  },
  {
    book_id: 9,
    title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    price: 125000,
    author_name: "Nguyễn Nhật Ánh",
    description: "Ký ức tuổi thơ tươi đẹp và đầy cảm động của những đứa trẻ vùng quê.",
    cover_image_url: placeholderImage(9),
    stock_quantity: 0, // Out of stock
    publisher_name: "NXB Trẻ",
    isbn: "9786041065017",
    publication_date: "2010-01-01",
    dimensions: "13x20 cm",
    cover_type: "Bìa mềm",
    num_pages: 378,
    is_active: true,
    avg_rating: 4.8,
    reviewCount: 4500,
    categories: [{ category_id: 1, name: "Văn học" }],
  },
  {
    book_id: 10,
    title: "Deep Work",
    price: 155000,
    author_name: "Cal Newport",
    description: "Làm việc chuyên sâu để đạt được hiệu suất cao nhất trong một thế giới đầy xao nhãng.",
    cover_image_url: placeholderImage(10),
    stock_quantity: 8,
    publisher_name: "NXB Lao Động",
    isbn: "9786043016222",
    publication_date: "2016-01-01",
    dimensions: "14x20 cm",
    cover_type: "Bìa mềm",
    num_pages: 300,
    is_active: true,
    avg_rating: 4.6,
    reviewCount: 3200,
    categories: [{ category_id: 11, name: "Kỹ năng sống" }, { category_id: 3, name: "Công nghệ" }],
  }
];

// ================= PUBLIC HELPERS =================

/**
 * Lấy sách bán chạy dựa trên số lượng review hoặc rating.
 */
export const getTopSellingBooks = (limit: number = 5): Book[] => {
  return [...MOCK_ALL_BOOKS]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);
};

/**
 * Lấy danh sách sách nổi bật (Hot Search).
 */
export const getHotSearchBooks = (limit: number = 6): Book[] => {
  return [...MOCK_ALL_BOOKS]
    .sort((a, b) => b.avg_rating - a.avg_rating)
    .slice(0, limit);
};

/**
 * Lấy 1 cuốn sách tiêu biểu (Featured Book) cho banner.
 */
export const getFeaturedBook = (): Book => {
  // Trả về cuốn sách đầu tiên hoặc cuốn có rating cao nhất
  return MOCK_ALL_BOOKS.reduce((prev, current) => 
    (prev.avg_rating > current.avg_rating) ? prev : current
  );
};

/**
 * Láy danh sách sách theo ID (Để tương thích ngược nếu cần)
 */
export const allBooks = MOCK_ALL_BOOKS;