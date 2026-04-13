import { useState, useEffect, useCallback } from "react";
import type { AdminProduct, ProductFilters, ProductSummary } from "../types/product.type";
import { productService } from "../services/productService";

export const useProductManagement = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [summary, setSummary] = useState<ProductSummary>({ total: 0, inStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ProductFilters>({
    category: "Tất cả thể loại",
    status: "Tất cả trạng thái",
    search: "",
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productService.getProducts(filters);
      if (res.success) {
        setProducts(res.data);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await productService.getSummary();
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải thống kê:", err);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (key: keyof ProductFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    
    try {
      const res = await productService.deleteProduct(id);
      if (res.success) {
        // Cập nhật lại UI sau khi xóa thành công
        setProducts((prev) => prev.filter((p) => p.id !== id));
        fetchSummary(); // Update tổng số
        alert("Xóa thành công!");
      } else {
        alert("Xóa thất bại: " + res.message);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi xóa.");
    }
  };

  return {
    products,
    summary,
    loading,
    error,
    filters,
    handleFilterChange,
    handleDeleteProduct,
    refreshData: () => {
      fetchProducts();
      fetchSummary();
    }
  };
};
