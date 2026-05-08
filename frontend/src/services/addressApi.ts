import axiosClient from "./axiosClient";
import { mockAddresses } from "../data/address";

const IS_MOCK = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const addressApi = {
  // ─────────────────────────────────────────
  // Address CRUD
  // ─────────────────────────────────────────

  getAll: async (): Promise<any[]> => {
    if (IS_MOCK) {
      await delay(500);

      return mockAddresses.filter((item) => !item.deletedAt);
    }

    const response = await axiosClient.get("/addresses");

    return response.data.result
      .filter((item: any) => !item.deletedAt)
      .map((item: any) => ({
        addressId: item.addressId,
        province: item.province,
        district: item.district,
        ward: item.ward,
        detailAddress: item.detailAddress,
        customerName: item.customerName,
        customerPhone: item.customerPhone,
        isDefault: item.isDefault,
      }));
  },

  create: async (data: any): Promise<any> => {
    if (IS_MOCK) {
      await delay(500);

      const newItem = {
        ...data,
        addressId: Date.now(),
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

      const index = mockAddresses.findIndex((item) => item.addressId === id);

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

    return axiosClient.patch(`/addresses/${id}`, data);
  },

  remove: async (id: number): Promise<void> => {
    if (IS_MOCK) {
      await delay(500);

      const index = mockAddresses.findIndex((item) => item.addressId === id);

      if (index !== -1) {
        mockAddresses.splice(index, 1);
      }

      return;
    }

    await axiosClient.delete(`/addresses/${id}`);
  },

  setDefault: async (id: number): Promise<void> => {
    if (IS_MOCK) {
      await delay(500);

      mockAddresses.forEach((item) => {
        item.isDefault = item.addressId === id;
      });

      return;
    }

    await axiosClient.patch(`/addresses/${id}/default`);
  },

  // ─────────────────────────────────────────
  // Location APIs
  // ─────────────────────────────────────────

  // addressApi.ts

  getProvinces: async () => {
    const response = await axiosClient.get("/addresses/provinces");

    return response.data.result.map((item: any) => ({
      provinceId: item.ProvinceID,
      provinceName: item.ProvinceName,
    }));
  },

  getDistricts: async (provinceId: number | string) => {
    const response = await axiosClient.get(
      `/addresses/districts/${provinceId}`,
    );

    return response.data.result.map((item: any) => ({
      districtId: item.DistrictID,
      districtName: item.DistrictName,
    }));
  },

  getWards: async (districtId: number | string) => {
    const response = await axiosClient.get(`/addresses/wards/${districtId}`);

    return response.data.result.map((item: any) => ({
      wardId: item.WardCode,
      wardName: item.WardName,
    }));
  },
};
