import axiosClient from "./axiosClient";
import users from "../data/user1";
import { type UserFE } from "./userApi";

const IS_MOCK = false;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const clean = (v: any) =>
  typeof v === "string" ? v.trim() : v;

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

export const authApi = {
  login: async (data: any) => {
    try {
      //  MOCK
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

        if (!user) throw new Error("Invalid credentials");

        const token = "mock-token-123";
        localStorage.setItem("access_token", token);

        return {
          ...mapToFE(user),
          token,
        };
      }

      //  API
      const res: any = await axiosClient.post("/auth/login", {
        username: clean(data.account),
        password: clean(data.password),
      });

      const response = res?.data?.result ?? res?.data;

      console.log("LOGIN RESPONSE:", response);

      const token = response?.token;

      if (!token) {
        throw new Error("Token not found");
      }

      localStorage.setItem("access_token", token);

      const userRes: any = await axiosClient.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = userRes?.data?.result ?? userRes?.data;

      return {
        ...mapToFE(userData),
        token,
      };
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      throw new Error(
        error?.response?.data?.message || "Login failed"
      );
    }
  },

  registerInit: async (data: any) => {
    if (IS_MOCK) {
      await delay(500);
      return { message: "Register success" };
    }

    return axiosClient.post("/auth/register/init", {
      username: clean(data.username),
      email: clean(data.email),
      phone: clean(data.phone),
      password: data.password,
      name: data.name,
      gender: data.gender,
      dob: data.dob,
      otp: data.otp,
    });
  },

registerComplete: async (data: any) => {
  try {
    const res = await axiosClient.post("/auth/register/complete", {
      username: clean(data.username),
      email: clean(data.email),
      phone: clean(data.phone),
    });

    return res?.data ?? res;
  } catch (error: any) {
    console.error("REGISTER COMPLETE ERROR:", error);
    throw new Error(
      error?.response?.data?.message || "Register complete failed"
    );
  }
},

  logout: async () => {
    localStorage.removeItem("access_token");

    if (IS_MOCK) {
      await delay(300);
      return { message: "Logout success" };
    }

    return axiosClient.post("/auth/logout");
  },

  //  OTP VERIFY (ADDED)
  verifyOtp: async (data: { email: string; otp: string }) => {
    try {
      const res: any = await axiosClient.post("/otp/verify", {
        email: clean(data.email),
        otp: clean(data.otp),
      });

      return res?.data ?? res;
    } catch (error: any) {
      console.error("OTP ERROR:", error);
      throw new Error(
        error?.response?.data?.message || "OTP verification failed"
      );
    }
  },

    sendOtp: async (email: string) => {
      return axiosClient.post("/otp/send", {
        email: email?.trim(),
      });
    },

};