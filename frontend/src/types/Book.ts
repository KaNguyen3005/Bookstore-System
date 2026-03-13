export interface Book {
  id: number;
  title: string;
  price: number;
  author?: string;
  image?: string;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
}