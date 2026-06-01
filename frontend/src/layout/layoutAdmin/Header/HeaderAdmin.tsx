import React, { useState, useRef, useEffect } from "react";
import "./HeaderAdmin.css";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import DropdownAdmin from "../../../features/admin/shared/components/DropdownAdmin/DropdownAdmin";
import logo from "../../../assets/images/logo.png";

const HeaderAdmin: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    const displayName =
      user?.name || user?.username || "User";

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
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="header-admin">
      <div className="header-top-admin">
        <div className="logo-header-admin"><img src={logo} alt="logo" className="logo-img" /></div>

        <div className="login-item" ref={menuRef}>
          <div
            onClick={() => setOpen(!open)}
            className="user-trigger"
          >
            <FaRegUserCircle />
             <span>
               {displayName} ({user?.role})
             </span>
          </div>

          {open && (
            <DropdownAdmin
              onLogout={() => {
                scrollToTop();
                handleLogout();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;