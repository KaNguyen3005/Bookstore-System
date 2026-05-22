import axiosClient from "../../../services/axiosClient";
import type { CreateOrderResponse } from "../types";

const IS_MOCK = false;

const checkoutApi = {
  createOrder: async (mappedPayload: any): Promise<CreateOrderResponse> => {
    if (IS_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        orderId: Math.floor(Math.random() * 900_000) + 100_000,
      };
    }

    const response = await axiosClient.post("/orders", mappedPayload);

    const source = response.data.result ?? response.data.data ?? response.data;
    const order = source?.data ?? source;

    return {
      ...order,
      orderId: order.orderId ?? order.id,
    };
  },
};

export default checkoutApi;
