export interface Book {
  book_id: number;
  title: string;
  price: number;
  author_name?: string;
  cover_image_url?: string;
  oldPrice?: number;
  sale_percent?: number;
  avg_rating?: number;
  reviewCount?: number;
  description?: string;
  publisher?: string;
  publication_date?: string;
  dimensions?: string;
  cover_type?: string;
  num_pages?: number;
}