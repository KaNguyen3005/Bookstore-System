import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authApi } from "../../../../services/authApi";
import logo from "../../../../assets/images/logo-auth.png";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const currentYear = new Date().getFullYear();

    const years = Array.from(
      { length: 80 },
      (_, i) => currentYear - i
    );

  // VALIDATE
  const validate = () => {
    const err: any = {};

    if (!form.username.trim()) err.username = "Vui lòng nhập tên đăng nhập";
    if (!form.firstName.trim()) err.firstName = "Vui lòng nhập họ";
    if (!form.lastName.trim()) err.lastName = "Vui lòng nhập tên";

    if (!form.day || !form.month || !form.year) {
      err.birth = "Vui lòng chọn ngày sinh";
    } else {
      const birthDate = new Date(
        Number(form.year),
        Number(form.month) - 1,
        Number(form.day)
      );

      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();

      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 16) {
        err.birth = "Bạn phải từ 16 tuổi trở lên";
      }
    }

    if (!form.gender) err.gender = "Vui lòng chọn giới tính";

    if (!form.email.trim()) err.email = "Vui lòng nhập email";

    if (!form.password) err.password = "Vui lòng nhập mật khẩu";

    if (form.password !== form.confirmPassword)
      err.confirmPassword = "Mật khẩu không khớp";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  //  REGISTER INIT
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setGlobalError("");

    try {
      const dob = `${form.year}-${String(form.month).padStart(2, "0")}-${String(
        form.day
      ).padStart(2, "0")}`;

    const genderMap: any = {
      male: "MALE",
      female: "FEMALE",
      other: "OTHER",
      MALE: "MALE",
      FEMALE: "FEMALE",
      OTHER: "OTHER",
    };

    const now = new Date();

    const payload = {
      email: form.email,
      password: form.password,
      username: form.username,
      name: `${form.firstName} ${form.lastName}`.trim(),
      phone: "+84008938116",
      gender: genderMap[form.gender] || "OTHER",

      dob: `${form.year}-${String(form.month).padStart(2, "0")}-${String(form.day).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    };

      //  CALL REGISTER INIT
      console.log("REGISTER PAYLOAD:", payload);
      console.log("FINAL GENDER:", payload.gender);

    await authApi.registerInit(payload);

    //await authApi.sendOtp(form.email);

    // lưu payload đầy đủ
    sessionStorage.setItem(
      "registerPayload",
      JSON.stringify(payload)
    );

    sessionStorage.setItem("registerEmail", form.email);

    navigate("/otp");

    } catch (err: any) {
      console.log("REGISTER ERROR:", err);

      const msg =
        err?.response?.data?.message || "Đăng ký thất bại";

      setGlobalError(msg);

      const lower = msg.toLowerCase();

      if (lower.includes("email")) {
        setErrors((p: any) => ({ ...p, email: msg }));
      } else if (lower.includes("username")) {
        setErrors((p: any) => ({ ...p, username: msg }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="register-page">
      <div className="register-container">

        <img src={logo} alt="KATIIA BOOKSTORE" className="logo-img-auth-re" />
        <p className="subtitle">Đăng ký tài khoản</p>

        {globalError && (
          <div className="error-message">{globalError}</div>
        )}

        <form className="register-form" onSubmit={handleRegister}>

          <label>Tên đăng nhập</label>
          <input
            className={`full input ${errors.username ? "error" : ""}`}
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
          <p className="error-text">{errors.username}</p>

          <label>Họ và tên</label>
          <div className="name-row">
            <div>
              <input
                placeholder="Họ"
                className={`input ${errors.firstName ? "error" : ""}`}
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
              <p className="error-text">{errors.firstName}</p>
            </div>

            <div>
              <input
                placeholder="Tên"
                className={`input ${errors.lastName ? "error" : ""}`}
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
              <p className="error-text">{errors.lastName}</p>
            </div>
          </div>

          <label>Ngày sinh</label>
          <div className="birth-row">
            <select value={form.day}
              onChange={(e) => handleChange("day", e.target.value)}>
              <option value="">Ngày</option>
              {days.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <select value={form.month}
              onChange={(e) => handleChange("month", e.target.value)}>
              <option value="">Tháng</option>
              {months.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <select value={form.year}
              onChange={(e) => handleChange("year", e.target.value)}>
              <option value="">Năm</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
          <p className="error-text">{errors.birth}</p>

          <select
            value={form.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="">Giới tính</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>

          <p className="error-text">{errors.gender}</p>

          <label>Email</label>
          <input
            className={`full input ${errors.email ? "error" : ""}`}
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <p className="error-text">{errors.email}</p>

          <label>Mật khẩu</label>
          <input
            type="password"
            className={`full input ${errors.password ? "error" : ""}`}
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <p className="error-text">{errors.password}</p>

          <label>Xác nhận mật khẩu</label>
          <input
            type="password"
            className={`full input ${errors.confirmPassword ? "error" : ""}`}
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
          />
          <p className="error-text">{errors.confirmPassword}</p>

          <button type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
          </button>

        </form>

        <p className="ask-register">
          Đã có tài khoản? <Link to="/login">đăng nhập ngay</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;