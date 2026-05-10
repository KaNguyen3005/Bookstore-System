import { useState, useRef, useEffect } from "react";

import HeroBanner from "../../components/HeroBanner/HeroBanner";
import HotSearchBooks from "../../components/HotsearchBooks/HotSearchBooks";
import TopSellingBooks from "../../components/TopsellingBooks/TopSellingBooks";
import ExploreCategories from "../../components/ExploreCategories/ExploreCategories";
import Banner from "../../components/Banner/Banner";
import Pagination from "../../components/Pagination/Pagination";

import { useHomeData } from "../../hooks/useHomeData";

function Home() {
  const { homeData, loading } = useHomeData();



  // pagination riêng
  const [hotPage, setHotPage] = useState(1);
  const [topPage, setTopPage] = useState(1);

  // ref section
  const hotSectionRef =
    useRef<HTMLDivElement | null>(null);

  const topSectionRef =
    useRef<HTMLDivElement | null>(null);

  // scroll hot section
  useEffect(() => {
    if (hotSectionRef.current) {

      const top =
        hotSectionRef.current
          .getBoundingClientRect().top +
        window.scrollY -
        120;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  }, [hotPage]);

  // scroll top section
  useEffect(() => {
    if (topSectionRef.current) {

      const top =
        topSectionRef.current
          .getBoundingClientRect().top +
        window.scrollY -
        30;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  }, [topPage]);

  // item / page
  const itemsPerPage = 10;

  // phải đặt sau hooks
  if (loading || !homeData) return null;

  /* ───────── HOT SEARCH ───────── */

  const hotBooks = homeData.hotSearchBooks;

  const hotTotalPages = Math.ceil(
    hotBooks.length / itemsPerPage
  );

  const hotStart =
    (hotPage - 1) * itemsPerPage;

  const hotCurrentBooks = hotBooks.slice(
    hotStart,
    hotStart + itemsPerPage
  );

  /* ───────── TOP SELLING ───────── */

  const topBooks = homeData.topSellingBooks;

  const topTotalPages = Math.ceil(
    topBooks.length / itemsPerPage
  );

  const topStart =
    (topPage - 1) * itemsPerPage;

  const topCurrentBooks = topBooks.slice(
    topStart,
    topStart + itemsPerPage
  );

  return (
    <div className="home-page">
      <div className="container">

        {/* Banner */}
        <div className="section">
          <Banner />
        </div>

        {/* Hot Search Books */}
        <div
          ref={hotSectionRef}
          className="section"
        >
          <HotSearchBooks books={hotCurrentBooks} />

          <Pagination
            currentPage={hotPage}
            totalPages={hotTotalPages}
            setCurrentPage={setHotPage}
          />
        </div>

        {/* Top Selling Books */}
        <div
          ref={topSectionRef}
          className="section"
        >
          <TopSellingBooks books={topCurrentBooks} />

          <Pagination
            currentPage={topPage}
            totalPages={topTotalPages}
            setCurrentPage={setTopPage}
          />
        </div>

        {/* Categories */}
        <div className="section">
          <ExploreCategories
            categories={homeData.categories}
          />
        </div>

      </div>
    </div>
  );
}

export default Home;