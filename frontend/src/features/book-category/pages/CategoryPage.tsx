import React, { useState, useEffect } from "react";

import FilterSidebar from "../components/FilterSidebar";
import BookGrid from "../components/BookGrid";

import { useBookSearch } from "../hooks/useBookSearch";

import type { BookFilters } from "../types/bookFilter";
import type { Book } from "../../product/types/Book";
import { searchBooks } from "../services/bookService";
import type { Category, Publisher } from "../types/category";

import { categoriesData } from "../../../data/categoriesData";
import { publishersData } from "../../../data/publishersData";
import { priceRangesData } from "../../../data/priceRangesData";

import { getTopSellingBooks } from "../services/bookService";
import { categoryService } from "../services/categoryService";
import { publisherService } from "../services/publisherService";

import "./CategoryPage.css";

/**
 * Main container component for the Category Page.
 */
const CategoryPage: React.FC = () => {
  // ================= FILTER STATE =================
  const [filters, setFilters] = useState<BookFilters>({
    page: 0,
    sort: "asc",

    // 💰 thêm price filter
    minPrice: undefined,
    maxPrice: undefined,
  });

  // ================= TOP SELLING =================
  const [topSellingBooks, setTopSellingBooks] = useState<Book[]>([]);

  // ================= CATEGORY STATE =================
  const [categories, setCategories] = useState<Category[]>(categoriesData);

  // ================= PUBLISHER STATE =================
  const [publishers, setPublishers] = useState<Publisher[]>(publishersData);

  // ================= BOOK SEARCH =================
  const { books, loading, error, total } = useBookSearch(filters);

  // ================= TOP SELLING API =================
  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        const data = await getTopSellingBooks(10);

        setTopSellingBooks(data);
      } catch (error) {
        console.log("Top selling API failed → fallback empty");
      }
    };

    fetchTopSelling();
  }, []);

  // ================= CATEGORY API =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();

        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (error) {
        console.log("Category API failed → fallback mock");
      }
    };

    fetchCategories();
  }, []);

  // ================= PUBLISHER API =================
  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const data = await publisherService.getPublishers();

        if (data && data.length > 0) {
          setPublishers(data);
        }
      } catch (error) {
        console.log("Publisher API failed → fallback mock");
      }
    };

    fetchPublishers();
  }, []);

  // ================= FILTER HANDLER =================
  const handleFilterChange = (newFilters: Partial<BookFilters>) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        ...newFilters,

        // reset page khi đổi filter
        page: 0,
      };

      console.log("UPDATED FILTERS:", updatedFilters);

      return updatedFilters;
    });
  };
  return (
    <div className="category-page">
      {/* ================= HEADER ================= */}
      <div className="category-page__header">
        <h1 className="category-page__title">Danh mục sách</h1>

        <p className="category-page__subtitle">Tìm thấy {total} kết quả</p>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="category-page__content">
        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
          publishers={publishers}
          priceRanges={priceRangesData}
        />

        {/* Books */}
        <main className="category-page__main">
          <BookGrid books={books} loading={loading} error={error} />
        </main>
      </div>

      {/* ================= TOP SELLING ================= */}
      <section className="category-page__top-selling">
        <h2 className="category-page__section-title">TOP SÁCH BÁN CHẠY NHẤT</h2>

        <div className="category-page__top-grid">
          <BookGrid books={topSellingBooks} loading={false} error={null} />
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
