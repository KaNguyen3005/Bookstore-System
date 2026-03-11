import React from "react";
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
  return (
    <header className="header">

      {/* TOP HEADER */}
      <div className="header-top">

        {/* Logo */}
        <div className="logo">
          KATIIA
        </div>

        {/* giao hang */}
        <div className="delivery">
          <TbTruckDelivery size={20}/>
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

          <div className="action-item">
            <FaRegUserCircle />
            <p>Đăng nhập</p>
          </div>

        </div>

      </div>


      {/* MENU */}
      <div className="header-menu">

        <button><IoHomeOutline /> BOOKS</button>
        <button><GiHamburgerMenu /> Xem tất cả</button>
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