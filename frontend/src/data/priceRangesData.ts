export interface PriceRange {
  id: number;
  min: number;
  max?: number;
  label: string;
}

export const priceRangesData: PriceRange[] = [
  { id: 1, min: 0, max: 50000, label: "Dưới 50.000đ" },
  { id: 2, min: 50000, max: 100000, label: "50.000đ - 100.000đ" },
  { id: 3, min: 100000, max: 200000, label: "100.000đ - 200.000đ" },
  { id: 4, min: 200000, label: "Trên 200.000đ" }
];
