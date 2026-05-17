import { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import { orderApi } from "../../../../services/orderApi";
import { bookApi } from "../../../../services/bookApi";
import type { DashboardState } from "../types";

export const useDashboardData = () => {
  const [state, setState] = useState<DashboardState>({
    summary: null,
    recentOrders: [],
    revenueData: [],
    topBooks: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, ordersRes, revenueRes, booksRes] = await Promise.all([
          adminApi.getDashboardSummary(),
          orderApi.getOrders({ page: 0, size: 5 }),
          orderApi.getOrder({ page: 0, size: 100 }),
          bookApi.getTopSellingBooks(4),
        ]);

        setState({
          summary: summaryRes,
          recentOrders: ordersRes,
          revenueData: revenueRes,
          topBooks: booksRes,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.",
        }));
      }
    };

    fetchData();
  }, []);

  return state;
};
