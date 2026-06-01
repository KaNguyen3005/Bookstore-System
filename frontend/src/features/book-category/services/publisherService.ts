import axiosClient from "../../../services/axiosClient";
import type { Publisher, PublisherId } from "../types/category";
import { publishersData } from "../../../data/publishersData";

const IS_MOCK = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type PublisherPayload = {
  publisherName: string;
};

const toApiPayload = (payload: PublisherPayload) => ({
  publisherName: payload.publisherName.trim(),
});

export const publisherService = {
  /**
   * Lấy danh sách publisher
   */
  getPublishers: async (): Promise<Publisher[]> => {
    // ================= MOCK =================
    if (IS_MOCK) {
      await delay(300);
      return publishersData.map((publisher) => ({
        publisherId: String(publisher.publisherId),
        publisherName: publisher.publisherName,
      }));
    }

    try {
      const res: any = await axiosClient.get("/publishers", {
        skipAuth: true,
        skipAuthRedirect: true,
      } as any);

      console.log("PUBLISHERS RESPONSE:", res);

      return res.data.result;
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
  getPublisherById: async (id: PublisherId): Promise<Publisher | null> => {
    if (IS_MOCK) {
      await delay(200);

      const publisher = publishersData.find(
        (p) => String(p.publisherId) === String(id),
      );

      if (!publisher) return null;

      return {
        publisherId: String(publisher.publisherId),
        publisherName: publisher.publisherName,
      };
    }

    const res: any = await axiosClient.get(`/publishers/${id}`, {
      skipAuth: true,
      skipAuthRedirect: true,
    } as any);

    return res.data.result;
  },

  createPublisher: async (payload: PublisherPayload): Promise<Publisher> => {
    if (IS_MOCK) {
      await delay(250);

      return {
        publisherId: String(Date.now()),
        publisherName: payload.publisherName,
      };
    }

    const res: any = await axiosClient.post("/publishers", toApiPayload(payload));

    return res.data.result;
  },

  updatePublisher: async (
    id: PublisherId,
    payload: PublisherPayload,
  ): Promise<Publisher> => {
    if (IS_MOCK) {
      await delay(250);

      return {
        publisherId: String(id),
        publisherName: payload.publisherName,
      };
    }

    const res: any = await axiosClient.patch(
      `/publishers/${id}`,
      toApiPayload(payload),
    );

    return res.data.result;
  },

  deletePublisher: async (id: PublisherId): Promise<void> => {
    if (IS_MOCK) {
      await delay(200);
      return;
    }

    await axiosClient.delete(`/publishers/${id}`);
  },
};
