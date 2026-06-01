import type { Category, Publisher } from "./category";

export interface BookFilters {
  categoryId?: Category["categoryId"];
  publisherId?: Publisher["publisherId"];
  minPrice?: number;
  maxPrice?:number;
  page: number;
  size?: number;
  sort:string;
}
