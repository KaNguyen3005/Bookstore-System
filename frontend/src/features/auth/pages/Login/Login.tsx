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

  const from = location.state?.from?.pathname || "/";
  //chặn spam request.
  const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (loading) return;

  setLoading(true);

  try {
    const user = await authApi.login({ account, password });

    if (!user) {
      alert("Sai tài khoản hoặc mật khẩu");
      return;
    }

    login(user);

    navigate(user.role === "ADMIN" ? "/admin" : from, {
      replace: true,
    });

  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    alert(error?.message || "Đăng nhập thất bại");
  } finally {
    setLoading(false);
  }
};

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="logo"> KATIIA BOOKSTORE </h1>
        <p className="subtitle">Đăng nhập tài khoản </p>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email hoặc tên đăng nhập"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="forgot-wrapper">
            <div className="forgot">Forgot password</div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

        </form>

        <div className="social-wrapper">
          <button className="social">
            <FcGoogle size={20} />
            Đăng nhập với Google
          </button>
        </div>



        <Link to="/register" className="register" onClick={scrollToTop}>
          Đăng ký tài khoản
        </Link>
      </div>
    </div>
  );
};

export default Login;
