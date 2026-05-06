import axiosClient from '../../../services/axiosClient';
import { MOCK_CATEGORIES, MOCK_PUBLISHERS, MOCK_PRICE_RANGES } from '../../../data/categoryData';

const IS_MOCK = true;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const categoryService = {
  getCategories: async () => {
    if (IS_MOCK) {
      await delay(500);
      return MOCK_CATEGORIES;
    }
    const res: any = await axiosClient.get('/api/categories');
    return res?.data?.result || res?.data || [];
  },

  getPublishers: async () => {
    if (IS_MOCK) {
      await delay(500);
      return MOCK_PUBLISHERS;
    }
    const res: any = await axiosClient.get('/api/publishers');
    return res?.data?.result || res?.data || [];
  },

  getPriceRanges: async () => {
    if (IS_MOCK) {
      await delay(500);
      return MOCK_PRICE_RANGES;
    }
    const res: any = await axiosClient.get('/api/prices');
    return res?.data?.result || res?.data || [];
  }
};
