import axiosClient from "../../../services/axiosClient";

const paymentApi = {
  checkout: async (payload: { orderId: number; paymentMethod: "VNPAY" }) => {
    const res = await axiosClient.post("/payments/checkout", payload);
    return res.data;
  },

  getStatus: async (paymentId: number) => {
    const res = await axiosClient.get(`/payments/${paymentId}/status`);
    return res.data;
  },
};

export default paymentApi;
