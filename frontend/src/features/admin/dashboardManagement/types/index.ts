import type { Book } from "../../../product/types/Book";

export interface DashboardSummary {
  totalBooks: number;
  totalOrders: number;
  revenue: number;
  customers: number;
}

export interface RevenuePoint {
  name: string;
  value: number;
}

export interface RecentOrder {
  order_id: number;
  date: string;
  total: number;
  status: string;
}

export interface DashboardState {
  summary: DashboardSummary | null;
  recentOrders: RecentOrder[];
  revenueData: RevenuePoint[];
  topBooks: Book[];
  loading: boolean;
  error: string | null;
}
