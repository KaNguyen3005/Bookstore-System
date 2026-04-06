import axiosClient from "./axiosClient";
import users from "../data/user1";
import { type UserFE } from "./userApi";

const IS_MOCK = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mapToFE = (u: any): UserFE => ({
  id: u.user_id,
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

export const authApi = {
  login: async (data: any): Promise<UserFE> => {
    if (IS_MOCK) {
      await delay(500);
      const user = users.find(
        (u) =>
          (u.email === data.account ||
            u.phone === data.account ||
            u.username === data.account) &&
          u.password === data.password
      );
      if (user) {
        return mapToFE(user);
      }
      throw new Error("Invalid credentials");
    }
    return axiosClient.post("/auth/login", data);
  },

  register: async (data: any) => {
    if (IS_MOCK) {
      await delay(500);
      return { message: "Register success" };
    }
    return axiosClient.post("/auth/register", data);
  },

  logout: async () => {
    if (IS_MOCK) {
      await delay(500);
      return { message: "Logout success" };
    }
    return axiosClient.post("/auth/logout");
  },
};
