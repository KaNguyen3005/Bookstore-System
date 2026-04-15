import { useState, useEffect, useCallback, useMemo } from "react";
import type { AdminProduct, ProductFilters, ProductSummary } from "../types/product";
import { productService } from "../services/productService";

export const useProducts = () => {
  const [allProducts, setAllProducts] = useState<AdminProduct[]>([]);
  const [summary, setSummary] = useState<ProductSummary>({ total: 0, inStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ProductFilters>({
    category: "Tất cả thể loại",
    status: "Tất cả trạng thái",
    search: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsRes, summaryRes] = await Promise.all([
        productService.getProducts(),
        productService.getSummary()
      ]);

      if (productsRes.success) setAllProducts(productsRes.data);
      if (summaryRes.success) setSummary(summaryRes.data);
      
      if (!productsRes.success) setError(productsRes.message);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Logic: Filtering and Search (Business logic in Hook)
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // 1. Search Logic
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.id.toString().includes(searchLower)
      );
    }

    // 2. Category Filter
    if (filters.category && filters.category !== "Tất cả thể loại") {
      result = result.filter((p) => p.category === filters.category);
    }

    // 3. Status Filter
    if (filters.status && filters.status !== "Tất cả trạng thái") {
      result = result.filter((p) => p.status === filters.status);
    }

    return result;
  }, [allProducts, filters]);

  const handleFilterChange = (key: keyof ProductFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    
    try {
      const res = await productService.deleteProduct(id);
      if (res.success) {
        setAllProducts((prev) => prev.filter((p) => p.id !== id));
        fetchData();
        alert("Xóa thành công!");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi xóa.");
    }
  };

  const handleUpdateStatus = async (id: number, status: AdminProduct["status"]) => {
    try {
      const res = await productService.updateStatus(id, status);
      if (res.success) {
        setAllProducts((prev) => prev.map(p => p.id === id ? res.data : p));
        fetchData();
      }
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái.");
    }
  };

  return {
    products: filteredProducts,
    summary,
    loading,
    error,
    filters,
    handleFilterChange,
    handleDeleteProduct,
    handleUpdateStatus,
    refreshData: fetchData
  };
};
