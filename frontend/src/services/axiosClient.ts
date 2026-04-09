import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/bookstore/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: add auth token if exists
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response Interceptor: unwrap "result" field
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data && response.data.result !== undefined) {
      return response.data.result;
    }
    return response.data;
  },
  (error: any) => {
    // Handle global errors here if needed
    if (error.response?.data?.message) {
      console.error("API Error:", error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
