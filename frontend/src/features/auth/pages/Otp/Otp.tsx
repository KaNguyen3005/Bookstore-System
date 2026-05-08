import "./otp.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../../services/authApi";

const OTP = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 5 PHÚT = 300 giây
  const [timeLeft, setTimeLeft] = useState(300);

  const email = sessionStorage.getItem("registerEmail");

  const registerPayload = JSON.parse(
    sessionStorage.getItem("registerPayload") || "{}"
  );

  //  COUNTDOWN
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // format mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (!email) return setError("Không tìm thấy email đăng ký");
    if (!otp.trim()) return setError("Vui lòng nhập OTP");

    if (timeLeft <= 0) {
      return setError("Mã OTP đã hết hạn");
    }

    setLoading(true);

    try {
      const verifyRes: any = await authApi.verifyOtp({
        email,
        otp,
      });

      const verifyData = verifyRes?.data ?? verifyRes;

      if (verifyData?.code !== 0) {
        throw new Error(verifyData?.message || "OTP không hợp lệ");
      }

      const completeRes: any = await authApi.registerComplete({
        ...registerPayload,
      });

      const completeData = completeRes?.data ?? completeRes;

      if (completeData?.code !== 0) {
        throw new Error(completeData?.message || "Register failed");
      }

      sessionStorage.removeItem("registerEmail");
      sessionStorage.removeItem("registerPayload");

      navigate("/login");

    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "OTP không hợp lệ"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-container">

        <h1 className="logo-otp">KATIIA BOOKSTORE</h1>
        <p className="subtitle">Nhập mã xác nhận</p>

        {/* TIMER UI */}

        <form className="otp-form" onSubmit={handleSubmit}>

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Mã OTP"
            disabled={timeLeft <= 0}
          />

        <div className="otp-timer">
          ⏱ Thời gian còn lại:{" "}
          <span style={{ color: timeLeft < 60 ? "red" : "green" }}>
            {formatTime(timeLeft)}
          </span>
        </div>

        {timeLeft <= 0 && (
          <p style={{ color: "red" }}>
            OTP đã hết hạn, vui lòng gửi lại mã
          </p>
        )}

          {error && <p className="error-text">{error}</p>}

          <button disabled={loading || timeLeft <= 0}>
            {loading ? "Đang xác nhận..." : "Xác nhận"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default OTP;