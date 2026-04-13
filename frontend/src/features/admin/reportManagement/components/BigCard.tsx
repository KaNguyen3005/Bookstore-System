type BigCardProps = {
  title: string;
  count: string;
  value: string;
  trend: string;
  trendType: "up" | "down";
};

const BigCard = ({ title, count, value, trend, trendType }: BigCardProps) => (
  <div className="card">
    <div className="card-header">
      <span>{title}</span>
      <span>{count}</span>
    </div>
    <p className="value">{value}</p>
    <p className={`trend ${trendType}`}>
      {trendType === "up" ? "↑" : "↓"} {trend}
    </p>
  </div>
);

export default BigCard;