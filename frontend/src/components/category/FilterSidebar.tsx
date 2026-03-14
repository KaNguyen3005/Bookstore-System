import '../../styles/category/CategoryPage.css';

const FilterSidebar = () => {
  return (
    <div className="filter-sidebar">
      <h2 className="filter-sidebar__header">Bộ Lọc</h2>

      {/* Danh mục */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">Danh Mục</h3>
        <div className="filter-sidebar__list">
          {['Tiểu Thuyết', 'Kinh Tế', 'Tâm Lý Học', 'Giáo Dục', 'Thiếu Nhi'].map((cat) => (
            <label key={cat} className="filter-sidebar__item">
              <input type="checkbox" className="filter-sidebar__checkbox" />
              <span className="filter-sidebar__label">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Giá */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">Giá</h3>
        <div className="filter-sidebar__list">
          {['Dưới 50.000đ', '50.000đ - 100.000đ', '100.000đ - 200.000đ', 'Trên 200.000đ'].map((price) => (
            <label key={price} className="filter-sidebar__item">
              <input type="checkbox" className="filter-sidebar__checkbox" />
              <span className="filter-sidebar__label">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Nhà Xuất Bản */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">Nhà Xuất Bản</h3>
        <div className="filter-sidebar__list">
          {['NXB Trẻ', 'NXB Kim Đồng', 'Nhã Nam', 'Alpha Books', 'NXB Tổng Hợp TP.HCM'].map((pub) => (
            <label key={pub} className="filter-sidebar__item">
              <input type="checkbox" className="filter-sidebar__checkbox" />
              <span className="filter-sidebar__label">{pub}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
