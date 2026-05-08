import axiosClient from "./axiosClient";
import users from "../data/user1";

const IS_MOCK = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface UserFE {
  id: number;
  userId: number;
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

// ===== BE → FE (snake → camel)
const mapToFE = (u: any): UserFE => ({
  id: u.user_id,
  userId: u.user_id,
  username: u.username,
  name: u.name,
  email: u.email,
  phone: u.phone,
  dob: u.dob,
  point: u.point,
  status: u.status,
  gender: u.gender,
  role: u.role,
  avatarUrl: u.avatar_url,
  address: u.address,
});

// ===== FE → BE (camel → snake)
const mapToDB = (u: UserFE, old: any) => {
  const [first, ...rest] = (u.name || "").split(" ");
  return {
    ...old,
    user_id: u.userId,
    username: u.username,
    first_name: first,
    last_name: rest.join(" "),
    email: u.email,
    phone: u.phone,
    dob: u.dob,
    point: u.point,
    avatar_url: u.avatarUrl,
    address: u.address,
    updated_at: new Date(),
  };
};

export const userApi = {
  getUserById: async (id: number): Promise<UserFE | null> => {
    if (IS_MOCK) {
      await delay(500);
      const user = users.find((u) => u.user_id === id);
      if (!user) return null;
      return mapToFE(user);
    }

    const res = await axiosClient.get(`/users/${id}`);
    return mapToFE(res);
  },

  updateUser: async (data: UserFE): Promise<UserFE> => {
    if (IS_MOCK) {
      await delay(500);
      const index = users.findIndex((u) => u.user_id === data.userId);
      if (index === -1) throw new Error("User not found");

      const updated = mapToDB(data, users[index]);
      users[index] = updated;

      return mapToFE(updated);
    }

    const payload = mapToDB(data, {});
    const res = await axiosClient.put(`/users/${data.userId}`, payload);
    return mapToFE(res);
  },
  getMe: async (): Promise<UserFE | null> => {
    if (IS_MOCK) {
      await delay(500);

      // lấy user từ localStorage để mock
      const u = localStorage.getItem("user");
      if (!u) return null;

      const parsed = JSON.parse(u);
      const user = users.find((x) => x.user_id === parsed.userId);

      return user ? mapToFE(user) : null;
    }

    try {
      const res: any = await axiosClient.get("/users/me");

      // tùy backend trả dạng nào
      const data = res?.data?.result || res?.data || res;

      return mapToFE(data);
    } catch (error) {
      console.error("getMe failed:", error);
      return null;
    }
  },

  getUsersByRole: async (roleId: number): Promise<UserFE[]> => {
    if (IS_MOCK) {
      await delay(500);
      return users.filter((u) => u.role_id === roleId).map(mapToFE);
    }

    const res = await axiosClient.get(`/users/role/${roleId}`);
    return res.data.map(mapToFE);
  },

  uploadAvatar: async (formData: FormData): Promise<{ url: string }> => {
    if (IS_MOCK) {
      await delay(500);
      return {
        url: URL.createObjectURL(formData.get("file") as File),
      };
    }

    return axiosClient.post("/users/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
