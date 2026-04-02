import { Outlet } from "react-router-dom";
import Header from "../Header/HeaderAdmin";
import Footer from "../Footer/FooterAdmin";

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