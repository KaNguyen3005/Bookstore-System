import axiosClient from "../../../services/axiosClient";
import type { Publisher } from "../types/category";
import { publishersData } from "../../../data/publishersData";

const IS_MOCK = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const publisherService = {
  /**
   * 📌 Lấy danh sách publisher
   */
  getPublishers: async (): Promise<Publisher[]> => {
    // ================= MOCK =================
    if (IS_MOCK) {
      await delay(300);
      return publishersData;
    }

    // ================= API =================
    try {
      // 📌 lấy token
      const token = localStorage.getItem("accessToken");

      // 📌 gọi API
      const res: any = await axiosClient.get("/publishers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("PUBLISHERS RESPONSE:", res);

      // 📌 trả dữ liệu
      return res?.data?.result || [];
    } catch (error: any) {
      console.error("GET PUBLISHERS ERROR:", error?.response || error);

      throw new Error(
        error?.response?.data?.message || "Failed to fetch publishers",
      );
    }
  },
  /**
   * 📌 Lấy chi tiết 1 publisher
   */
  getPublisherById: async (id: number): Promise<Publisher | null> => {
    if (IS_MOCK) {
      await delay(200);

      return publishersData.find((p) => p.publisherId === id) || null;
    }

    const res: any = await axiosClient.get(`/publishers/${id}`);

    return res?.data?.result || null;
  },
};
