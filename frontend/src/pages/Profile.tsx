import "../styles/Profile.css";

export default function Profile() {
  return (
    <div className="account-page">

      {/* Sidebar */}
      <div className="sidebar">
        <h3>Tài khoản của tôi</h3>

        <ul>
          <li>Hồ sơ cá nhân</li>
          <li>Đổi mật khẩu</li>
          <li>Thông tin cá nhân</li>
          <li>Thiết lập tài khoản</li>
          <li>Kho Voucher</li>
          <li>Hạng thành viên của tôi</li>
          <li>Lịch sử tích điểm</li>
        </ul>
      </div>

      {/* Main */}
      <div className="content">

        <h2>Hồ sơ cá nhân</h2>

        <div className="profile-container">

          {/* Avatar */}
          <div className="avatar-section">
            <div className="avatar"></div>
            <p>User1234</p>
          </div>

          {/* Form */}
          <div className="form-section">

            <div className="form-row">
              <label>Tên đăng nhập</label>
              <input value="user1234@" />
              <span>Sửa</span>
            </div>

            <div className="form-row">
              <label>Họ và tên</label>
              <input value="Nguyễn Văn Test" />
              <span>Sửa</span>
            </div>

            <div className="form-row">
              <label>Số điện thoại</label>
              <input value="0912345***" />
              <span>Sửa</span>
            </div>

            <div className="form-row">
              <label>Email</label>
              <input value="testnguyenvan89@gmail.com" />
              <span>Sửa</span>
            </div>

            <div className="form-row">
              <label>Giới tính</label>
              <div className="radio">
                <label><input type="radio"/> Nam</label>
                <label><input type="radio"/> Nữ</label>
                <label><input type="radio"/> Khác</label>
              </div>
            </div>

            <div className="form-row">
              <label>Ngày sinh</label>
              <input value="**/**/2005" />
              <span>Sửa</span>
            </div>

            <div className="form-row">
              <label>Địa chỉ</label>
              <input value="97 Man Thiện, P Tăng Nhơn Phú, TP Hồ Chí Minh" />
              <span>Sửa</span>
            </div>

          </div>
        </div>

        <div className="member">
          <h3>Hạng thành viên</h3>
          <p>Số điểm tích lũy: 500 điểm</p>
        </div>

        <button className="save-btn">Lưu</button>

      </div>
    </div>
  );
}