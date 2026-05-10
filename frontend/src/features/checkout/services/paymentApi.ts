import axiosClient from "../../../services/axiosClient";

export interface CheckoutPaymentRequest {
  orderId: number;
  paymentMethod: "COD" | "VNPAY";
}

export interface CheckoutPaymentResponse {
  code: number;
  message: string;
  result: {
    paymentId: number;
    paymentMethod: string;
    redirectUrl: string | null;
    message: string;
  };
}

export const paymentApi = {
  checkout: async (
    data: CheckoutPaymentRequest,
  ): Promise<CheckoutPaymentResponse> => {
    const accessToken = localStorage.getItem("accessToken")
    const response = await axiosClient.post("/payments/checkout", data,{headers: {Authorization: `Bearer ${accessToken}`}});
    console.log("response data",response.data);
    return response.data;
  },

  getStatus: async (paymentId: number) => {
    const response = await axiosClient.get(`/payments/${paymentId}/status`);

    return response.data;
  },
};
