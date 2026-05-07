import axiosClient from "./axiosClient";
import users from "../data/user1";
import { type UserFE } from "./userApi";

const IS_MOCK = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ================= CLEAN INPUT =================
const clean = (value: any) => value?.toString().trim();

// ================= MAP USER =================
const mapToFE = (u: any): UserFE => ({
  id: u.userId,
  userId: u.userId,
  username: clean(u.username),
  name: u.name,
  email: clean(u.email),
  phone: clean(u.phone),
  dob: u.dob,
  point: u.point,
  status: u.status,
  gender: u.gender,
  role: u.role,
  avatarUrl: u.avatarUrl,
  address: u.address,
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
            u.password === password,
        );

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const fakeToken = "mock-token-123";
        localStorage.setItem("access_token", fakeToken);

        return mapToFE(user);
      }

      // ================= LOGIN =================
      const res: any = await axiosClient.post("/auth/login", {
        username: clean(data.account),
        password: clean(data.password),
      });

      console.log("LOGIN RESPONSE:", res);

      // ================= TOKEN =================
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

      // ================= GET ME =================
      const userRes: any = await axiosClient.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("USER RESPONSE:", userRes);

      const userData = userRes?.data?.result || userRes?.data || userRes;

      return mapToFE(userData);
    } catch (error: any) {
      console.error("LOGIN ERROR:", error?.response || error);

      throw new Error(error?.response?.data?.message || "Login failed");
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
