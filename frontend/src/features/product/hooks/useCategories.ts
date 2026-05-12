import { useEffect, useState } from "react";

import { categoryService } from "../../book-category/services/categoryService";

import type { Category } from "../../book-category/types/category";

export const useCategories = () => {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const fetchCategories =
      async () => {
        setLoading(true);

        try {
          const data =
            await categoryService.getCategories();

          setCategories(data || []);
        } catch (error) {
          console.log(
            "Fetch categories failed",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
  };
};