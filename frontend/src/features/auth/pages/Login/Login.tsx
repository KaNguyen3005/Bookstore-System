import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Login.css";

import { FcGoogle } from "react-icons/fc";
import { authApi } from "../../../../services/authApi";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    account: "",
    password: "",
    common: "",
  });

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // reset lỗi
    setErrors({
      account: "",
      password: "",
      common: "",
    });

    let hasError = false;
    const newErrors = {
      account: "",
      password: "",
      common: "",
    };

    // ===== VALIDATE =====
    if (!account.trim()) {
      newErrors.account = "Vui lòng nhập tài khoản";
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      hasError = true;
    }

    if (hasError) {
      newErrors.common = newErrors.account || newErrors.password;
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const user = await authApi.login({
        account,
        password,
      });

      if (!user?.token) {
        setErrors({
          account: "Sai tài khoản hoặc mật khẩu",
          password: "Sai tài khoản hoặc mật khẩu",
          common: "Sai tài khoản hoặc mật khẩu",
        });
        return;
      }

      login({
        ...user,
        token: user.token,
      });

      const role = user.role?.trim?.().toUpperCase();

      navigate(role === "ADMIN" ? "/admin" : from, {
        replace: true,
      });
    } catch (err) {
      setErrors({
        account: "Sai tài khoản hoặc mật khẩu",
        password: "Sai tài khoản hoặc mật khẩu",
        common: "Sai tài khoản hoặc mật khẩu",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="logo">KATIIA BOOKSTORE</h1>
        <p className="subtitle">Đăng nhập tài khoản</p>

        {/* ===== ERROR TOP ===== */}
        {errors.common && (
          <div className="error-message">{errors.common}</div>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          {/* ACCOUNT */}
          <input
            type="text"
            placeholder="Email hoặc tên đăng nhập"
            value={account}
            className={errors.account ? "input error" : "input"}
            onChange={(e) => {
              setAccount(e.target.value);
              setErrors((prev) => ({
                ...prev,
                account: "",
                common: "",
              }));
            }}
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            className={errors.password ? "input error" : "input"}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                password: "",
                common: "",
              }));
            }}
          />

          <div className="forgot-wrapper">
            <div className="forgot">Quên mật khẩu</div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="social-wrapper">
          <button className="social" disabled={loading}>
            <FcGoogle size={20} />
            Đăng nhập với Google
          </button>
        </div>

        <Link to="/register" className="register">
          Đăng ký tài khoản
        </Link>
      </div>
    </div>
  );
};

export default Login;