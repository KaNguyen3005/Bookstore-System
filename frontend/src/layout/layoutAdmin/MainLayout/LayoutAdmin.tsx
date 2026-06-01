import { Outlet } from "react-router-dom";
import Header from "../Header/HeaderAdmin";

function LayoutAdmin() {
  return (
    <>
      <Header />

      <Outlet />
    </>
  );
}

export default LayoutAdmin;