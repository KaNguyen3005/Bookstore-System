import { Outlet } from "react-router-dom";
import Header from "./HeaderAdmin";
import Footer from "./FooterAdmin";

function LayoutAdmin() {
  return (
    <>
      <Header />

      <Outlet />

      <Footer />
    </>
  );
}

export default LayoutAdmin;