import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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


import {searchApi } from "../../../services/searchApi";
import SearchItem from "../../../features/Search/components/SearchItem/SearchItem";

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

  return (
    <header className="header">
      <div className="header-top">
        <Link to="/" className="logo-header" onClick={scrollToTop}>
          <img src={logo} alt="logo" className="logo-img" />
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