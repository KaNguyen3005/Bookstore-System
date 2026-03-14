import React from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
import { Link } from "react-router-dom";

>>>>>>> d29d671114d4fe799c4abdaf1744494acc199cf6
import "../../styles/Header.css";
import { TbTruckDelivery } from "react-icons/tb";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { TbBrandBlogger } from "react-icons/tb";
import { IoHomeOutline } from "react-icons/io5";
import { MdCardMembership } from "react-icons/md";
import { RiUserCommunityLine } from "react-icons/ri";
import { GoBook } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaHotjar } from "react-icons/fa";

const Header: React.FC = () => {
<<<<<<< HEAD
  const navigate = useNavigate();
=======

    const scrollToTop = () => {
      window.scrollTo(0,0);
    };

>>>>>>> d29d671114d4fe799c4abdaf1744494acc199cf6
  return (
    <header className="header">

      {/* TOP HEADER */}
      <div className="header-top">

        {/* Logo */}
        <Link to ="/" className="logo login-link">
          KATIIA
        </Link>

        {/* giao hang */}
        <div className="delivery">
          <TbTruckDelivery size={20} />
          <div>
            <p>Giao đến</p>
            <p>TP.Hồ Chí Minh</p>
          </div>
        </div>

        {/* Search */}
        <div className="search">
          <input
            type="text"
            placeholder="Tìm kiếm sách "
          />
        </div>

        {/* Actions */}
        <div className="actions">

          <div className="action-item">
            <IoNotificationsOutline />
            <p>Thông báo</p>
          </div>

          <div className="action-item">
            <FiShoppingCart />
            <p>Giỏ hàng</p>
          </div>

          <Link to="/profile" className="action-item login-link" onClick={scrollToTop}>
            <FaRegUserCircle />
            <p>Đăng nhập</p>
          </Link>

        </div>

      </div>


      {/* MENU */}
      <div className="header-menu ">

<<<<<<< HEAD
        <button onClick={() => navigate("/")}>
          <IoHomeOutline /> BOOKS</button>
        <button onClick={() => navigate("/category")}>
          <GiHamburgerMenu /> Xem tất cả</button>
=======
        <button>
            <Link to ="/" className= "login-link">
                <IoHomeOutline /> BOOKS
            </Link>
        </button>
        <button><GiHamburgerMenu /> Xem tất cả</button>
>>>>>>> d29d671114d4fe799c4abdaf1744494acc199cf6
        <button><GoBook /> Ebook</button>
        <button>Mới & Thịnh hành</button>
        <button>Ưu đãi & Phần thưởng</button>
        <button><FaHotjar /> Sản phẩm bán chạy</button>
        <button><MdCardMembership /> Thẻ thành viên</button>
        <button><TbBrandBlogger /> Cộng đồng</button>
        <button><RiUserCommunityLine /> Dịch vụ khách hàng</button>

      </div>

    </header>
  );
};

export default Header;