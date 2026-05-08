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
  const [error, setError] = useState("");

  const [accountError, setAccountError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setAccountError(false);
    setPasswordError(false);

    // ================= VALIDATE =================
    if (!account.trim()) {
      setAccountError(true);
      setError("Vui lòng nhập tài khoản");
      return;
    }

    if (!password.trim()) {
      setPasswordError(true);
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    setLoading(true);

    try {
      // 🔥 AUTH API ĐÃ TRẢ FULL USER + TOKEN
      const user = await authApi.login({
        account,
        password,
      });

      console.log("LOGIN SUCCESS:", user);

      if (!user || !user.id) {
        setAccountError(true);
        setPasswordError(true);
        setError("Sai tài khoản hoặc mật khẩu");
        return;
      }

      // ================= SAVE AUTH =================
      login(user);

      // ================= REDIRECT =================
      navigate(user.role === "ADMIN" ? "/admin" : from, {
        replace: true,
      });

    } catch (error: any) {
      console.error("LOGIN ERROR:", error);

      const msg = error?.message;

      // backend error mapping (từ authApi throw Error)
      const mapError: Record<string, string> = {
        "Invalid credentials": "Sai tài khoản hoặc mật khẩu",
        "Login failed": "Sai tài khoản hoặc mật khẩu",
        "Token not found": "Sai tài khoản hoặc mật khẩu",
      };

      setAccountError(true);
      setPasswordError(true);

      setError(mapError[msg] || "Sai tài khoản hoặc mật khẩu");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <h1 className="logo">KATIIA BOOKSTORE</h1>
        <p className="subtitle">Đăng nhập tài khoản</p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Email hoặc tên đăng nhập"
            value={account}
            className={accountError ? "input error" : "input"}
            onChange={(e) => {
              setAccount(e.target.value);
              setAccountError(false);
              setError("");
            }}
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            className={passwordError ? "input error" : "input"}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
              setError("");
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