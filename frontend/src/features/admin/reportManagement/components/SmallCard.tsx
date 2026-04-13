type SmallCardProps = {
  title: string;
  value: number;
};

const SmallCard = ({ title, value }: SmallCardProps) => (
  <div className="card">
    <h4>{title}</h4>
    <p className="value">{value}</p>
    <button className="button-card">Xem chi tiết</button>
  </div>
);

export default SmallCard;