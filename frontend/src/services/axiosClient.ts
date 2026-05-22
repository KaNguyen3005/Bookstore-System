import axios from "axios";
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/bookstore/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_WHITELIST = ["/auth/token", "/auth/register"];

const getAuthToken = () => {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken")
  );
};

const formatBearerToken = (token: string) => {
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
};

// ================= REQUEST =================
axiosClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = formatBearerToken(token);
  }

  return config;
});

// ================= RESPONSE =================
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const skipAuthRedirect = Boolean(error.config?.skipAuthRedirect);

    if (error.response?.status === 401 && !skipAuthRedirect) {
      localStorage.removeItem("access_token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    console.error("API ERROR:", error.response?.data || error.message);

    return Promise.reject(error);
  }
);

export default axiosClient;
