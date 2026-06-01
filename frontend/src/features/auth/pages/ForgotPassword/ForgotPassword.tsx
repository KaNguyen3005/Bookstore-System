import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  completeResetPassword,
  initResetPassword,
  verifyResetOtp,
} from "../../../../services/resetPasswordApi";

import logo from "../../../../assets/images/logo-auth.png";
import "./ForgotPassword.css";

const OTP_TIME = 5 * 60 * 1000;
const STORAGE_KEY = "forgot_password_otp_expire";
const OTP_INCORRECT_MESSAGE = "OTP không đúng";

const getErrorMessage = (error: any, fallback: string) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;

  return String(message).toLowerCase().includes("otp not found")
    ? OTP_INCORRECT_MESSAGE
    : message;
};

const formatTime = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const setError = (text: string) => {
    setMessage({ text, type: "error" });
  };

  const setSuccess = (text: string) => {
    setMessage({ text, type: "success" });
  };

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Vui lòng nhập email");
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const expireTime = Date.now() + OTP_TIME;
      localStorage.setItem(STORAGE_KEY, String(expireTime));

      setEmail(normalizedEmail);
      setOtp("");
      setStep(2);

      await initResetPassword(normalizedEmail);
      setSuccess("OTP đã được gửi đến email của bạn");
    } catch (error) {
      setError(getErrorMessage(error, "Không thể gửi OTP"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Vui lòng nhập OTP gồm 6 số");
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const response = await verifyResetOtp(email, otp);

      setResetToken(response?.result || "");
      setStep(3);
    } catch (error) {
      setError(getErrorMessage(error, "OTP không hợp lệ"));
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReset = async () => {
    if (!newPassword) {
      setError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      await completeResetPassword(resetToken, newPassword);

      localStorage.removeItem(STORAGE_KEY);
      setSuccess("Đặt lại mật khẩu thành công");

      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);
    } catch (error) {
      setError(getErrorMessage(error, "Không thể đặt lại mật khẩu"));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setMessage({ text: "", type: "" });
  };

  useEffect(() => {
    if (step !== 2) return;

    const updateTimer = () => {
      const expireTime = Number(localStorage.getItem(STORAGE_KEY));

      if (!expireTime) return;

      const diff = expireTime - Date.now();

      if (diff <= 0) {
        setTimeLeft(0);
        setError("OTP đã hết hạn");
        return;
      }

      setTimeLeft(diff);
    };

    updateTimer();

    const interval = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(interval);
  }, [step]);

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <img src={logo} alt="KATIIA BOOKSTORE" className="forgot-password-logo" />

        <h1>Quên mật khẩu</h1>

        {message.text && (
          <div
            className={
              message.type === "success"
                ? "forgot-password-message success"
                : "forgot-password-message error"
            }
          >
            {message.text}
          </div>
        )}

        {step === 1 && (
          <div className="forgot-password-form">
            <input
              type="email"
              placeholder="Email tài khoản"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <button type="button" onClick={handleSendOtp} disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="forgot-password-form">
            <input
              type="text"
              placeholder="Nhập OTP"
              value={otp}
              maxLength={6}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
            />

            <p className="forgot-password-timer">
              OTP hết hạn sau: <strong>{formatTime(timeLeft)}</strong>
            </p>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading || timeLeft <= 0 || otp.length !== 6}
            >
              {loading ? "Đang xác minh..." : "Xác minh"}
            </button>

            <button type="button" className="ghost-button" onClick={handleBack}>
              Quay lại
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="forgot-password-form">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />

            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />

            <button
              type="button"
              onClick={handleCompleteReset}
              disabled={loading || !resetToken}
            >
              {loading ? "Đang lưu..." : "Đặt lại mật khẩu"}
            </button>

            <button type="button" className="ghost-button" onClick={handleBack}>
              Quay lại
            </button>
          </div>
        )}

        <Link to="/login" className="forgot-password-link">
          Quay về đăng nhập
        </Link>
      </div>
    </div>
  );
}
