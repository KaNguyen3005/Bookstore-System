import { useEffect, useState } from "react";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import HotSearchBooks from "../../components/HotsearchBooks/HotSearchBooks";
import TopSellingBooks from "../../components/TopsellingBooks/TopSellingBooks";
import ExploreCategories from "../../components/ExploreCategories/ExploreCategories";
import { bookApi } from "../../../../services/bookApi";

function Home() {
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      const data = await bookApi.getHomeData();
      setHomeData(data);
    };
    fetchHomeData();
  }, []);

  if (!homeData) return null;

  return (
    <div className="home-page">
      <div className="container">

        <div className="section">
          <HeroBanner books={homeData.topSellingBooks} />
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