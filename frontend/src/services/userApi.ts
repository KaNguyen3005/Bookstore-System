import axiosClient from "./axiosClient";
import users from "../data/user1";

const IS_MOCK = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface UserFE {
  id: number; // Thêm id để tương thích UI cũ
  user_id: number;
  username: string;
  fullname: string;
  firstname?: string; // Thêm để tương thích
  lastname?: string;  // Thêm để tương thích
  email: string;
  phone: string;
  address?: string;
  point: number;
  avatar?: string;
  birth: string;
  status: boolean;
  gender: string;
  role_id: number;
}

const mapToFE = (u: any): UserFE => ({
  id: u.user_id, // Map id từ user_id
  user_id: u.user_id,
  username: u.username,
  fullname: `${u.first_name || ""} ${u.last_name || ""}`.trim(),
  firstname: u.first_name,
  lastname: u.last_name,
  email: u.email,
  phone: u.phone,
  birth: u.birth,
  point: u.point,
  status: u.status,
  gender: u.gender,
  role_id: u.role_id,
});

const mapToDB = (u: UserFE, old: any) => {
  const [first, ...rest] = (u.fullname || "").split(" ");
  return {
    ...old,
    user_id: u.user_id,
    username: u.username,
    first_name: first,
    last_name: rest.join(" "),
    email: u.email,
    phone: u.phone,
    birth: u.birth,
    point: u.point,
    updatedAt: new Date(),
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
    return axiosClient.get(`/users/${id}`);
  },

  updateUser: async (data: UserFE): Promise<UserFE> => {
    if (IS_MOCK) {
      await delay(500);
      const index = users.findIndex((u) => u.user_id === data.user_id);
      if (index === -1) throw new Error("User not found");
      const updated = mapToDB(data, users[index]);
      users[index] = updated;
      return mapToFE(updated);
    }
    return axiosClient.put(`/users/${data.user_id}`, data);
  },

  getUsersByRole: async (roleId: number): Promise<UserFE[]> => {
    if (IS_MOCK) {
      await delay(500);
      return users.filter((u) => u.role_id === roleId).map(mapToFE);
    }
    return axiosClient.get(`/users/role/${roleId}`);
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
