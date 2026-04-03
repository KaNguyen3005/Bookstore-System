import React, { useState, useRef, useEffect } from "react";
import "./HeaderAdmin.css";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import DropdownAdmin from "../../../features/admin/components/DropdownAdmin/DropdownAdmin";

const HeaderAdmin: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

    const scrollToTop = () => {
      window.scrollTo(0, 0);
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="header-admin">
      <div className="header-top-admin">
        <div className="logo-header-admin">KATIIA MANAGEMENT</div>

            <div className="login-item" ref={menuRef}>
              <div onClick={() => setOpen(!open)} className="user-trigger">
                <FaRegUserCircle />
                <span>Admin</span>
              </div>

                {open && (
                  <div className="dropdown-user">
                    <div className="dropdown-item">Cài đặt </div>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        scrollToTop();
                        handleLogout();
                      }}
                    >
                      Đăng xuất
                    </div>
                  </div>
                )}
            </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
