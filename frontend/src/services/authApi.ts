import axiosClient from "./axiosClient";
import users from "../data/user1";
import { type UserFE } from "./userApi";

const IS_MOCK = false;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const clean = (v: any) =>
  typeof v === "string" ? v.trim() : v;

const isInactiveAccount = (status: any) => status === false;

const normalizeErrorMessage = (value?: string) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const isInactiveAccountMessage = (value?: string) => {
  const message = normalizeErrorMessage(value);

  return [
    "inactive",
    "disabled",
    "disable",
    "locked",
    "blocked",
    "ngung hoat dong",
    "vo hieu hoa",
    "khoa",
  ].some((keyword) => message.includes(keyword));
};

const getAuthErrorMessage = (error: any, fallback: string) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;

  return isInactiveAccountMessage(message)
    ? "Tài khoản này đã ngừng hoạt động"
    : message;
};

// ================= USER MAP =================
const mapToFE = (u: any = {}): UserFE => ({
  id: u?.userId,
  userId: u?.userId,
  username: clean(u?.username),
  name: u?.name,
  email: clean(u?.email),
  phone: clean(u?.phone),
  dob: u?.dob,
  point: u?.point,
  status: u?.status,
  gender: u?.gender,
  role: u?.role,
  avatarUrl: u?.avatarUrl,
  address: u?.address,
});

// ================= AUTH API =================
export const authApi = {

  login: async (data: any) => {
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

        if (!user) throw new Error("Invalid credentials");

        const token = "mock-token-123";

        const fullUser = mapToFE(user);

        const result = {
          ...fullUser,
          token,
          authenticated: true,
        };

        localStorage.setItem("access_token", token);
        localStorage.setItem("user", JSON.stringify(result));

        return result;
      }

      // ================= API =================
      const res = await axiosClient.post("/auth/login", {
        username: clean(data.account),
        password: clean(data.password),
      });

      const response = res?.data ?? res;
      const authData = response?.result ?? response;

      console.log("LOGIN RESPONSE:", response);

      const token = authData?.token;

      if (!token) {
        throw new Error(response?.message || "Token not found");
      }

      localStorage.setItem("access_token", token);

      return authData;

    } catch (error: any) {
      console.error("LOGIN ERROR:", error);

      throw new Error(getAuthErrorMessage(error, "Login failed"));
    }
  },

  // ================= REGISTER INIT =================
  registerInit: async (data: any) => {
    try {
      if (IS_MOCK) {
        await delay(500);
        return { message: "Register success" };
      }

      const res = await axiosClient.post("/auth/register/init", {
        username: clean(data.username),
        email: clean(data.email),
        phone: clean(data.phone),
        password: data.password,
        name: data.name,
        gender: data.gender,
        dob: data.dob,

      });

      return res?.data ?? res;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Register init failed"
      );
    }
  },

  // ================= REGISTER COMPLETE =================
  registerComplete: async (data: any) => {
    try {
      const res = await axiosClient.post(
        "/auth/register/complete",
        {
          username: clean(data.username),
          email: clean(data.email),
          phone: clean(data.phone),
          password: data.password,
          name: data.name,
          gender: data.gender,
          dob: data.dob,
          otp: clean(data.otp),
        }
      );

      return res?.data ?? res;

    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ||
        "Register complete failed"
      );
    }
  },

  // ================= LOGOUT =================
  logout: async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    if (IS_MOCK) {
      await delay(300);
      return { message: "Logout success" };
    }

    return axiosClient.post("/auth/logout");
  },

  // ================= OTP =================
  verifyOtp: async (data: { email: string; otp: string }) => {
    try {
      const res = await axiosClient.post("/otp/verify", {
        email: clean(data.email),
        otp: clean(data.otp),
      });

      return res?.data ?? res;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "OTP verification failed"
      );
    }
  },

  sendOtp: async (email: string) => {
    try {
      const res = await axiosClient.post("/otp/send", {
        email: clean(email),
      });

      return res?.data ?? res;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Send OTP failed"
      );
    }
  },
// ================= GOOGLE LOGIN =================
googleLogin: async (idToken: string) => {
  try {
    const res = await axiosClient.post("/auth/google", {
      idToken,
    });

    const response = res?.data ?? res;
    const authData = response?.result ?? response;

    console.log("GOOGLE LOGIN RESPONSE:", response);

    const token = authData?.token;

    if (!token) {
      throw new Error(response?.message || "Google login failed");
    }

    // SAVE TOKEN
    localStorage.setItem("access_token", token);

    return authData;

  } catch (error: any) {
    console.error("GOOGLE LOGIN ERROR:", error);

    throw new Error(getAuthErrorMessage(error, "Google login failed"));
  }
},
};

