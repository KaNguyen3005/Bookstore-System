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
import { userApi } from "../../../../services/userApi";
import type { User } from "../../context/AuthContext";

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

  const getAdminStartPath = (role?: string) => {
    const normalizedRole = normalizeRole(role);

    if (normalizedRole === "ADMIN") return "/admin";
    if (normalizedRole === "STAFF") return "/admin/products";

    return "/";
  };

  const isInactiveAccount = (value?: boolean) => value === false;

  const normalizeErrorMessage = (value?: string) =>
    String(value ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const isInactiveAccountMessage = (value?: string) => {
    const message = normalizeErrorMessage(value);

    return [
      "inactive",
      "disabled",
      "disable",
      "locked",
      "blocked",
      "ngung hoat dong",
      "vo hieu hoa",
      "khoa",
    ].some((keyword) => message.includes(keyword));
  };

  const getLoginErrorMessage = (value?: string) => {
    if (isInactiveAccountMessage(value)) {
      return "Tài khoản này đã ngừng hoạt động";
    }

    const mapError: Record<string, string> = {
      "Invalid credentials": "Sai tài khoản hoặc mật khẩu",
      "Login failed": "Sai tài khoản hoặc mật khẩu",
      "Token not found": "Sai tài khoản hoặc mật khẩu",
      "Account disabled": "Tài khoản này đã ngừng hoạt động",
    };

    return mapError[value ?? ""] || "Sai tài khoản hoặc mật khẩu";
  };

  const toAuthUser = (fullUser: NonNullable<Awaited<ReturnType<typeof userApi.getMe>>>, token: string): User => ({
    userId: fullUser.userId,
    email: fullUser.email || "",
    phone: fullUser.phone || "",
    username: fullUser.username || "",
    name: fullUser.name || "",
    role: fullUser.role || "",
    avatarUrl: fullUser.avatarUrl,
    token,
  });

  // đã login -> redirect luôn
const hasToken = !!localStorage.getItem("access_token");

if (hasToken && user) {
  const role = normalizeRole(user.role);

  return (
    <Navigate
      to={getAdminStartPath(role)}
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
      // 1. login chỉ lấy token + role
      const loginRes = await authApi.login({
        account,
        password,
      });

      if (!loginRes) {
        throw new Error("Invalid credentials");
      }

      // 2. lưu token
      localStorage.setItem("access_token", loginRes.token);

      // 3. lấy FULL user (quan trọng nhất)
      const fullUser = await userApi.getMe();

      if (!fullUser) {
        throw new Error("Cannot fetch user");
      }

      if (isInactiveAccount(fullUser.status)) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        throw new Error("Account disabled");
      }

      // 4. update auth context
      login(toAuthUser(fullUser, loginRes.token));

      const role = normalizeRole(fullUser.role);

      navigate(
        role === "ADMIN" || role === "STAFF"
          ? getAdminStartPath(role)
          : from,
        { replace: true }
      );
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);

      const msg = error?.message;

      setAccountError(true);
      setPasswordError(true);

      setError(getLoginErrorMessage(msg));
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
            <Link to="/forgot-password" className="forgot">
              Quên mật khẩu
            </Link>
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

                  const idToken = credentialResponse.credential;

                  if (!idToken) throw new Error("Google token missing");

                  const loginRes = await authApi.googleLogin(idToken);

                  localStorage.setItem("access_token", loginRes.token);

                  const fullUser = await userApi.getMe();

                  if (!fullUser) {
                    throw new Error("Cannot fetch user");
                  }

                  if (isInactiveAccount(fullUser.status)) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    throw new Error("Tài khoản này đã ngừng hoạt động");
                  }

                  login(toAuthUser(fullUser, loginRes.token));

                  const role = normalizeRole(fullUser.role);

                  navigate(getAdminStartPath(role), {
                    replace: true,
                  });
                } catch (err: any) {
                  setError(err.message || "Đăng nhập Google thất bại");
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
