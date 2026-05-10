import { useState, useEffect, useCallback, useMemo } from "react";

import type { Book } from "../../../product/types/Book";

import type { Category } from "../../../book-category/types/category";

import type { ProductFilters, ProductsResponse, ProductSummary } from "../types/product";

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

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ProductFilters>({
    category: "Tất cả thể loại",
    status: "Tất cả trạng thái",
    search: "",
  });

  // ================= FETCH DATA =================
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(0, 10000),
        productService.getCategories(),
      ]);


      setAllProducts(productsData);

      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ================= SUMMARY =================
  useEffect(() => {
    const total = allProducts?.totalElements || 0;

    const inStock = allProducts?.content.filter(
      (book) => book.isActive && book.stockQuantity > 0,
    ).length || 0;

    const outOfStock = allProducts?.content?.filter(
      (book) => !book.isActive || book.stockQuantity <= 0,
    ).length || 0;

    
    setSummary({
      total,
      inStock,
      outOfStock,
    });
    console.log(summary)
  }, [allProducts]);

  // ================= FILTER =================
  const filteredProducts = useMemo(() => {
    let result = [...allProducts?.content || []];

    // SEARCH
    if (filters.search) {
      const keyword = filters.search.toLowerCase();

      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(keyword) ||
          book.bookId.toString().includes(keyword),
      );
    }

    // CATEGORY
    if (filters.category !== "Tất cả thể loại") {
      result = result.filter((book) =>
        book.categories?.some(
          (category) => category.categoryName === filters.category,
        ),
      );
    }

    // STATUS
    if (filters.status !== "Tất cả trạng thái") {
      result = result.filter((book) => {
        // Đang bán
        if (filters.status === "Đang bán") {
          return book.isActive && book.stockQuantity > 0;
        }

        // Hết hàng
        if (filters.status === "Hết hàng") {
          return book.isActive && book.stockQuantity <= 0;
        }

        // Tạm ngưng
        if (filters.status === "Tạm ngưng") {
          return !book.isActive;
        }

        return true;
      });
    }

    return result;
  }, [allProducts, filters]);

  // ================= FILTER CHANGE =================
  const handleFilterChange = (key: keyof ProductFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ================= DELETE =================
const handleDeleteProduct = async (
  bookId: number
) => {
  const confirmDelete =
    window.confirm(
      "Bạn có chắc muốn xóa sản phẩm?"
    );

  if (!confirmDelete) return;

  try {
    await productService.deleteProduct(
      bookId
    );

    setAllProducts((prev) => {
      if (!prev) return prev;

      return {
        ...prev,

        content: prev.content.filter(
          (book) =>
            book.bookId !== bookId
        ),

        totalElements:
          prev.totalElements - 1,
      };
    });

    alert("Xóa thành công");

  } catch (error) {
    alert(
      "Đã xảy ra lỗi khi xóa sản phẩm"
    );
  }
};

// ================= UPDATE STATUS =================
const handleUpdateStatus = async (
  bookId: number,
  isActive: boolean
) => {
  try {
    await productService.updateProduct(
      bookId,
      { isActive }
    );

    setAllProducts((prev) => {
      if (!prev) return prev;

      return {
        ...prev,

        content: prev.content.map(
          (book) =>
            book.bookId === bookId
              ? {
                  ...book,
                  isActive,
                }
              : book
        ),
      };
    });

  } catch (error) {
    alert(
      "Lỗi khi cập nhật trạng thái"
    );
  }
};

  return {
    products: filteredProducts,

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
