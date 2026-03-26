import "../../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/otp");
  };

  // state ngày sinh
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 80 }, (_, i) => 2025 - i);

  return (
    <div className="register-page">

      <div className="register-container">

        <h1 className="logo">KATIIA BOOKSTORE</h1>
        <p className="subtitle">Đăng ký tài khoản</p>

        <form className="register-form" onSubmit={handleRegister}>


          <label>Tên đăng</label>
          <input className="full" placeholder= "Tên đăng nhập" />

          <label>Tên</label>
          <div className="name-row">
            <input type="text" placeholder="Họ" />
            <input type="text" placeholder="Tên" />
          </div>



          <label>Ngày sinh</label>

          <div className="birth-row">

            <select value={day} onChange={(e)=>setDay(e.target.value)}>
              <option value="">Ngày</option>
              {days.map((d)=>(
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select value={month} onChange={(e)=>setMonth(e.target.value)}>
              <option value="">Tháng</option>
              {months.map((m)=>(
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select value={year} onChange={(e)=>setYear(e.target.value)}>
              <option value="">Năm</option>
              {years.map((y)=>(
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

          </div>



          <label>Giới tính</label>

          <select className="full">
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>


          <label>Email</label>
          <input className="full" placeholder= "Email" />

          <label>Mật khẩu</label>
          <input className="full" type="password" placeholder="Mật khẩu" />

          <label>Xác nhận mật khẩu</label>
          <input className="full" type="confirmPassword" placeholder="Xác nhận mật khẩu" />

          <button type="submit">Đăng ký tài khoản</button>

        </form>

        <p className="ask-register">
          Đã có tài khoản,
          <Link to="/login" className="login-link">
            đăng nhập ngay
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Register;