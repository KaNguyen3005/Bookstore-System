export interface Category {
  category_id: number;
  name: string;
}

export interface Book {
  book_id: number;
  title: string;
  publisher_id: number;
  isbn: string;
  language: string;
  description: string;
  page_count: number;
  cover_type: string;
  cover_image_url: string;
  stock_quantity: number;
  price: number;
  avg_rating: number;
  sale_percent: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  categories: Category[];
}

export const books: Book[] = [
  {
    book_id: 1,
    title: "Harry Potter và Hòn Đá Phù Thủy",
    publisher_id: 101,
    isbn: "9780747532699",
    language: "vi",
    description: "Cuốn sách đầu tiên trong series Harry Potter",
    page_count: 350,
    cover_type: "hardcover",
    cover_image_url: "https://cdn1.fahasa.com/media/catalog/product/t/h/tham-tu-lung-danh-conan-hoat-hinh-mau_vien-dan-do_tap-1_bia.jpg",
    stock_quantity: 20,
    price: 120000,
    avg_rating: 4.8,
    sale_percent: 10,
    is_active: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-10",
    deletedAt: null,
    categories: [
      { category_id: 1, name: "Trinh Thám" },
      { category_id: 2, name: "Tình Cảm" }
    ]
  },
  {
    book_id: 2,
    title: "Clean Code",
    publisher_id: 102,
    isbn: "9780132350884",
    language: "en",
    description: "Sách về viết code sạch",
    page_count: 450,
    cover_type: "paperback",
    cover_image_url: "https://taisach.org/wp-content/uploads/2022/03/businessbooks-nguoi-ban-hang-vi-dai-nhat-the-gioi.jpg",
    stock_quantity: 15,
    price: 150000,
    avg_rating: 4.9,
    sale_percent: 0,
    is_active: true,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-05",
    deletedAt: null,
    categories: [
      { category_id: 3, name: "Học thuật toán" }
    ]
  },
  {
    book_id: 3,
    title: "React Cơ Bản",
    publisher_id: 103,
    isbn: "9781234567890",
    language: "vi",
    description: "Học React từ cơ bản đến nâng cao",
    page_count: 300,
    cover_type: "paperback",
    cover_image_url: "https://tuvantuyensinh.vn/wp-content/uploads/2025/12/Tai-FREE-Sach-Lap-Trinh-React-That-Don-Gian-PDF-Tung-Buoc-Tao-Ung-Dung-Tu-A-Z.png",
    stock_quantity: 10,
    price: 99000,
    avg_rating: 4.5,
    sale_percent: 5,
    is_active: true,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-02",
    deletedAt: null,
    categories: [
      { category_id: 3, name: "Học thuật" },
      { category_id: 4, name: "Frontend" }
    ]
  },
  {
    book_id: 21,
    title: "Conan Tham Tu lung danh tap 3",
    publisher_id: 102,
    isbn: "9780132350884",
    language: "en",
    description: "Sách về viết code sạch",
    page_count: 450,
    cover_type: "paperback",
    cover_image_url: "https://cdn1.fahasa.com/media/catalog/product/t/h/tham-tu-lung-danh-conan-hoat-hinh-mau_vien-dan-do_tap-1_bia.jpg",
    stock_quantity: 15,
    price: 150000,
    avg_rating: 4.9,
    sale_percent: 0,
    is_active: true,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-05",
    deletedAt: null,
    categories: [
      { category_id: 1, name: "Trinh thám" }
    ]
  },
  {
    book_id: 20,
    title: "Conan Tham Tu lung danh tap 1",
    publisher_id: 102,
    isbn: "9780132350884",
    language: "en",
    description: "Sách về viết code sạch",
    page_count: 450,
    cover_type: "paperback",
    cover_image_url: "https://cdn1.fahasa.com/media/catalog/product/t/h/tham-tu-lung-danh-conan-hoat-hinh-mau_vien-dan-do_tap-1_bia.jpg",
    stock_quantity: 15,
    price: 150000,
    avg_rating: 4.9,
    sale_percent: 0,
    is_active: true,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-05",
    deletedAt: null,
    categories: [
      { category_id: 3, name: "Trinh thám" }
    ]
  }
];