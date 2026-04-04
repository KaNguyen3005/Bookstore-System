import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

import DropdownUser from "../../../features/UserProfile/components/Dropdown/DropdownUser";
import { useCart } from "../../../features/cart/hooks/useCart";
import { useAuth } from "../../../features/auth/hooks/useAuth";

import { FaRegUserCircle, FaHotjar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { IoHomeOutline, IoNotificationsOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoBook } from "react-icons/go";
import { MdCardMembership } from "react-icons/md";
import { TbBrandBlogger, TbTruckDelivery } from "react-icons/tb";
import { RiUserCommunityLine } from "react-icons/ri";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-top">
        <Link to="/" className="logo-header" onClick={scrollToTop}>
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

          <Link to="/cart" className="action-item">
            <FiShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
            <p>Giỏ hàng</p>
          </Link>

          {/* USER */}
          {user ? (
            <div className="action-item user-menu" ref={menuRef}>
              <div className="user-trigger-us" onClick={() => setOpen(!open)}>
                <FaRegUserCircle />
                <p>{user.username}</p>
              </div>

              {open && (
                <DropdownUser
                  onLogout={() => {
                    scrollToTop();
                    logout();
                    setOpen(false);
                    navigate("/");
                  }}
                  onProfile={() => {
                    scrollToTop();
                    setOpen(false);
                    navigate("/profile");
                  }}
                />
              )}
            </div>
          ) : (
            <Link to="/login" className="action-item">
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
        <button><FaHotjar /> Bán chạy</button>
        <button><MdCardMembership /> Thành viên</button>
        <button><TbBrandBlogger /> Blog</button>
        <button><RiUserCommunityLine /> Cộng đồng</button>
      </div>
    </header>
  );
};

export default Header;