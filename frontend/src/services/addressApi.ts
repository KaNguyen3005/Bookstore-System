import axiosClient from "./axiosClient";
import { mockAddresses } from "../data/address";

const IS_MOCK = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isVisibleLocationName = (name?: string) => {
  const normalizedName = (name || "").trim().toLowerCase();

  if (!normalizedName) {
    return false;
  }

  return (
    !normalizedName.includes("test") &&
    !normalizedName.includes("alert") &&
    !normalizedName.includes("đặc biệt") &&
    !normalizedName.includes("dac biet") &&
    !/\d{2,}/.test(normalizedName)
  );
};

const getAuthHeader = () => {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const addressApi = {
  // =========================
  // ADDRESS CRUD
  // =========================

  getAll: async (): Promise<any[]> => {
    if (IS_MOCK) {
      await delay(500);

      return mockAddresses.filter((item) => !item.deletedAt);
    }

    const response = await axiosClient.get("/addresses", getAuthHeader());

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

    const response = await axiosClient.post(
      "/addresses",
      data,
      getAuthHeader(),
    );

    return response.data.result;
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

    const response = await axiosClient.patch(
      `/addresses/${id}`,
      data,
      getAuthHeader(),
    );

    return response.data.result;
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

    await axiosClient.delete(`/addresses/${id}`, getAuthHeader());
  },

  // =========================
  // LOCATION APIs
  // =========================

  // GET /api/v1/addresses/provinces
  getProvinces: async () => {
    const response = await axiosClient.get(
      "/addresses/provinces",
      getAuthHeader(),
    );

    console.log("PROVINCES API:", response.data.result);

    return response.data.result
      .filter((item: any) => isVisibleLocationName(item.ProvinceName))
      .map((item: any) => ({
        provinceId: item.ProvinceID,

        provinceName: item.ProvinceName,
      }));
  },

  // GET /api/v1/addresses/districts/{provinceId}
  getDistricts: async (provinceId: number | string) => {
    if (!provinceId) {
      return [];
    }

    const response = await axiosClient.get(
      `/addresses/districts/${provinceId}`,
      getAuthHeader(),
    );

    console.log("DISTRICTS API:", response.data.result);

    return response.data.result
      .filter((item: any) => isVisibleLocationName(item.DistrictName))
      .map((item: any) => ({
        districtId: item.DistrictID,

        districtName: item.DistrictName,
      }));
  },

  // GET /api/v1/addresses/wards/{districtId}
  getWards: async (districtId: number | string) => {
    if (!districtId) {
      return [];
    }

    const response = await axiosClient.get(
      `/addresses/wards/${districtId}`,
      getAuthHeader(),
    );

    console.log("WARDS API:", response.data.result);

    return response.data.result.map((item: any) => ({
      wardId: item.WardCode,

      wardName: item.WardName,
    }));
  },

    setDefault: async (id: number) => {
      const res = await axiosClient.patch(
        `/addresses/${id}/default`
      );

      return res.data?.result;
    },
};
