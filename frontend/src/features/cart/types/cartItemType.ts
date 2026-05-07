export interface CartItemType {
  bookCartId?: number; // ✅ optional
  book: {
    bookId: number;
    title: string;
    price: number;
    salePercent: number;
    coverImgUrl: string;
    stockQuantity: number;
  };
  quantity: number;
  selected?: boolean;
}