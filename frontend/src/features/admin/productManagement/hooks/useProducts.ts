import { useState, useEffect, useCallback } from "react";

import type { Category } from "../../../book-category/types/category";
import type {
  ProductFilters,
  ProductsResponse,
  ProductSummary,
} from "../types/product";

import { productService } from "../services/productService";

export const useProducts = () => {
  // ================= STATES =================
  const [allProducts, setAllProducts] = useState<ProductsResponse>();
  const [categories, setCategories] = useState<Category[]>([]);

  const [summary, setSummary] = useState<ProductSummary>({
    total: 0,
    inStock: 0,
    outOfStock: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ================= FILTERS =================
  const [filters, setFilters] = useState<ProductFilters>({
    category: "all",
    status: "Tất cả trạng thái",
    search: "",
  });

  // ================= FETCH DATA =================
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await productService.getProducts({
        page: 0,
        size: 10000,
        keyword: filters.search || undefined,
        categoryId:
          filters.category !== "all" ? Number(filters.category) : undefined,
      });

      setAllProducts(data);

      // categories chỉ load 1 lần (tối ưu)
      if (categories.length === 0) {
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData);
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.category]);

  // ================= AUTO FETCH =================
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ================= SUMMARY =================
  useEffect(() => {
    const content = allProducts?.content ?? [];

    const total = allProducts?.totalElements || 0;

    const inStock = content.filter(
      (book) => book.isActive && book.stockQuantity > 0,
    ).length;

    const outOfStock = content.filter(
      (book) => !book.isActive || book.stockQuantity <= 0,
    ).length;

    setSummary({
      total,
      inStock,
      outOfStock,
    });
  }, [allProducts]);

  // ================= FILTER CHANGE =================
  const handleFilterChange = (key: keyof ProductFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ================= DELETE =================
  const handleDeleteProduct = async (bookId: number) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa sản phẩm?");
    if (!confirmDelete) return;

    try {
      await productService.deleteProduct(bookId);

      setAllProducts((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          content: prev.content.filter((book) => book.bookId !== bookId),
          totalElements: prev.totalElements - 1,
        };
      });

      alert("Xóa thành công");
    } catch {
      alert("Đã xảy ra lỗi khi xóa sản phẩm");
    }
  };

  // ================= UPDATE STATUS =================
  const handleUpdateStatus = async (bookId: number, isActive: boolean) => {
    try {
      await productService.updateProduct(bookId, { isActive });

      setAllProducts((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          content: prev.content.map((book) =>
            book.bookId === bookId ? { ...book, isActive } : book,
          ),
        };
      });
    } catch {
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  // ================= RETURN =================
  return {
    products: allProducts?.content ?? [],
    categories,
    summary,
    loading,
    error,
    filters,
    handleFilterChange,
    handleDeleteProduct,
    handleUpdateStatus,
    refreshData: fetchProducts,
  };
};
