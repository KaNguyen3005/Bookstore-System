import axiosClient from "./axiosClient";
import users from "../data/user1";

const IS_MOCK = false;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface UserFE {
  userId: number;
  username: string;
  name: string;
  email?: string;
  phone: string;
  point: number;
  avatarUrl?: string;
  dob: Date;
  status?: boolean;
  gender: string;
  role: string;
  tier?: string;
}

const mapToFE = (u: any): UserFE => ({
  userId: u.userId,
  username: u.username,
  name: u.name,
  email: u.email,
  phone: u.phone,
  point: u.point ?? 0,
  avatarUrl: u.avatarUrl,
  dob: u.dob ? new Date(u.dob) : new Date(),
  status: u.status,
  gender: u.gender,
  role: u.role,
  tier: u.tier,
});

const mapToUpdatePayload = (u: UserFE) => ({
  username: u.username,
  name: u.name,
  phone: u.phone,
  gender: u.gender,
  point: u.point,
  dob: u.dob,
});

export const userApi = {
  // ================= GET ME =================

    getMe: async (): Promise<UserFE | null> => {
      try {
        const res: any = await axiosClient.get("/users/me");

        return mapToFE(res.data.result);
      } catch (error) {
        console.error("getMe failed:", error);
        return null;
      }
    },

      // ================= GET ALL =================
      getAllUsers: async (): Promise<UserFE[]> => {
        if (IS_MOCK) {
          await delay(500);
          return users.map(mapToFE);
        }

        const res = await axiosClient.get("/users");

        return res.data.result.map(mapToFE);
      },

  // ================= GET BY ID =================
  getUserById: async (id: number): Promise<UserFE | null> => {
    if (IS_MOCK) {
      await delay(500);

      const user = users.find((u: any) => u.userId === id);

      return user ? mapToFE(user) : null;
    }

    const res = await axiosClient.get(`/users/${id}`);

    return mapToFE(res.data.result);
  },

  // ================= UPDATE =================
  updateUser: async (data: UserFE): Promise<UserFE> => {
    if (IS_MOCK) {
      await delay(500);

      return data;
    }

    const payload = mapToUpdatePayload(data);

    const res = await axiosClient.patch(
      `/users/${data.userId}`,
      payload
    );

    return mapToFE(res.data.result);
  },

  // ================= UPDATE ME =================
  updateMe: async (data: Partial<UserFE>) => {
    const res: any = await axiosClient.patch(
      "/users/me",
      data
    );

    return mapToFE(res.result);
  },

  // ================= DISABLE =================
  disableUser: async (id: number) => {
    const res: any = await axiosClient.post(
      `/users/${id}/disable`
    );

    return res.result;
  },

  // ================= UPDATE STATUS =================
  updateStatus: async (
    id: number,
    status: boolean
  ) => {
    const res: any = await axiosClient.put(
      `/users/${id}/status`,
      { status }
    );

    return res.result;
  },

  // ================= DELETE =================
  deleteUser: async (id: number) => {
    const res: any = await axiosClient.delete(
      `/users/${id}`
    );

    return res.result;
  },
};