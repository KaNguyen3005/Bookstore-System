import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

import logo from "../../../assets/images/logo.png";

import { addressApi } from "../../../services/addressApi";
import type { Address } from "../../../data/address";

import DropdownUser from "../../../features/UserProfile/components/Dropdown/DropdownUser";
import { useCart } from "../../../features/cart/hooks/useCart";
import { useAuth } from "../../../features/auth/hooks/useAuth";

import {
  FaRegUserCircle,
  FaHotjar,
} from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import {
  IoHomeOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoBook } from "react-icons/go";
import { MdCardMembership } from "react-icons/md";
import {
  TbBrandBlogger,
  TbTruckDelivery,
} from "react-icons/tb";
import { RiUserCommunityLine } from "react-icons/ri";
import { LuTickets } from "react-icons/lu";
import { CgHomeAlt } from "react-icons/cg";

import { searchBooks } from "../../../services/searchApi";
import SearchItem from "../../../features/Search/components/SearchItem/SearchItem";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const { cartItems } = useCart();

  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= ADDRESS ================= */
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!user) {
      setAddress(null);
      return;
    }

    const fetchAddress = async () => {
      try {
        const list = await addressApi.getAll();

        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.isDefault);
          setAddress(defaultAddr || list[0]);
        }
      } catch (error) {
        console.error("Lỗi lấy địa chỉ:", error);
      }
    };

    fetchAddress();
  }, [user]);

  /* ================= SEARCH ================= */
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(() => {
      searchBooks({
        keyword,
        page: 0,
        size: 5,
      }).then((res) => {
        setResults(res.result.content || []);
      });
    }, 300);

    return () => clearTimeout(delay);
  }, [keyword]);

  const handleSelect = (title: string) => {
    setKeyword(title);
    setResults([]);
    setShowDropdown(false);

    navigate(`/search?keyword=${encodeURIComponent(title)}`);
  };

  const handleSearch = () => {
    if (!keyword.trim()) return;

    setShowDropdown(false);
    setResults([]);

    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(target)
      ) {
        setResults([]);
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= MENU ================= */
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

  const isGuest = !user;

  /* ================= UI ================= */
  return (
    <header className="header">
      <div className="header-top">
        {/* LOGO */}
        <Link to="/" className="logo-header" onClick={scrollToTop}>
          <img src={logo} alt="logo" className="logo-img-header" />
        </Link>

        {/* ADDRESS */}
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

        {/* SEARCH */}
        <div
          className="search"
          ref={searchRef}
        >
          <input
            type="text"
            placeholder="Tìm kiếm sách"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          {showDropdown && results.length > 0 && (
            <div className="search-dropdown">
              {results.map((book) => (
                <SearchItem
                  key={book.bookId}
                  book={book}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
        </div>

        {/* ACTIONS */}
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
          {!loading && user ? (
            <div className="action-item user-menu" ref={menuRef}>
              <div
                className="user-trigger-us"
                onClick={() => setOpen(!open)}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="user-avatar"
                  />
                ) : (
                  <FaRegUserCircle />
                )}

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
                  onPurchaseOrder={() => {
                    scrollToTop();
                    setOpen(false);
                    navigate("/profile/purchaseorder");
                  }}

                  onSettingPage={() =>{
                    scrollToTop();
                    setOpen(false);
                    navigate("/setting");
                  }}

                  onHelpPage={()=> {
                    scrollToTop();
                    setOpen(false);
                    navigate("/help");
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

      {/* MENU */}
      <nav className="header-menu">
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={
              isMenuActive(item.path, item.label) ? "active" : ""
            }
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