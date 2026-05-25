import { useEffect, useState } from "react";
import { CheckCircle2, KeyRound, Mail, RotateCcw } from "lucide-react";

import {
  completeMyPasswordReset,
  initMyPasswordReset,
  verifyMyPasswordResetOtp,
} from "../../../../services/resetPasswordApi";
import { useAuth } from "../../../auth/hooks/useAuth";
import "./AdminChangePassword.css";

const OTP_TIME = 5 * 60 * 1000;
const STORAGE_KEY = "admin_password_otp_expire";

const getErrorMessage = (err: any, fallback: string) => {
  const message =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback;

  return String(message).toLowerCase().includes("otp not found")
    ? "OTP không đúng"
    : message;
};

const formatTime = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function AdminChangePassword() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });

  const email = user?.email || "";

  const sendOtp = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });
      setOtp("");

      const expireTime = Date.now() + OTP_TIME;
      localStorage.setItem(STORAGE_KEY, String(expireTime));

      await initMyPasswordReset();
      setStep(2);
    } catch (err) {
      setMessage({
        text: getErrorMessage(err, "Không thể gửi OTP"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const res = await verifyMyPasswordResetOtp(otp.trim());
      setResetToken(res?.result || "");
      setStep(3);
    } catch (err) {
      setMessage({
        text: getErrorMessage(err, "OTP không hợp lệ"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Mật khẩu không khớp", type: "error" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      await completeMyPasswordReset(resetToken, newPassword);

      localStorage.removeItem(STORAGE_KEY);
      setOtp("");
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
      setStep(1);
      setMessage({ text: "Đổi mật khẩu thành công", type: "success" });
    } catch (err) {
      setMessage({
        text: getErrorMessage(err, "Không thể đổi mật khẩu"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step !== 2) return;

    const updateTimer = () => {
      const expireTime = Number(localStorage.getItem(STORAGE_KEY));

      if (!expireTime) return;

      const diff = expireTime - Date.now();

      if (diff <= 0) {
        setTimeLeft(0);
        setMessage({ text: "OTP đã hết hạn", type: "error" });
        return;
      }

      setTimeLeft(diff);
    };

    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(interval);
  }, [step]);

  return (
    <div className="admin-password">
      <div className="admin-password__header">
        <div>
          <span>Bảo mật tài khoản</span>
          <h1>Đổi mật khẩu</h1>
        </div>
      </div>

      <section className="admin-password__panel">
        {message.text && (
          <p className={`admin-password__message admin-password__message--${message.type}`}>
            {message.text}
          </p>
        )}

        {step === 1 && (
          <div className="admin-password__form">
            <label>
              Email nhận OTP
              <input value={email} readOnly />
            </label>
            <button type="button" onClick={sendOtp} disabled={loading || !email}>
              <Mail size={17} />
              {loading ? "Đang gửi..." : "Gửi OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="admin-password__form">
            <label>
              OTP
              <input
                value={otp}
                maxLength={6}
                inputMode="numeric"
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
              />
            </label>
            <div className="admin-password__timer">Còn lại {formatTime(timeLeft)}</div>
            <button
              type="button"
              onClick={verifyOtp}
              disabled={loading || timeLeft <= 0 || otp.length !== 6}
            >
              <CheckCircle2 size={17} />
              {loading ? "Đang xác minh..." : "Xác minh"}
            </button>
            <button
              type="button"
              className="admin-password__secondary"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              <RotateCcw size={16} />
              Quay lại
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="admin-password__form">
            <label>
              Mật khẩu mới
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </label>
            <label>
              Nhập lại mật khẩu
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>
            <button
              type="button"
              onClick={resetPassword}
              disabled={loading || !resetToken || !newPassword}
            >
              <KeyRound size={17} />
              {loading ? "Đang lưu..." : "Đổi mật khẩu"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
