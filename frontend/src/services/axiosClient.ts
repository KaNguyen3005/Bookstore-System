import axios from "axios";
import type { AxiosResponse } from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/bookstore/api/v1";

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const clearAuthStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

// ================= REQUEST =================
axiosClient.interceptors.request.use((config) => {
  if ((config as any).skipAuth) {
    return config;
  }

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
      clearAuthStorage();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (!error.config?.skipErrorLog) {
      console.error("API ERROR:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
