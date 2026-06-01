import { useEffect, useState } from "react";
import styles from "./ResetPassword.module.css";

import {
  initMyPasswordReset,
  verifyMyPasswordResetOtp,
  completeMyPasswordReset,
} from "../../../../services/resetPasswordApi";
import { useAuth } from "../../../auth/hooks/useAuth";

const OTP_TIME = 5 * 60 * 1000;
const STORAGE_KEY = "profile_password_otp_expire";
const OTP_INCORRECT_MESSAGE = "OTP không đúng";

export default function ResetPassword() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const email = user?.email || "";

  const formatTime = (ms: number) => {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;

    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getErrorMessage = (err: any, fallback: string) => {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      fallback;

    return String(message).toLowerCase().includes("otp not found")
      ? OTP_INCORRECT_MESSAGE
      : message;
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setMessage({ text: "", type: "" });
  };

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const expireTime = Date.now() + OTP_TIME;
      localStorage.setItem(STORAGE_KEY, String(expireTime));

      setOtp("");
      setStep(2);

      await initMyPasswordReset();
    } catch (err) {
      setMessage({
        text: getErrorMessage(err, "Không thể gửi OTP"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const res = await verifyMyPasswordResetOtp(otp.trim());
      setResetToken(res?.result);

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

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({
        text: "Mật khẩu không khớp",
        type: "error",
      });
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

      setMessage({
        text: "Đổi mật khẩu thành công",
        type: "success",
      });
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
        setMessage({
          text: "OTP đã hết hạn",
          type: "error",
        });
        return;
      }

      setTimeLeft(diff);
    };

    updateTimer();

    const interval = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(interval);
  }, [step]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Đổi mật khẩu</h2>

      {message.text && (
        <p
          className={styles.message}
          style={{
            color: message.type === "success" ? "#22c55e" : "#ef4444",
          }}
        >
          {message.text}
        </p>
      )}

      {step === 1 && (
        <div className={styles.box}>
          <label className={styles.label}>Email nhận OTP</label>
          <input
            className={`${styles.input} ${styles.readonly}`}
            value={email}
            readOnly
          />

          <button
            className={styles.button}
            onClick={handleSendEmail}
            disabled={loading || !email}
          >
            Gửi OTP
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={styles.box}>
          <input
            className={styles.input}
            placeholder="Nhập OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />

          <p className={styles.timer}>
            OTP hết hạn sau: <b>{formatTime(timeLeft)}</b>
          </p>

          <button
            className={styles.button}
            onClick={handleVerifyOtp}
            disabled={loading || timeLeft <= 0 || otp.length !== 6}
          >
            Xác minh
          </button>

          <button className={styles.backButton} onClick={handleBack}>
            Quay lại
          </button>
        </div>
      )}

      {step === 3 && (
        <div className={styles.box}>
          <input
            className={styles.input}
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            className={styles.button}
            onClick={handleResetPassword}
            disabled={loading || !resetToken || !newPassword}
          >
            Đổi mật khẩu
          </button>

          <button className={styles.backButton} onClick={handleBack}>
            Quay lại
          </button>
        </div>
      )}
    </div>
  );
}
