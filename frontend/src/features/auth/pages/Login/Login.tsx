import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Login.css";

import { authApi } from "../../../../services/authApi";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await authApi.login({ account, password });

    if (!user) {
      alert("Sai tài khoản hoặc mật khẩu");
      return;
    }

    login(user); // đưa thẳng vào context

    if (user.role === "ADMIN") {
      console.log("IN ADMIN")
      setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 0);
    } else {
      navigate(from, { replace: true });
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

          <button type="submit">Đăng nhập</button>
        </form>

        <p className="forgot ">Quên mật khẩu</p>

        <Link to="/register" className="register" onClick={scrollToTop}>
          Đăng ký tài khoản
        </Link>
      </div>
    </div>
  );
};

export default Login;
