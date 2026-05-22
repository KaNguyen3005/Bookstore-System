import { NavLink } from "react-router-dom";

import { 
  LayoutDashboard, 
  BookOpen, 
  ShoppingBag, 
  Users, 
  Ticket, 
  BarChart2, 
  ChevronRight,
  Layers,
  Building2
} from "lucide-react";

import "./AdminHome.css";

const SidebarAdmin = () => {
  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard, hasChevron: false },
    { name: "Quản lý sản phẩm", path: "/admin/products", icon: BookOpen, hasChevron: true },
    { name: "Quản lý danh mục", path: "/admin/categories", icon: Layers, hasChevron: true },
    { name: "Quản lý đơn hàng", path: "/admin/orders", icon: ShoppingBag, hasChevron: true },
    { name: "Quản lý tài khoản", path: "/admin/customers", icon: Users, hasChevron: true },
    { name: "Quản lý tác giả", path: "/admin/author", icon: Users, hasChevron: true },
    { name: "Quản lý nhà xuất bản", path: "/admin/publishers", icon: Building2, hasChevron: true },
    { name: "Phân quyền & Vai trò", path: "/admin/role", icon: Users, hasChevron: true },
    { name: "Quản lý voucher", path: "/admin/vouchers", icon: Ticket, hasChevron: true },
  ];

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
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                  <item.icon size={20} className="menu-icon" />
                  <span>{item.name}</span>
                </div>
                {item.hasChevron && <ChevronRight size={16} className="chevron-icon" opacity={0.5} />}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

    </div>
  );
};

export default SidebarAdmin;
