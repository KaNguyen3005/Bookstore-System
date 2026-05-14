import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

import logo from "../../../assets/images/logo.png";

import { addressApi } from "../../../services/addressApi";
import type {Address } from "../../../data/address";

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
import { LuTickets } from "react-icons/lu";
import { CgHomeAlt } from "react-icons/cg";


import {searchApi } from "../../../services/searchApi";
import SearchItem from "../../../features/Search/components/SearchItem/SearchItem";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const { cartItems } = useCart();
  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

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

    const [address, setAddress] = useState<Address | null>(null);

    useEffect(() => {
      if (!user) {
        setAddress(null);
        return;
      }

      const fetchAddress =
        async () => {
          try {
            const list =
              await addressApi.getAll();

            console.log(list);

            if (list.length > 0) {
              const defaultAddr =
                list.find(
                  (a) => a.isDefault
                );

              setAddress(
                defaultAddr ||
                  list[0]
              );
            }
          } catch (error) {
            console.error(
              "Lỗi lấy địa chỉ:",
              error
            );
          }
        };

      fetchAddress();
    }, [user]);

const [keyword, setKeyword] = useState("");
const [results, setResults] = useState<any[]>([]);
const searchRef = useRef<HTMLDivElement>(null);


useEffect(() => {
  if (!keyword.trim()) {
    setResults([]);
    return;
  }

  const delay = setTimeout(() => {
    searchApi.searchBooks(keyword).then((res) => {
      setResults(res.slice(0, 5));
    });
  }, 300);

  return () => clearTimeout(delay);
}, [keyword]);

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }

    if (
      searchRef.current &&
      !searchRef.current.contains(e.target as Node)
    ) {
      setResults([]);
    }
  };



  document.addEventListener("mousedown", handleClickOutside);
  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);

const handleSearch = () => {
  if (!keyword.trim()) return;
  navigate(`/search?q=${keyword}`);
  setResults([]);
};

const menuItems = [
  { label: "BOOKS", icon: <IoHomeOutline />, path: "/" },
  { label: "Xem tất cả", icon: <GiHamburgerMenu />, path: "/category" },
  { label: "Kho Voucher", icon: <LuTickets />, path: "/voucherPage" },
  { label: "Ebook", icon: <GoBook />, path: "/ebookPage" },
  { label: "Bán chạy", icon: <FaHotjar />, path: "/category" },
  { label: "Thành viên", icon: <MdCardMembership />, path: "/memberPage" },
  { label: "Giới thiệu KATIIA", icon: <CgHomeAlt />, path: "/companiesPage" },
  { label: "Blog", icon: <TbBrandBlogger />, path: "/blogPage" },
  { label: "Cộng đồng", icon: <RiUserCommunityLine />, path: "/communityPage" },
];

const isMenuActive = (path: string, label: string) => {
  if (label === "Bán chạy") return false;

  return path === "/"
    ? location.pathname === path
    : location.pathname.startsWith(path);
};

if (loading) {
  return null; // hoặc skeleton
}
  return (
    <header className="header">
      <div className="header-top">
        <Link to="/" className="logo-header" onClick={scrollToTop}>
          <img src={logo} alt="logo" className="logo-img-header" />
        </Link>

        <div className="delivery">
          <TbTruckDelivery size={20} />
          <div>
            <p>Giao đến</p>
            <p>
              {address
                ? `${address.ward}, ${address.district}, ${address.province}`
                : "Chưa có địa chỉ"}
            </p>
          </div>
        </div>

        <div className="search" ref={searchRef}>
          <input
            type="text"
            placeholder="Tìm kiếm sách"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          {results.length > 0 && (
            <div className="search-dropdown">
              {results.map((book) => (
                <SearchItem key={book.book_id} book={book} />
              ))}
            </div>
          )}
        </div>

        <div className="actions">
          <div className="action-item">
            <IoNotificationsOutline />
            <p>Thông báo</p>
          </div>

          <Link to="/cart" className="action-item">
            <FiShoppingCart size={24} />
            {cartQuantity > 0 && (
              <span className="cart-badge">{cartQuantity}</span>
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

                  onPurchaseOrder ={()=> {
                      scrollToTop();
                      setOpen(false);
                      navigate("/profile/purchaseorder");
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

      <nav className="header-menu" aria-label="Danh mục chính">
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={isMenuActive(item.path, item.label) ? "active" : ""}
            onClick={() => navigate(item.path)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
