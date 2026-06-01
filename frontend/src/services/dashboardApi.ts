import axiosClient from "./axiosClient";

// ================= DASHBOARD OVERVIEW =================
export const getDashboard = async (params?: {
  range?: string;
  from?: string;
  to?: string;
  limit?: number;
  lowStockThreshold?: number;
}) => {
  const res = await axiosClient.get("/dashboard", {
    params: {
      range: params?.range || "today",
      from: params?.from,
      to: params?.to,
      limit: params?.limit || 10,
      lowStockThreshold: params?.lowStockThreshold || 5,
    },
  });

  return res.data?.result;
};

// ================= ORDER STATUS =================
export const getOrderStatus = async () => {
  const res = await axiosClient.get("/dashboard/order-status");
  return res.data?.result;
};

// ================= REVENUE CHART =================
export const getRevenueChart = async (
  range: string = "today",
  dateRange?: { from?: string; to?: string }
) => {
  const res = await axiosClient.get("/dashboard/revenue-chart", {
    params: { range, from: dateRange?.from, to: dateRange?.to },
  });
  return res.data?.result;
};

// ================= TOP SELLING BOOKS =================
export const getTopSellingBooks = async (
  range: string = "month",
  limit: number = 10,
  dateRange?: { from?: string; to?: string }
) => {
  const res = await axiosClient.get("/dashboard/top-selling-books", {
    params: { range, limit, from: dateRange?.from, to: dateRange?.to },
  });
  return res.data?.result;
};

// ================= TOP RATED BOOKS =================
export const getTopRatedBooks = async (limit: number = 10) => {
  const res = await axiosClient.get("/dashboard/top-rated-books", {
    params: { limit },
  });
  return res.data?.result;
};

// ================= RECENT ORDERS =================
export const getRecentOrders = async (limit: number = 10) => {
  const res = await axiosClient.get("/dashboard/recent-orders", {
    params: { limit },
  });
  return res.data?.result;
};

// ================= LOW STOCK BOOKS =================
export const getLowStockBooks = async (
  threshold: number = 5,
  limit: number = 10
) => {
  const res = await axiosClient.get("/dashboard/low-stock-books", {
    params: { threshold, limit },
  });
  return res.data?.result;
};

// ================= OUT OF STOCK BOOKS =================
export const getOutOfStockBooks = async (limit: number = 10) => {
  const res = await axiosClient.get("/dashboard/out-of-stock-books", {
    params: { limit },
  });
  return res.data?.result;
};
