import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import { useSearchParams } from "react-router-dom";

import FilterSidebar from "../components/FilterSidebar";
import BookGrid from "../components/BookGrid";
import Pagination from "../../home/components/Pagination/Pagination";

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

  const itemsPerPage = 9;

  // ================= REFS =================

  const topSellingRef =
    useRef<HTMLDivElement | null>(null);

  // ================= FILTER STATE =================

  const [filters, setFilters] =
    useState<BookFilters>({
      page: 0,
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
    }));

    setCurrentPage(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= MAIN BOOK PAGINATION =================

  const totalPages = Math.ceil(
    books.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentBooks = books.slice(
    startIndex,
    startIndex + itemsPerPage
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
            books={currentBooks}
            loading={loading}
            error={error}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={(page) => {

              setCurrentPage(page);

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />

        </main>
      </div>

      {/* ================= TOP SELLING ================= */}

      <div
        ref={topSellingRef}
        className="category-page__top-selling"
      >

        <h2 className="category-page__section-title">
          TOP SÁCH BÁN CHẠY NHẤT
        </h2>

        <div className="category-page__top-grid">

          <BookGrid
            books={currentTopBooks}
            loading={false}
            error={null}
          />

        </div>

        <Pagination
          currentPage={topPage}
          totalPages={topTotalPages}
          setCurrentPage={(page) => {

            setTopPage(page);

            scrollToTopSelling();
          }}
        />

      </div>
    </div>
  );
};

export default CategoryPage;