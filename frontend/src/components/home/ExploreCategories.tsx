import { CATEGORIES } from "../../constants/categories";
import "../../styles/home/ExploreCategories.css";

const ExploreCategories = () => {
  return (
    <div className="explore-categories">
      <h2 className="explore-categories__title">Khám phá các danh mục hàng đầu</h2>
      <div className="explore-categories__columns">
        <ul className="explore-categories__list">
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <a href={cat.href}>{cat.label}</a>
            </li>
          ))}
        </ul>
        <ul className="explore-categories__list">
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <a href={cat.href}>{cat.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExploreCategories;
