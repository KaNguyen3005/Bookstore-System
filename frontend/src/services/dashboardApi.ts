import axiosClient from "./axiosClient";

// ================= GET DASHBOARD =================
export const getDashboard = async () => {
  const res = await axiosClient.get("/dashboard");
  return res.data;
};

// ================= GET ORDER STATUS =================
export const getOrderStatus = async () => {
  const res = await axiosClient.get("/dashboard/order-status");
  return res.data;
};