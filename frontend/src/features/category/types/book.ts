export interface BookFilters {
  categoryIds: number[];
  publisherIds: number[];
  priceRange: { min: number; max: number } | null;
}
