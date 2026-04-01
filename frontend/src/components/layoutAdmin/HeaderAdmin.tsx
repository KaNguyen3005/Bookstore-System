import React from "react";
import "../../styles/Admin/HeaderAdmin.css";
import { FaRegUserCircle } from "react-icons/fa";

const HeaderAdmin: React.FC =() => {
  return (
    <div className="header-admin">
        <div className ="header-top-admin">
            <div className ="logo-header-admin">KATIIA MANAGEMENT </div>

            <div className="search-admin">
                <input type="text" placeholder="Tìm kiếm " />
            </div>

            <div className ="login-item"><FaRegUserCircle /> Đăng nhập</div>
        </div>
    </div>
  );
};

export default HeaderAdmin;