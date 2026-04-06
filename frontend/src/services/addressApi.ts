import axiosClient from "./axiosClient";
import { mockAddresses } from "../data/address";

const IS_MOCK = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const addressApi = {
  // Mock Address methods
  getAll: async (userId: number): Promise<any[]> => {
    if (IS_MOCK) {
      await delay(500);
      return mockAddresses.filter((item) => item.user_id === userId && !item.deletedAt);
    }
    return axiosClient.get(`/addresses/user/${userId}`);
  },

  create: async (data: any): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);
      const newItem = {
        ...data,
        address_id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
      mockAddresses.push(newItem);
      return newItem;
    }
    return axiosClient.post("/addresses", data);
  },

  update: async (id: number, data: any): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);
      const index = mockAddresses.findIndex((item) => item.address_id === id);
      if (index !== -1) {
        mockAddresses[index] = {
          ...mockAddresses[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return mockAddresses[index];
      }
      throw new Error("Address not found");
    }
    return axiosClient.put(`/addresses/${id}`, data);
  },

  remove: async (id: number): Promise<boolean> => {
    if (IS_MOCK) {
      await delay(500);
      const item = mockAddresses.find((i) => i.address_id === id);
      if (item) {
        item.deletedAt = new Date().toISOString();
      }
      return true;
    }
    return axiosClient.delete(`/addresses/${id}`);
  },

  setDefault: async (id: number): Promise<boolean> => {
    if (IS_MOCK) {
      await delay(500);
      mockAddresses.forEach((item) => {
        item.is_default = item.address_id === id;
      });
      return true;
    }
    return axiosClient.patch(`/addresses/${id}/default`);
  },

  // Location methods
  getProvinces: async () => {
    // Luôn gọi API thật cho tỉnh thành hoặc dùng mock nếu cần
    const res = await fetch("https://provinces.open-api.vn/api/p/");
    return res.json();
  },

  getDistricts: async (provinceCode: number) => {
    const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    const data = await res.json();
    return data.districts;
  },

  getWards: async (districtCode: number) => {
    const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    const data = await res.json();
    return data.wards;
  },
};
