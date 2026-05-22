import { useEffect, useState } from "react";
import styles from "./ResetPassword.module.css";

import {
  initResetPassword,
  verifyResetOtp,
  completeResetPassword,
} from "../../../../services/resetPasswordApi";

const OTP_TIME = 5 * 60 * 1000; // 5 phút
const STORAGE_KEY = "reset_password_otp_expire";

export default function ResetPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
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

  // FORMAT TIME
  const formatTime = (ms) => {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // BACK STEP
  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setMessage({ text: "", type: "" });
  };

  // SEND EMAIL
  const handleSendEmail = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      await initResetPassword(email);

      // set expire time (5 phút)
      const expireTime = Date.now() + OTP_TIME;
      localStorage.setItem(STORAGE_KEY, expireTime);

      setStep(2);
    } catch (err) {
      setMessage({
        text: err?.response?.data?.message || "Lỗi gửi email",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const res = await verifyResetOtp(email, otp);
      setResetToken(res?.result);

      setStep(3);
    } catch (err) {
      setMessage({
        text: err?.response?.data?.message || "OTP không hợp lệ",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
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

      await completeResetPassword(resetToken, newPassword);

      localStorage.removeItem(STORAGE_KEY);

      setMessage({
        text: "Đổi mật khẩu thành công 🎉",
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: err?.response?.data?.message || "Lỗi đặt lại mật khẩu",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // TIMER (F5 KHÔNG MẤT)
  useEffect(() => {
    if (step !== 2) return;

    const interval = setInterval(() => {
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
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Đổi mật khẩu</h2>

      {/* MESSAGE */}
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

      {/* STEP 1 */}
      {step === 1 && (
        <div className={styles.box}>
          <input
            className={styles.input}
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className={styles.button}
            onClick={handleSendEmail}
            disabled={loading}
          >
            Gửi OTP
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className={styles.box}>
          <input
            className={styles.input}
            placeholder="Nhập OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          {/* TIMER */}
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            OTP hết hạn sau: <b>{formatTime(timeLeft)}</b>
          </p>

          <button
            className={styles.button}
            onClick={handleVerifyOtp}
            disabled={loading || timeLeft <= 0}
          >
            Xác minh
          </button>

          <button className={styles.backButton} onClick={handleBack}>
            ← Quay lại
          </button>
        </div>
      )}

      {/* STEP 3 */}
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
            disabled={loading}
          >
            Đổi mật khẩu
          </button>

          <button className={styles.backButton} onClick={handleBack}>
            ← Quay lại
          </button>
        </div>
      )}
    </div>
  );
}