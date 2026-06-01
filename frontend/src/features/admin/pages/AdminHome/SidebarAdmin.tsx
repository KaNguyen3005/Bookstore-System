import { NavLink, useNavigate } from "react-router-dom";

import "./AdminHome.css";

const SidebarAdmin = () => {
  return (
    <div className="sidebar-admin">
      <h2 className="logo-admin">ADMIN</h2>

      <ul className="menu-admin card-name-list">

                        <li>
                            <NavLink to ="..." className="card-name" >
                                Dash Board
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to ="..." className="card-name" >
                                Quản lý đặt hàng
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to ="..." className="card-name" >
                                Quản lý đặt hàng
                            </NavLink>
                        </li>

                        <li className="card-name">
                            <NavLink to ="..." className="card-name" >
                                Quản lý đơn hàng
                            </NavLink>

                        </li>

                        <li>
                            <NavLink to="customers" className="card-name">
                                Quản lý khách hàng
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to ="role" className="card-name" >
                                Quản lý vai trò & Phân quyền
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to ="..." className="card-name" >
                                Quản lý sản phẩm
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to ="..." className="card-name" >
                                Quản lý danh mục
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to ="..." className="card-name" >
                                Quản lý tác giả
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to ="..." className="card-name" >
                                Quản lý nhà sản xuất
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to ="..." className="card-name" >
                                Quản lý mã giảm giá
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to ="statistical_report" className="card-name" >
                                Báo cáo & Thống kê
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to ="..." className="card-name" >
                                Nhật ký hệ thống
                            </NavLink>
                        </li>

      </ul>
    </div>
  );
};

export default SidebarAdmin;