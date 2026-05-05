import { CATEGORIES } from "../../../../data/categories";
import "./ExploreCategories.css";

const ExploreCategories = () => {
  return (
    <div className="container">
      <div className="explore-categories">
        <h2 className="explore-categories__title">
          Khám phá các danh mục hàng đầu
        </h2>
        <div className="explore-categories__grid">
          {CATEGORIES.map((cat, idx) => (
            <a key={cat.id} href={cat.href} className="explore-categories__item">
              <span className="explore-categories__item-icon">
                {idx === 0
                  ? "💖"
                  : idx === 1
                    ? "🎈"
                    : idx === 2
                      ? "🕵️"
                      : idx === 3
                        ? "🚀"
                        : "📖"}
              </span>
              <span className="explore-categories__item-label">
                {cat.label}
              </span>
              <span className="explore-categories__item-arrow">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreCategories;