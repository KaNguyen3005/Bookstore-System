import HeroBanner from "../../components/HeroBanner/HeroBanner";
import HotSearchBooks from "../../components/HotSearchBooks/HotSearchBooks";
import TopSellingBooks from "../../components/TopSellingBooks/TopSellingBooks";
import ExploreCategories from "../../components/ExploreCategories/ExploreCategories";
import { HOT_SEARCH_BOOKS, TOP_SELLING_BOOKS } from "../../../../Data/homeBooks";

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