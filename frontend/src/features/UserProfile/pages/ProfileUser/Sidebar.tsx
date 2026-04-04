import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar(){

  const navigate = useNavigate();

  return(

    <div className="sidebar">

      <h3>Tài khoản của tôi</h3>

      <ul>

        <li>
          <NavLink to="/profile" end>
            Hồ sơ cá nhân
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile/password">
            Đổi mật khẩu
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile/info">
            Thông tin cá nhân
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile/address">
            Địa chỉ giao hàng
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile/purchaseOrder">
            Đơn mua
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile/voucher">
            Kho Voucher
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile/member">
            Hạng thành viên
          </NavLink>
        </li>

      </ul>

    </div>

  )
}