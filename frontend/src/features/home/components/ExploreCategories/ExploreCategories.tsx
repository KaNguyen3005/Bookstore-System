import { Link } from "react-router-dom";

import type { Category } from "../../../book-category/types/category";

import "./ExploreCategories.css";

interface ExploreCategoriesProps {
  categories?: Category[];
}

const ExploreCategories = ({
  categories = [],
}: ExploreCategoriesProps) => {
  return (
    <div className="container">
      <div className="explore-categories">
        <h2 className="explore-categories__title">
          Khám phá các danh mục hàng đầu
        </h2>

        <div className="explore-categories__grid">
          {categories.slice(0, 5).map((cat, idx) => (
            <Link
              key={cat.categoryId}
              to={`/category?categoryId=${cat.categoryId}`}
              className="explore-categories__item"
            >
              <span className="explore-categories__item-icon">
                {idx === 0
                  ? "💖"
                  : idx === 1
                  ? "🎈"
                  : idx === 2
                  ? "🕵️"
                  : "📖"}
              </span>

              <span className="explore-categories__item-label">
                {cat.categoryName}
              </span>

              <span className="explore-categories__item-arrow">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreCategories;