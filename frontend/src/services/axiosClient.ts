import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST =================
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: any) => Promise.reject(error)
);

// ================= RESPONSE =================
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // unwrap result
    if (response.data?.result !== undefined) {
      return response.data.result;
    }
    return response.data;
  },
  (error: any) => {

    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");

      // tránh loop nếu đang ở login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // log lỗi
    if (error.response?.data?.message) {
      console.error("API Error:", error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;