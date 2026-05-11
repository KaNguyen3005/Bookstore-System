import axiosClient from "./axiosClient";

/**
 * Bước 1: Kiểm tra email tồn tại
 */
export const initResetPassword = async (email: string) => {
  const res = await axiosClient.post("/api/v1/auth/reset-password/init", {
    email,
  });

  return res.data;
};

/**
 * Bước 2: Xác minh OTP
 */
export const verifyResetOtp = async (email: string, otp: string) => {
  const res = await axiosClient.post("/api/v1/auth/reset-password/verify", {
    email,
    otp,
  });

  return res.data;
};

/**
 * Bước 3: Hoàn thành reset mật khẩu
 */
export const completeResetPassword = async (
  resetToken: string,
  newPassword: string
) => {
  const res = await axiosClient.post("/api/v1/auth/reset-password/complete", {
    resetToken,
    newPassword,
  });

  return res.data;
};