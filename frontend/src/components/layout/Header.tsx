import React from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <header className="header">

      <div className="header-top">

        <Link to="/" className="logo login-link">
          KATIIA
        </Link>

        <div className="delivery">
          <TbTruckDelivery size={20} />
          <div>
            <p>Giao đến</p>
            <p>TP.Hồ Chí Minh</p>
          </div>
        </div>

        <div className="search">
          <input type="text" placeholder="Tìm kiếm sách" />
        </div>

        <div className="actions">

          <div className="action-item">
            <IoNotificationsOutline />
            <p>Thông báo</p>
          </div>

          <div className="action-item">
            <FiShoppingCart />
            <p>Giỏ hàng</p>
          </div>

          {/*}<Link to="/login" className="action-item login-link" onClick={scrollToTop}>
            <FaRegUserCircle />
            <p>Đăng nhập</p>
          </Link>*/}

        {user ? (
          <Link to="/profile" className="action-item login-link">
            <FaRegUserCircle />
            <p>{user.email}</p>
          </Link>
        ) : (
          <Link to="/login" className="action-item login-link" onClick={scrollToTop}>
            <FaRegUserCircle />
            <p>Đăng nhập</p>
          </Link>
        )}

        </div>

      </div>

      <div className="header-menu">

        <button onClick={() => navigate("/")}>
          <IoHomeOutline /> BOOKS
        </button>

        <button onClick={() => navigate("/category")}>
          <GiHamburgerMenu /> Xem tất cả
        </button>

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