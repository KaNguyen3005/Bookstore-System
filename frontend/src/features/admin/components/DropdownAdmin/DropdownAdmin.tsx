import React from "react";
import "./DropdownAdmin.css";

type Props = {
  onLogout: () => void;
};

const DropdownAdmin: React.FC<Props> = ({ onLogout }) => {
  return (
    <div className="dropdown-user">
      <div className="dropdown-item">Cài đặt</div>
      <div className="dropdown-item">Trợ giúp</div>

      <div className="dropdown-item" onClick={onLogout}>
        Đăng xuất
      </div>
    </div>
  );
};

export default DropdownAdmin;