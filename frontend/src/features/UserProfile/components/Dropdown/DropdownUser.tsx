import React from "react";
import "./DropdownUser.css";

type Props = {
  onLogout: () => void;
  onProfile?: () => void;
  onPurchaseOrder?: () => void;
  onSettingPage?: () => void;
  onHelpPage?: () => void;
};

const DropdownUser: React.FC<Props> = ({onLogout, onProfile, onPurchaseOrder, onSettingPage, onHelpPage}) => {
  return (
    <div className="dropdown-user">
      <div className="dropdown-item" onClick={onProfile}>
        Thông tin cá nhân
      </div>

      <div className="dropdown-item" onClick={onPurchaseOrder}>
        Đơn mua
      </div>

      <div className="dropdown-item" onClick ={onSettingPage}>Cài đặt</div>
      <div className="dropdown-item" onClick ={onHelpPage}>Trợ giúp</div>

      <div className="dropdown-item" onClick={onLogout}>
        Đăng xuất
      </div>
    </div>
  );
};

export default DropdownUser;