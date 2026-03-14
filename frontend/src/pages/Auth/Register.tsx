import "../../styles/Register.css";

const Register = () => {
  return (
    <div className="register-page">

      <div className="register-container">

        <h1 className="logo">KATIIA BOOKSTORE</h1>
        <p className="subtitle">Đăng ký tài khoản</p>

        <form className="register-form">

          <label>Tên</label>
          <div className="name-row">
            <input type="text" placeholder="Họ" />
            <input type="text" placeholder="Tên" />
          </div>

          <label>Ngày sinh</label>
          <div className="birth-row">
            <select>
              <option>Ngày</option>
            </select>

            <select>
              <option>Tháng</option>
            </select>

            <select>
              <option>Năm</option>
            </select>
          </div>

          <label>Giới tính</label>
          <select className="full">
            <option>Chọn giới tính</option>
          </select>

          <label>Số di động hoặc email</label>
          <input className="full" placeholder="Số di động hoặc email" />

          <label>Mật khẩu</label>
          <input className="full" type="password" placeholder="Mật khẩu" />

          <p className="note">
            Bằng việc nhấn đăng ký tài khoản, bạn đồng ý tạo tài khoản cũng như
            chấp thuận
            <a href="/terms" className="link"> điều khoản & điều kiện</a>,
            <a href="/privacy" className="link"> chính sách bảo mật</a> và
            <a href="/cookie" className="link"> chính sách cookie</a> của
            KATIIA.
          </p>

          <button type="submit">Đăng ký tài khoản</button>

        </form>

        <p className="ask-register">
          Đã có tài khoản, <span>đăng nhập ngay</span>
        </p>

      </div>

    </div>
  );
};

export default Register;