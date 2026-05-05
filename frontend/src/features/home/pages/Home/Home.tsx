import HeroBanner from "../../components/HeroBanner/HeroBanner";
import HotSearchBooks from "../../components/HotsearchBooks/HotSearchBooks";
import TopSellingBooks from "../../components/TopsellingBooks/TopSellingBooks";
import ExploreCategories from "../../components/ExploreCategories/ExploreCategories";
import Banner from "../../components/Banner/Banner";
import { useHomeData } from "../../hooks/useHomeData";

function Home() {
  const { homeData, loading } = useHomeData();

  if (loading || !homeData) return null;

  return (
    <div className="home-page">
      <div className="container">

        <div className="section">
          <Banner />
        </div>

        <div className="section">
          <HotSearchBooks books={homeData.hotSearchBooks} />
        </div>

        <div className="section">
          <TopSellingBooks books={homeData.topSellingBooks} />
        </div>

        <div className="section">
          <ExploreCategories />
        </div>

      </div>
    </div>
  );
}

export default Home;