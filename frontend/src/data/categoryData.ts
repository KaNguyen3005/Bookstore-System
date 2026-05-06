export const MOCK_CATEGORIES = [
  { category_id: 1, name: 'Tiểu Thuyết', parent_id: null },
  { category_id: 2, name: 'Kinh Tế', parent_id: null },
  { category_id: 3, name: 'Tâm Lý Học', parent_id: null },
  { category_id: 4, name: 'Giáo Dục', parent_id: null },
  { category_id: 5, name: 'Thiếu Nhi', parent_id: null },
];

export const MOCK_PUBLISHERS = [
  { publisher_id: 1, publisher_name: 'NXB Trẻ' },
  { publisher_id: 2, publisher_name: 'NXB Kim Đồng' },
  { publisher_id: 3, publisher_name: 'Nhã Nam' },
  { publisher_id: 4, publisher_name: 'Alpha Books' },
  { publisher_id: 5, publisher_name: 'NXB Tổng Hợp TP.HCM' },
];

export const MOCK_PRICE_RANGES = [
  { id: 1, label: 'Dưới 50.000đ', min_price: 0, max_price: 50000 },
  { id: 2, label: '50.000đ - 100.000đ', min_price: 50000, max_price: 100000 },
  { id: 3, label: '100.000đ - 200.000đ', min_price: 100000, max_price: 200000 },
  { id: 4, label: 'Trên 200.000đ', min_price: 200000, max_price: 999999999 },
];

export const MOCK_BOOKS = [
  { book_id: 1, title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', price: 80000, category_id: 1, publisher_id: 1, sale_percent: 10, avg_rating: 4.5, cover_image_url: 'https://picsum.photos/seed/1/200/280' },
  { book_id: 2, title: 'Nhà Giả Kim', price: 65000, category_id: 1, publisher_id: 3, sale_percent: null, avg_rating: 5, cover_image_url: 'https://picsum.photos/seed/2/200/280' },
  { book_id: 3, title: 'Cha Giàu Cha Nghèo', price: 110000, category_id: 2, publisher_id: 1, sale_percent: 15, avg_rating: 4.2, cover_image_url: 'https://picsum.photos/seed/3/200/280' },
  { book_id: 4, title: 'Tâm Lý Học Tội Phạm', price: 150000, category_id: 3, publisher_id: 4, sale_percent: null, avg_rating: 4.8, cover_image_url: 'https://picsum.photos/seed/4/200/280' },
  { book_id: 5, title: 'Dế Mèn Phiêu Lưu Ký', price: 45000, category_id: 5, publisher_id: 2, sale_percent: 5, avg_rating: 4, cover_image_url: 'https://picsum.photos/seed/5/200/280' },
  { book_id: 6, title: 'Sapiens: Lược Sử Loài Người', price: 210000, category_id: 2, publisher_id: 4, sale_percent: 20, avg_rating: 4.9, cover_image_url: 'https://picsum.photos/seed/6/200/280' },
];
