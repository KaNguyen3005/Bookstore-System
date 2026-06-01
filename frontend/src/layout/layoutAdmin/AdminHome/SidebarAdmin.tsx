import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Users,
  Ticket,
  ChevronRight,
  Layers,
  Building2,
} from "lucide-react";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import {
  hasAnyPermission,
  isAdminRole,
} from "../../../features/auth/utils/authPermissions";

import "./AdminHome.css";

const SidebarAdmin = () => {
  const { user } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      hasChevron: false,
      permissions: ["READ_DASHBOARD"],
    },
    {
      name: "Quản lý sản phẩm",
      path: "/admin/products",
      icon: BookOpen,
      hasChevron: true,
      permissions: ["CREATE_BOOK", "READ_BOOK", "UPDATE_BOOK", "DELETE_BOOK"],
    },
    {
      name: "Quản lý danh mục",
      path: "/admin/categories",
      icon: Layers,
      hasChevron: true,
      permissions: ["CREATE_CATEGORY", "UPDATE_CATEGORY", "DELETE_CATEGORY"],
    },
    {
      name: "Quản lý đơn hàng",
      path: "/admin/orders",
      icon: ShoppingBag,
      hasChevron: true,
      permissions: ["READ_ORDER"],
    },
    {
      name: "Quản lý tài khoản",
      path: "/admin/customers",
      icon: Users,
      hasChevron: true,
      permissions: ["READ_USER"],
    },
    {
      name: "Quản lý tác giả",
      path: "/admin/author",
      icon: Users,
      hasChevron: true,
      permissions: ["READ_AUTHOR"],
    },
    {
      name: "Quản lý nhà xuất bản",
      path: "/admin/publishers",
      icon: Building2,
      hasChevron: true,
      permissions: ["READ_PUBLISHER"],
    },
    {
      name: "Phân quyền & Vai trò",
      path: "/admin/role",
      icon: Users,
      hasChevron: true,
      permissions: [
        "READ_PERMISSION",
        "CREATE_ROLE",
        "UPDATE_ROLE",
        "DELETE_ROLE",
      ],
    },
    {
      name: "Quản lý voucher",
      path: "/admin/vouchers",
      icon: Ticket,
      hasChevron: true,
      permissions: ["CREATE_VOUCHER", "UPDATE_VOUCHER", "DELETE_VOUCHER"],
    },
  ].filter(
    (item) =>
      isAdminRole(user?.role) ||
      hasAnyPermission(user?.permissions, item.permissions),
  );

  return (
    <div className="sidebar-admin">
      <div className="logo-section">
        <h2 className="logo-admin"></h2>
        <h2 className="admin-badge">System Management</h2>
      </div>

      <nav className="menu-admin">
        <ul className="card-name-list">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className="card-name"
                end={item.path === "/admin"}
              >
                <div className="card-name-content">
                  <item.icon size={20} className="menu-icon" />
                  <span>{item.name}</span>
                </div>
                {item.hasChevron && (
                  <ChevronRight
                    size={16}
                    className="chevron-icon"
                    opacity={0.5}
                  />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarAdmin;
