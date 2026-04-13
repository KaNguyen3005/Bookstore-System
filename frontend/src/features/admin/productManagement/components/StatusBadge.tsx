import React from "react";
import type { AdminProduct } from "../types/product.type";

interface StatusBadgeProps {
  status: AdminProduct["status"];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeClass = "";
  switch (status) {
    case "Đang bán":
      badgeClass = "badge-success"; // Màu xanh (giả định css class sẽ quy định)
      break;
    case "Hết hàng":
      badgeClass = "badge-danger"; // Màu đỏ nhạt
      break;
    case "Tạm ngưng":
      badgeClass = "badge-warning"; // Màu cam nhạt
      break;
    default:
      badgeClass = "badge-default";
      break;
  }

  return (
    <span className={`status-badge ${badgeClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
