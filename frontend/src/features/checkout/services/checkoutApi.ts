import axiosClient from '../../../services/axiosClient';
import type { CreateOrderResponse } from '../types';

const IS_MOCK = true;

const checkoutApi = {
  createOrder: async (mappedPayload: any): Promise<CreateOrderResponse> => {
    if (IS_MOCK) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        orderId: Math.floor(Math.random() * 900_000) + 100_000,
      };
    }

    // axiosClient already unwraps { message, result } from Backend
    const response = await axiosClient.post('/orders', mappedPayload);
    return (response as unknown) as CreateOrderResponse;
  }
};

export default checkoutApi;
