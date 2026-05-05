import axiosClient from "./axiosClient";
import users from "../data/user1";

const IS_MOCK = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface UserFE {
  id: number;
  user_id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  point: number;
  avatarUrl?: string;
  dob: Date;
  status: boolean;
  gender: string;
  role: string;
}

// ================= MAP BE -> FE =================
const mapToFE = (u: any): UserFE => ({
  id: u.user_id,
  user_id: u.user_id,
  username: u.username,
  name: u.name ?? `${u.first_name || ""} ${u.last_name || ""}`.trim(),
  email: u.email,
  phone: u.phone,
  address: u.address,
  avatarUrl: u.avatarUrl,
  dob: u.dob ? new Date(u.dob) : new Date(),
  point: u.point ?? 0,
  status: u.status ?? true,
  gender: u.gender ?? "UNKNOWN",
  role: u.role ?? "USER",
});

// ================= MAP FE -> BE =================
const mapToDB = (u: UserFE, old?: any) => {
  const [first, ...rest] = (u.name || "").split(" ");

  return {
    ...old,
    user_id: u.user_id,
    username: u.username,
    first_name: first,
    last_name: rest.join(" "),
    email: u.email,
    phone: u.phone,
    dob: u.dob,
    point: u.point,
    avatarUrl: u.avatarUrl,
    updatedAt: new Date(),
  };
};

// ================= API =================
export const userApi = {
  // 🔥 QUAN TRỌNG NHẤT
  getMe: async (): Promise<UserFE | null> => {
    if (IS_MOCK) {
      await delay(300);
      return mapToFE(users[0]);
    }

    try {
      const data = await axiosClient.post("/users/me");
      return mapToFE(data);
    } catch (err) {
      console.error("getMe error:", err);
      return null;
    }
  },

  // (Optional) vẫn giữ nếu cần admin
  getUserById: async (id: number): Promise<UserFE | null> => {
    if (IS_MOCK) {
      await delay(300);
      const user = users.find((u) => u.user_id === id);
      return user ? mapToFE(user) : null;
    }

    try {
      const data = await axiosClient.get(`/users/${id}`);
      return mapToFE(data);
    } catch (err) {
      console.error("getUserById error:", err);
      return null;
    }
  },

  updateUser: async (user: UserFE): Promise<UserFE> => {
    if (IS_MOCK) {
      await delay(300);
      const index = users.findIndex((u) => u.user_id === user.user_id);
      if (index === -1) throw new Error("User not found");

      const updated = mapToDB(user, users[index]);
      users[index] = updated;
      return mapToFE(updated);
    }

    try {
      const data = await axiosClient.put(
        `/users/${user.user_id}`,
        mapToDB(user)
      );
      return mapToFE(data);
    } catch (err) {
      console.error("updateUser error:", err);
      throw err;
    }
  },

  getUsersByRole: async (roleId: number): Promise<UserFE[]> => {
    if (IS_MOCK) {
      await delay(300);
      return users.filter((u) => u.role_id === roleId).map(mapToFE);
    }

    try {
      const data = await axiosClient.get(`/users/role/${roleId}`);
      return data.map(mapToFE);
    } catch (err) {
      console.error("getUsersByRole error:", err);
      return [];
    }
  },

  uploadAvatar: async (formData: FormData): Promise<{ url: string }> => {
    if (IS_MOCK) {
      await delay(300);
      return {
        url: URL.createObjectURL(formData.get("file") as File),
      };
    }

    try {
      return await axiosClient.post("/users/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      console.error("uploadAvatar error:", err);
      throw err;
    }
  },
};