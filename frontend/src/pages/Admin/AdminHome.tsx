import SidebarAdmin from "./SidebarAdmin";
import "../../styles/Admin/AdminHome.css";

import { Outlet } from "react-router-dom";


const AdminHome = () => {
  return (
    <div className="account-pageAdmin">
        <SidebarAdmin/>

      <div className="content-admin">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminHome;