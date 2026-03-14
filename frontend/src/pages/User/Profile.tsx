import { Outlet } from "react-router-dom";
import "../../styles/Profile.css";
import Sidebar from "./Sidebar";

export default function Profile() {

  return (

    <div className="account-page">

      <Sidebar />

      <div className="content">
        <Outlet />
      </div>

    </div>

  );

}