import React from "react";
import "../../styles/Admin/HeaderAdmin.css";

const HeaderAdmin: React.FC =() => {
  return (
    <div className="header-admin">
        <div className ="header-top-admin">
            <div className ="logo-header-admin">KATIIA MANAGEMENT </div>

            <div className="search-admin">
                <input type="text" placeholder="Tìm kiếm " />
            </div>
        </div>
    </div>
  );
};

export default HeaderAdmin;