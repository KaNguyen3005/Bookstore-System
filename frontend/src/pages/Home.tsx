import HeroBanner from "../components/home/HeroBanner";
import HotSearchBooks from "../components/home/HotSearchBooks";
import TopSellingBooks from "../components/home/TopSellingBooks";
import ExploreCategories from "../components/home/ExploreCategories";
import { HOT_SEARCH_BOOKS, TOP_SELLING_BOOKS } from "../Data/homeBooks";
import "../styles/home/Home.css";

function Home() {
  return (
    <div className="home-page">
      <div className="section">
        <HeroBanner books={TOP_SELLING_BOOKS} />
      </div>
      <div className="section">
        <HotSearchBooks books={HOT_SEARCH_BOOKS} />
      </div>
      <div className="section">
        <TopSellingBooks books={TOP_SELLING_BOOKS} />
      </div>
      <div className="section">
        <ExploreCategories />
      </div>
    </div>
  );
}

export default Home;