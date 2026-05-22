import { useState, useRef, useEffect } from "react";

import Suggestion from "../../../AI/components/SuggestionAI/suggestionAI";
import HotSearchBooks from "../../components/HotsearchBooks/HotSearchBooks";
import TopSellingBooks from "../../components/TopsellingBooks/TopSellingBooks";
import ExploreCategories from "../../components/ExploreCategories/ExploreCategories";
import Banner from "../../components/Banner/Banner";
import Pagination from "../../components/Pagination/Pagination";

import { useHomeData } from "../../hooks/useHomeData";
import { useAISuggestion } from "../../../AI/hooks/useAISuggestion";

function Home() {
    /*hooks*/
  const { homeData, loading } = useHomeData();
  const { books: aiSuggestions, loading: aiLoading } = useAISuggestion();

  /* ───────── PAGINATION STATES ───────── */
  const [suggestionPage, setSuggestionPage] = useState(1);
  const [hotPage, setHotPage] = useState(1);
  const [topPage, setTopPage] = useState(1);

  /* ───────── LIMITS ───────── */
  const SUGGESTION_LIMIT = 10;
  const HOT_LIMIT = 10;
  const TOP_LIMIT = 10;

  /* ───────── REFS ───────── */
  const hotSectionRef = useRef<HTMLDivElement | null>(null);
  const topSectionRef = useRef<HTMLDivElement | null>(null);

  /* ───────── SCROLL HOT ───────── */
  useEffect(() => {
    if (hotSectionRef.current) {
      const top =
        hotSectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        120;

      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [hotPage]);

  /* ───────── SCROLL TOP ───────── */
  useEffect(() => {
    if (topSectionRef.current) {
      const top =
        topSectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        30;

      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [topPage]);

  /* ───────── LOADING GUARD ───────── */
  if (loading) {
    return <div>Loading...</div>;
  }

    if (!homeData) {
      return (
        <div className="home-empty">
          Không thể tải dữ liệu trang chủ
        </div>
      );
    }

  /* ───────── SUGGESTION ───────── */
  const suggestionBooks = aiSuggestions || [];

  const suggestionTotalPages = Math.ceil(
    suggestionBooks.length / SUGGESTION_LIMIT
  );

  const suggestionStart =
    (suggestionPage - 1) * SUGGESTION_LIMIT;

  const suggestionCurrent = suggestionBooks.slice(
    suggestionStart,
    suggestionStart + SUGGESTION_LIMIT
  );

  /* ───────── HOT SEARCH ───────── */
  const hotBooks = homeData.hotSearchBooks || [];

  const hotTotalPages = Math.ceil(hotBooks.length / HOT_LIMIT);

  const hotStart = (hotPage - 1) * HOT_LIMIT;

  const hotCurrentBooks = hotBooks.slice(
    hotStart,
    hotStart + HOT_LIMIT
  );

  /* ───────── TOP SELLING ───────── */
  const topBooks = homeData.topSellingBooks || [];

  const topTotalPages = Math.ceil(topBooks.length / TOP_LIMIT);

  const topStart = (topPage - 1) * TOP_LIMIT;

  const topCurrentBooks = topBooks.slice(
    topStart,
    topStart + TOP_LIMIT
  );

  return (
    <div className="home-page">
      <div className="container">

        {/* Banner */}
        <div className="section">
          <Banner />
        </div>

        {/* SUGGESTION */}
        <div className="section">
          <Suggestion books={suggestionCurrent} />

          <Pagination
            currentPage={suggestionPage}
            totalPages={suggestionTotalPages}
            setCurrentPage={setSuggestionPage}
          />
        </div>

        {/* HOT SEARCH */}
        <div ref={hotSectionRef} className="section">
          <HotSearchBooks books={hotCurrentBooks} />

          <Pagination
            currentPage={hotPage}
            totalPages={hotTotalPages}
            setCurrentPage={setHotPage}
          />
        </div>

        {/* TOP SELLING */}
        <div ref={topSectionRef} className="section">
          <TopSellingBooks books={topCurrentBooks} />

          <Pagination
            currentPage={topPage}
            totalPages={topTotalPages}
            setCurrentPage={setTopPage}
          />
        </div>

        {/* CATEGORIES */}
        <div className="section">
          <ExploreCategories categories={homeData.categories} />
        </div>

      </div>
    </div>
  );
}

export default Home;