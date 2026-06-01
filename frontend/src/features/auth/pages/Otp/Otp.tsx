import "./otp.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../../services/authApi";

const OTP_DURATION = 300;
const OTP_INCORRECT_MESSAGE = "OTP không đúng";

const getOtpErrorMessage = (err: any, fallback = OTP_INCORRECT_MESSAGE) => {
  const message =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback;

  return String(message).toLowerCase().includes("otp not found")
    ? OTP_INCORRECT_MESSAGE
    : message;
};

const OTP = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [sendStatus, setSendStatus] = useState(
    sessionStorage.getItem("registerOtpStatus") || ""
  );

  const email = sessionStorage.getItem("registerEmail");
  const registerPayload = useMemo(
    () => JSON.parse(sessionStorage.getItem("registerPayload") || "{}"),
    []
  );

  useEffect(() => {
    let otpExpireTime = sessionStorage.getItem("otpExpireTime");

    if (!otpExpireTime) {
      otpExpireTime = String(Date.now() + OTP_DURATION * 1000);
      sessionStorage.setItem("otpExpireTime", otpExpireTime);
    }

    const updateTimer = () => {
      const remain = Math.floor((Number(otpExpireTime) - Date.now()) / 1000);
      setTimeLeft(remain > 0 ? remain : 0);
    };

    updateTimer();

    const timer = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateOtpStatus = () => {
      const status = sessionStorage.getItem("registerOtpStatus") || "";
      const sendError = sessionStorage.getItem("registerOtpError") || "";

      setSendStatus(status);

      if (status === "error" && sendError) {
        setError(getOtpErrorMessage({ message: sendError }));
      }
    };

    updateOtpStatus();

    const timer = window.setInterval(updateOtpStatus, 500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;

    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (!email) {
      setError("Không tìm thấy email đăng ký");
      return;
    }

    if (!otp.trim()) {
      setError("Vui lòng nhập OTP");
      return;
    }

    if (timeLeft <= 0) {
      setError("Mã OTP đã hết hạn");
      return;
    }

    setLoading(true);

    try {
      const verifyRes: any = await authApi.verifyOtp({
        email,
        otp,
      });

      const verifyData = verifyRes?.data ?? verifyRes;

      if (verifyData?.code !== 0) {
        throw new Error(verifyData?.message || OTP_INCORRECT_MESSAGE);
      }

      await authApi.registerComplete({
        ...registerPayload,
        otp,
      });

      sessionStorage.removeItem("registerEmail");
      sessionStorage.removeItem("registerPayload");
      sessionStorage.removeItem("otpExpireTime");
      sessionStorage.removeItem("registerOtpStatus");
      sessionStorage.removeItem("registerOtpError");

      navigate("/login");
    } catch (err: any) {
      setError(getOtpErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError("Không tìm thấy email");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await authApi.sendOtp(email);

      const newExpire = Date.now() + OTP_DURATION * 1000;
      sessionStorage.setItem("otpExpireTime", String(newExpire));
      sessionStorage.setItem("registerOtpStatus", "sent");
      sessionStorage.removeItem("registerOtpError");

      setSendStatus("sent");
      setTimeLeft(OTP_DURATION);
      setOtp("");
    } catch (err: any) {
      setError(getOtpErrorMessage(err, "Gửi lại OTP thất bại"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-container">
        <h1 className="logo-otp">KATIIA BOOKSTORE</h1>

        <p className="subtitle">Nhập mã xác nhận</p>

        <form className="otp-form" onSubmit={handleSubmit}>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Mã OTP"
            disabled={timeLeft <= 0}
          />

          <div className="otp-timer">
            Thời gian còn lại:{" "}
            <span style={{ color: timeLeft < 60 ? "red" : "green" }}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {sendStatus === "pending" && (
            <p className="otp-timer">Đang gửi OTP đến email của bạn...</p>
          )}

          {timeLeft <= 0 && (
            <div className="otp-expired">
              <p style={{ color: "red" }}>
                OTP đã hết hạn, vui lòng gửi lại mã
              </p>

              <button
                type="button"
                className="resend-btn"
                onClick={handleResendOtp}
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Gửi lại OTP"}
              </button>
            </div>
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
