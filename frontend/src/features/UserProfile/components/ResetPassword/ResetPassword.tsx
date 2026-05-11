import { useState } from "react";
import styles from "./ResetPassword.module.css";

import {
  initResetPassword,
  verifyResetOtp,
  completeResetPassword,
} from "../../../../services/resetPasswordApi";

export default function ResetPassword() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      setMessage("");

      await initResetPassword(email);

      setStep(2);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Lỗi gửi email");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await verifyResetOtp(email, otp);
      setResetToken(res?.result);

      setStep(3);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "OTP không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu không khớp");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await completeResetPassword(resetToken, newPassword);

      setMessage("Đổi mật khẩu thành công ");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Lỗi đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Đổi mật khẩu</h2>

      {message && <p className={styles.message}>{message}</p>}

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
          <button
            className={styles.button}
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            Xác minh
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
        </div>
      )}
    </div>
  );
}