import { calculateAge, normalizeDob } from "./profileUtils";

// ================= EMAIL =================
export const isValidEmail = (email: string) => {
  if (!email) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ================= PHONE VN =================
export const isValidPhoneVN = (phone: string) => {
  if (!phone) return false;

  return /^(0|\+84)[0-9]{9,10}$/.test(phone);
};

// ================= NAME =================
export const isValidName = (name: string) => {
  return !!name?.trim();
};

// ================= DOB =================
export const isValidDOB = (dob: any) => {
  if (!dob) return { ok: false, message: "Vui lòng nhập ngày sinh" };

  const date = new Date(normalizeDob(dob));

  if (isNaN(date.getTime())) {
    return { ok: false, message: "Ngày sinh không hợp lệ" };
  }

  if (date > new Date()) {
    return { ok: false, message: "Ngày sinh không được lớn hơn hôm nay" };
  }

  const age = calculateAge(normalizeDob(dob));

  if (age < 15) {
    return { ok: false, message: "Bạn phải từ 15 tuổi trở lên" };
  }

  return { ok: true, message: "" };
};