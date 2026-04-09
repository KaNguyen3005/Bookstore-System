import SidebarAdmin from "./SidebarAdmin";
import Footer from "../../../../layout/layoutUser/Footer/Footer";
import "./AdminHome.css";

import { Outlet } from "react-router-dom";


const AdminHome = () => {
  return (
    <div className="admin-layout-wrapper">
      <div className="admin-main-container">
        <SidebarAdmin />

        <main className="content-admin">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};


export default AdminHome;