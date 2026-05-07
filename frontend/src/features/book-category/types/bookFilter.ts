export interface BookFilters {
  categoryId?: number;
  publisherId?: number;
  minPrice?: number;
  maxPrice?:number;
  page: number;
  sort:string;
}
