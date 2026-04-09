import axiosClient from "../../../services/axiosClient";

const IS_MOCK = true;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminApi = {
  getDashboardSummary: async (): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);
      return { 
        totalBooks: 920, 
        totalOrders: 320, 
        revenue: 12500000, 
        customers: 1203 
      };
    }
    return axiosClient.get("/admin/summary");
  }
};
