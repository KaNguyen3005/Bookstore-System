import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import type { Category, Publisher, PriceRange } from '../types/category';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiltersData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [catsRaw, pubsRaw, pricesRaw] = await Promise.all([
          categoryService.getCategories(),
          categoryService.getPublishers(),
          categoryService.getPriceRanges(),
        ]);

        // Transform snake_case to camelCase
        setCategories(catsRaw.map((cat: any) => ({
          categoryId: cat.category_id,
          name: cat.name,
          parentId: cat.parent_id,
        })));

        setPublishers(pubsRaw.map((pub: any) => ({
          publisherId: pub.publisher_id,
          publisherName: pub.publisher_name,
        })));

        setPriceRanges(pricesRaw.map((price: any) => ({
          id: price.id,
          label: price.label,
          minPrice: price.min_price,
          maxPrice: price.max_price,
        })));

      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải dữ liệu lọc');
      } finally {
        setLoading(false);
      }
    };

    fetchFiltersData();
  }, []);

  return { categories, publishers, priceRanges, loading, error };
};
