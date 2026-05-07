export interface PriceRange {
  id: number;
  minPrice: number;
  maxPrice?: number;
  label: string;
}

export const priceRangesData: PriceRange[] = [
  { id: 1, minPrice: 0, maxPrice: 50000, label: "Dưới 50.000đ" },
  { id: 2, minPrice: 50000, maxPrice: 100000, label: "50.000đ - 100.000đ" },
  { id: 3, minPrice: 100000, maxPrice: 200000, label: "100.000đ - 200.000đ" },
  { id: 4, minPrice: 200000, label: "Trên 200.000đ" }
];
