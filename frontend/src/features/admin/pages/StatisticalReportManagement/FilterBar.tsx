type FilterBarProps = {
  filters: string[];
  active: string;
  fromDate: string;
  toDate: string;
  onQuickFilter: (type: string) => void;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onFilter: () => void;
  onExport?: () => void;
};

const FilterBar = ({
  filters,
  active,
  fromDate,
  toDate,
  onQuickFilter,
  onFromDateChange,
  onToDateChange,
  onFilter,
  onExport,
}: FilterBarProps) => (
  <div className="filter-wrapper">
    <div className="filter-date">
      {filters.map((item) => (
        <button
          key={item}
          className={`button-card filter-btn ${active === item ? "active" : ""}`}
          onClick={() => onQuickFilter(item)}
        >
          {item}
        </button>
      ))}
    </div>

    <div className="date-range">
      <input
        type="date"
        value={fromDate}
        onChange={(e) => onFromDateChange(e.target.value)}
      />

      <span>→</span>

      <input
        type="date"
        value={toDate}
        onChange={(e) => onToDateChange(e.target.value)}
      />

      <button className="button-card" onClick={onFilter}>
        Lọc
      </button>
    </div>

    <div className="filter-header">
      {onExport && (
        <button className="button-card" onClick={onExport}>
          Xuất Excel
        </button>
      )}
    </div>
  </div>
);

export default FilterBar;