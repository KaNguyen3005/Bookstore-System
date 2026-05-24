import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authApi } from "../../../../services/authApi";
import logo from "../../../../assets/images/logo-auth.png";

type RegisterErrors = Partial<Record<
  | "username"
  | "firstName"
  | "lastName"
  | "birth"
  | "gender"
  | "email"
  | "password"
  | "confirmPassword"
  | "phone",
  string
>>;

const genderMap: Record<string, string> = {
  male: "MALE",
  female: "FEMALE",
  other: "OTHER",
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};

const getRegisterErrorMessage = (error: any) =>
  error?.response?.data?.message ||
  error?.message ||
  "Đăng ký thất bại";

const Register = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 80 }, (_, i) => currentYear - i);

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

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const validate = () => {
    const err: RegisterErrors = {};
    const username = form.username.trim();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const email = form.email.trim();

    if (!username) {
      err.username = "Vui lòng nhập tên đăng nhập";
    } else if (!/^[a-zA-Z0-9_]{3,255}$/.test(username)) {
      err.username = "Tên đăng nhập chỉ gồm chữ, số, dấu _ và tối thiểu 3 ký tự";
    }

    if (!firstName) err.firstName = "Vui lòng nhập họ";
    if (!lastName) err.lastName = "Vui lòng nhập tên";
    if (fullName && fullName.length < 6) {
      err.lastName = "Họ và tên phải có tối thiểu 6 ký tự";
    }

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
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 16) {
        err.birth = "Bạn phải từ 16 tuổi trở lên";
      }
    }

    if (!form.gender) err.gender = "Vui lòng chọn giới tính";

    if (!email) {
      err.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.email = "Email không hợp lệ";
    }

    if (!form.password) {
      err.password = "Vui lòng nhập mật khẩu";
    } else if (form.password.length < 6) {
      err.password = "Mật khẩu phải có tối thiểu 6 ký tự";
    }

    if (form.password !== form.confirmPassword) {
      err.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    setGlobalError("");
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const now = new Date();
    const dob = `${form.year}-${String(form.month).padStart(2, "0")}-${String(
      form.day
    ).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const payload = {
      email: form.email.trim(),
      password: form.password,
      username: form.username.trim(),
      name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      phone: "+84008938116",
      gender: genderMap[form.gender] || "OTHER",
      dob,
    };

    sessionStorage.setItem("registerPayload", JSON.stringify(payload));
    sessionStorage.setItem("registerEmail", payload.email);
    sessionStorage.setItem("registerOtpStatus", "pending");
    sessionStorage.removeItem("registerOtpError");

    navigate("/otp");

    authApi
      .registerInit(payload)
      .then(() => {
        sessionStorage.setItem("registerOtpStatus", "sent");
      })
      .catch((error: any) => {
        sessionStorage.setItem("registerOtpStatus", "error");
        sessionStorage.setItem("registerOtpError", getRegisterErrorMessage(error));
      });
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "day" || field === "month" || field === "year") {
      setErrors((prev) => ({ ...prev, birth: "" }));
    }

    setGlobalError("");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <img src={logo} alt="KATIIA BOOKSTORE" className="logo-img-auth-re" />
        <p className="subtitle">Đăng ký tài khoản</p>

        {globalError && <div className="error-message">{globalError}</div>}

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
            <select
              value={form.day}
              onChange={(e) => handleChange("day", e.target.value)}
            >
              <option value="">Ngày</option>
              {days.map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>

            <select
              value={form.month}
              onChange={(e) => handleChange("month", e.target.value)}
            >
              <option value="">Tháng</option>
              {months.map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>

            <select
              value={form.year}
              onChange={(e) => handleChange("year", e.target.value)}
            >
              <option value="">Năm</option>
              {years.map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
          </div>
          <p className="error-text">{errors.birth}</p>

          <select
            value={form.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className={errors.gender ? "error" : ""}
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
