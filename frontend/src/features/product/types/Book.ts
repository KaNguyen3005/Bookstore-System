export interface Category {
  category_id: number;
  name: string;
}

export interface Book {
  book_id: number;
  title: string;
  price: number;
  author_name: string;
  description: string;
  cover_image_url: string;
  stock_quantity: number;
  publisher_name: string;
  isbn: string;
  publication_date: string;
  dimensions: string;
  cover_type: string;
  num_pages: number;
  is_active: boolean;
  avg_rating: number;
  reviewCount: number;
  oldPrice?: number;
  sale_percent?: number;
  categories: Category[];
}