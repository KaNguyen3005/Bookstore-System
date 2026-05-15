import type { Category } from "./category";

export interface BookFilters {
  categoryId?: Category["categoryId"];
  publisherId?: number;
  minPrice?: number;
  maxPrice?:number;
  page: number;
  sort:string;
}
