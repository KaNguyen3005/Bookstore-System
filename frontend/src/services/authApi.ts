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

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // fake token
      const fakeToken = "mock-token-123";
      localStorage.setItem("access_token", fakeToken);

      return mapToFE(user);
    }


    // 1. login lấy token
    const res: any = await axiosClient.post("/auth/token", data);

    const token = res?.token;
    if (!token) {
      throw new Error("Token not found");
    }

    // 2. lưu token
    localStorage.setItem("access_token", token);

    // 3. gọi API lấy user
    const userRes: any = await axiosClient.get("/users/me");

    // 4. map về FE
    return mapToFE(userRes);
  },

  register: async (data: any) => {
    if (IS_MOCK) {
      await delay(500);
      return { message: "Register success" };
    }
    return axiosClient.post("/auth/register", data);
  },

  logout: async () => {
    localStorage.removeItem("access_token");

    if (IS_MOCK) {
      await delay(500);
      return { message: "Logout success" };
    }

    return axiosClient.post("/auth/logout");
  },
};