import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import { useSearchParams } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar";
import BookGrid from "../components/BookGrid";
import Pagination from "../../home/components/Pagination/pagination";
import TopSellingBooks from "../../home/components/TopsellingBooks/TopSellingBooks";

import { useBookSearch } from "../hooks/useBookSearch";

import type { BookFilters } from "../types/bookFilter";
import type { Book } from "../../product/types/Book";
import type { Category, Publisher } from "../types/category";

import { categoriesData } from "../../../data/categoriesData";
import { publishersData } from "../../../data/publishersData";
import { priceRangesData } from "../../../data/priceRangesData";

import { getTopSellingBooks } from "../services/bookService";
import { categoryService } from "../services/categoryService";
import { publisherService } from "../services/publisherService";

import "./CategoryPage.css";

const CategoryPage: React.FC = () => {

  // ================= URL PARAMS =================

  const [searchParams] = useSearchParams();

  const categoryIdParam =
    searchParams.get("categoryId");

  // ================= PAGINATION =================

  // Main books
  const [currentPage, setCurrentPage] =
    useState(1);

  // Top selling books
  const [topPage, setTopPage] =
    useState(1);

  const itemsPerPage = 20;

  // ================= REFS =================

  const topSellingRef =
    useRef<HTMLDivElement | null>(null);

  // ================= FILTER STATE =================

  const [filters, setFilters] =
    useState<BookFilters>({
      page: 0,
      size: itemsPerPage,
      sort: "asc",

      categoryId: categoryIdParam
        ? Number(categoryIdParam)
        : undefined,

      minPrice: undefined,
      maxPrice: undefined,
    });

  // ================= TOP SELLING =================

  const [topSellingBooks, setTopSellingBooks] =
    useState<Book[]>([]);

  // ================= CATEGORY STATE =================

  const [categories, setCategories] =
    useState<Category[]>(categoriesData);

  // ================= PUBLISHER STATE =================

  const [publishers, setPublishers] =
    useState<Publisher[]>(publishersData);

  // ================= BOOK SEARCH =================

  const {
    books,
    loading,
    error,
    total,
  } = useBookSearch(filters);

  // ================= SCROLL FUNCTION =================

  const scrollToTopSelling = () => {

    if (topSellingRef.current) {

      const top =
        topSellingRef.current
          .getBoundingClientRect().top +
        window.scrollY -
        50;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  // ================= SYNC URL → FILTER =================

  useEffect(() => {

    if (categoryIdParam) {

      setFilters((prev) => ({
        ...prev,
        categoryId: Number(categoryIdParam),
        page: 0,
        size: itemsPerPage,
      }));

      setCurrentPage(1);
    }

  }, [categoryIdParam]);

  // ================= TOP SELLING API =================

  useEffect(() => {

    const fetchTopSelling = async () => {

      try {

        const data =
          await getTopSellingBooks(20);

        setTopSellingBooks(data);

      } catch (error) {

        console.log(
          "Top selling API failed → fallback empty"
        );
      }
    };

    fetchTopSelling();

  }, []);

  // ================= CATEGORY API =================

  useEffect(() => {

    const fetchCategories = async () => {

      try {

        const data =
          await categoryService.getCategories();

        if (data && data.length > 0) {
          setCategories(data);
        }

      } catch (error) {

        console.log(
          "Category API failed → fallback mock"
        );
      }
    };

    fetchCategories();

  }, []);

  // ================= PUBLISHER API =================

  useEffect(() => {

    const fetchPublishers = async () => {

      try {

        const data =
          await publisherService.getPublishers();

        if (data && data.length > 0) {
          setPublishers(data);
        }

      } catch (error) {

        console.log(
          "Publisher API failed → fallback mock"
        );
      }
    };

    fetchPublishers();

  }, []);

  // ================= FILTER HANDLER =================

  const handleFilterChange = (
    newFilters: Partial<BookFilters>
  ) => {

    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
      page: 0,
      size: itemsPerPage,
    }));

    setCurrentPage(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleMainPageChange: React.Dispatch<
    React.SetStateAction<number>
  > = (value) => {
    const nextPage =
      typeof value === "function"
        ? value(currentPage)
        : value;

    setCurrentPage(nextPage);
    setFilters((prev) => ({
      ...prev,
      page: nextPage - 1,
      size: itemsPerPage,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= MAIN BOOK PAGINATION =================

  const totalPages = Math.ceil(
    total / itemsPerPage
  );

  // ================= TOP SELLING PAGINATION =================

  const topTotalPages = Math.ceil(
    topSellingBooks.length /
      itemsPerPage
  );

  const topStartIndex =
    (topPage - 1) * itemsPerPage;

  const currentTopBooks =
    topSellingBooks.slice(
      topStartIndex,
      topStartIndex + itemsPerPage
    );

  return (
    <div className="category-page">

      {/* ================= HEADER ================= */}

      <div className="category-page__header">

        <h1 className="category-page__title">
          Danh mục sách
        </h1>

        <p className="category-page__subtitle">
          Tìm thấy {total} kết quả
        </p>

      </div>

      {/* ================= CONTENT ================= */}

      <div className="category-page__content">

        {/* Sidebar */}

        <FilterSidebar
          filters={filters}
          onFilterChange={
            handleFilterChange
          }
          categories={categories}
          publishers={publishers}
          priceRanges={priceRangesData}
        />

        {/* Books */}

        <main className="category-page__main">

          <BookGrid
            books={books}
            loading={loading}
            error={error}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={handleMainPageChange}
          />

        </main>
      </div>

      {/* ================= TOP SELLING ================= */}


      <TopSellingBooks
        books={currentTopBooks}
        currentPage={topPage}
        totalPages={topTotalPages}
        onPageChange={setTopPage}
        scrollToTop={scrollToTopSelling}
      />

    </div>
  );
};

export default CategoryPage;
