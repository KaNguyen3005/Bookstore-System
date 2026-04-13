import axiosClient from "./axiosClient";
import users from "../data/user1";
import { type UserFE } from "./userApi";

const IS_MOCK = true;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ================= CLEAN INPUT =================
const clean = (value: any) => value?.toString().trim();

// ================= MAP USER =================
const mapToFE = (u: any): UserFE => ({
  id: u.user_id,
  user_id: u.user_id,
  username: clean(u.username),
  fullname: `${clean(u.first_name)} ${clean(u.last_name)}`.trim(),
  firstname: clean(u.first_name),
  lastname: clean(u.last_name),
  email: clean(u.email),
  phone: clean(u.phone),
  birth: u.birth,
  point: u.point,
  status: u.status,
  gender: u.gender,
  role_id: u.role_id,
});

// ================= API =================
export const authApi = {
  login: async (data: any): Promise<UserFE> => {
    try {
      // ================= MOCK =================
      if (IS_MOCK) {
        await delay(500);

        const account = clean(data.account);
        const password = clean(data.password);

        const user = users.find(
          (u) =>
            (u.email === account ||
              u.phone === account ||
              u.username === account) &&
            u.password === password
        );

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const fakeToken = "mock-token-123";
        localStorage.setItem("access_token", fakeToken);

        return mapToFE(user);
      }

      // ================= LOGIN API =================
      const res: any = await axiosClient.post("/auth/token", {
        username: clean(data.account),
        password: clean(data.password),
      });

      console.log("LOGIN RESPONSE:", res);

      // ================= EXTRACT TOKEN =================
      const token =
        res?.data?.result?.token ||
        res?.result?.token ||
        res?.accessToken ||
        res?.data?.token ||
        res?.data?.accessToken;

      if (!token) {
        throw new Error("Token not found in response");
      }

      localStorage.setItem("access_token", token);

      // ================= GET USER =================
      const userRes: any = await axiosClient.post("/users/me");

      console.log("USER RESPONSE:", userRes);

      return mapToFE(userRes);
    } catch (error: any) {
      console.error("LOGIN ERROR:", error?.response || error);

      throw new Error(
        error?.response?.data?.message || "Login failed"
      );
    }
  },

  register: async (data: any) => {
    if (IS_MOCK) {
      await delay(500);
      return { message: "Register success" };
    }

    return axiosClient.post("/auth/register", {
      ...data,
      username: clean(data.username),
      email: clean(data.email),
      phone: clean(data.phone),
    });
  },

  logout: async () => {
    localStorage.removeItem("access_token");

    if (IS_MOCK) {
      await delay(300);
      return { message: "Logout success" };
    }

    return axiosClient.post("/auth/logout");
  },
};