import React from "react";
import type { LucideIcon } from "lucide-react";
import "./StatsCard.css";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  bgColor?: string;
  textColor?: string;
  iconBg?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
  isPositive = true,
  bgColor = "white",
  textColor = "#222",
  iconBg = "#f3f4f6",
}) => {
  return (
    <div
      className="stats-card"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <div className="stats-card-header">
        <div
          className="stats-card-icon-wrapper"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={24} color={textColor === "white" ? "white" : "#4b5563"} />
        </div>
        {change && (
          <span className={`stats-card-change ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? "+" : ""}{change}
          </span>
        )}
      </div>
      <div>
        <h3 className="stats-card-value">{value}</h3>
        <p className="stats-card-label">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
