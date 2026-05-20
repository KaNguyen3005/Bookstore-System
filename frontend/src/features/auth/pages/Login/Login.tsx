import { useState } from "react";
import {
  useNavigate,
  useLocation,
  Link,
  Navigate,
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import "./Login.css";

import logo from "../../../../assets/images/logo-auth.png";

import { FcGoogle } from "react-icons/fc";
import { GoogleLogin } from "@react-oauth/google";

import { authApi } from "../../../../services/authApi";

const Login = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { login, isAuthenticated, user } = useAuth();

  const [account, setAccount] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [accountError, setAccountError] = useState(false);

  const [passwordError, setPasswordError] = useState(false);

  const from = location.state?.from || "/";

  const normalizeRole = (value?: string) =>
    value?.trim().toUpperCase().replace(/^ROLE_/, "");

  // đã login -> redirect luôn
const hasToken = !!localStorage.getItem("access_token");

if (hasToken && user) {
  const role = normalizeRole(user.role);

  return (
    <Navigate
      to={
        role === "ADMIN" || role === "STAFF"
          ? "/admin"
          : "/"
      }
      replace
    />
  );
}

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    setAccountError(false);

    setPasswordError(false);

    // validate
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
      const user = await authApi.login({
        account,
        password,
      });

  console.log("LOGIN USER:", user);
  console.log("ROLE:", user.role);
  console.log("NORMALIZED:", normalizeRole(user.role));

      if (!user || !(user.userId || user.id)) {
        throw new Error("Invalid credentials");
      }

      login(user);

      const role = normalizeRole(user.role);

      setTimeout(() => {
        navigate(
          role === "ADMIN" || role === "STAFF"
            ? "/admin"
            : from,
          {
            replace: true,
          }
        );
      }, 0);

    } catch (error: any) {
      console.error("LOGIN ERROR:", error);

      const msg = error?.message;

      const mapError: Record<string, string> = {
        "Invalid credentials":
          "Sai tài khoản hoặc mật khẩu",

        "Login failed":
          "Sai tài khoản hoặc mật khẩu",

        "Token not found":
          "Sai tài khoản hoặc mật khẩu",
      };

      setAccountError(true);

      setPasswordError(true);

      setError(
        mapError[msg] || "Sai tài khoản hoặc mật khẩu"
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="login-page">
      <div className="login-container">
        <img
          src={logo}
          alt="KATIIA BOOKSTORE"
          className="logo-img-auth-login"
        />

        <p className="subtitle">
          Đăng nhập tài khoản
        </p>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >
          <input
            type="text"
            placeholder="Email hoặc tên đăng nhập"
            value={account}
            className={
              accountError ? "input error" : "input"
            }
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
            className={
              passwordError ? "input error" : "input"
            }
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
              setError("");
            }}
          />

          <div className="forgot-wrapper">
            <div className="forgot">
              Quên mật khẩu
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Đang đăng nhập..."
              : "Đăng nhập"}
          </button>
        </form>

        <div className="social-wrapper">
          <div className="google-btn">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  setLoading(true);

                  const idToken =
                    credentialResponse.credential;

                  if (!idToken) {
                    throw new Error(
                      "Google token missing"
                    );
                  }

                  const user =
                    await authApi.googleLogin(
                      idToken
                    );

                  login(user);

                  const role = normalizeRole(
                    user.role
                  );

                  navigate(
                    role === "ADMIN"
                      ? "/admin"
                      : "/",
                    {
                      replace: true,
                    }
                  );

                } catch (err: any) {
                  setError(
                    err.message ||
                      "Đăng nhập Google thất bại"
                  );
                } finally {
                  setLoading(false);
                }
              }}
              onError={() => {
                setError(
                  "Đăng nhập Google thất bại"
                );
              }}
            />
          </div>
        </div>

        <Link
          to="/register"
          className="register"
        >
          Đăng ký tài khoản
        </Link>
      </div>
    </div>
  );
};

export default Login;