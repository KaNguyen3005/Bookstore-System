import { useOutletContext } from "react-router-dom";
import { useState, useRef } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import styles from "./ProfileContent.module.css";

export default function ProfileContent() {
  const {
    user,
    edit,
    setEdit,
    avatar,
    handleAvatar,
    handleChange,
    handleSave,
  }: any = useOutletContext();

  const [showPhone, setShowPhone] = useState(false);
  const [showDob, setShowDob] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return <p>Loading...</p>;

  // ================= DOB SAFE NORMALIZE =================
  const normalizeDob = (dob: any): string => {
    if (!dob) return "";

    if (typeof dob === "string") {
      return dob.includes("T") ? dob.split("T")[0] : dob;
    }

    if (dob instanceof Date) {
      return dob.toISOString().split("T")[0];
    }

    if (typeof dob === "number") {
      return new Date(dob).toISOString().split("T")[0];
    }

    return "";
  };

  // ================= DISPLAY DATE =================
  const toDisplayDate = (dob: any) => {
    const safe = normalizeDob(dob);
    if (!safe) return "";

    const [y, m, d] = safe.split("-");
    if (!y || !m || !d) return safe;

    return `${d}/${m}/${y}`;
  };

  // ================= VALIDATE =================
  const validate = () => {
    const err: any = {};

    if (!user.name) err.name = "Vui lòng nhập họ tên";
    if (!user.email) err.email = "Vui lòng nhập email";
    if (!user.phone) err.phone = "Vui lòng nhập số điện thoại";

    if (!user.dob) {
      err.dob = "Vui lòng nhập ngày sinh";
    } else {
      const dob = new Date(user.dob);
      const today = new Date();

      if (dob > today) {
        err.dob = "Ngày sinh không hợp lệ";
      }

      const age = today.getFullYear() - dob.getFullYear();
      if (age < 15) {
        err.dob = "Bạn phải từ 15 tuổi trở lên";
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ================= SAVE =================
  const handleSaveClick = async () => {
    const payload = {
      name: user.name,
      phone: user.phone,
      gender: user.gender,
      dob: normalizeDob(user.dob), // YYYY-MM-DD
      username: user.username,
      password: undefined, // optional
      status: user.status ?? true,
      avatar: avatar || user.avatarUrl,
    };

    // remove undefined fields (IMPORTANT)
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    await handleSave(payload);
    setEdit(false);
  };

  const handleCancel = () => {
    setEdit(false);
    setErrors({});
    setShowPhone(false);
    setShowDob(false);
  };

  const handleClickAvatar = () => {
    fileInputRef.current?.click();
  };

  // ================= MASK PHONE =================
  const maskPhoneVN = (phone: any = "") => {
    const str = String(phone || "");
    if (!str) return "";

    const clean = str.replace(/\s+/g, "");
    if (clean.length < 7) return str;

    return (
      clean.slice(0, 3) +
      "*".repeat(clean.length - 6) +
      clean.slice(-3)
    );
  };

  return (
    <>
      <h2 className={styles.title}>Hồ sơ cá nhân</h2>

      <div className={styles.profileContainer}>
        {/* ================= AVATAR ================= */}
        <div className={styles.avatarSection}>
          <div
            className={styles.avatarWrapper}
            onClick={handleClickAvatar}
          >
            <img
              src={avatar || user.avatarUrl || "/default-avatar.png"}
              className={styles.avatar}
              alt="avatar"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatar}
            hidden
          />

          <p className={styles.username}>{user.username}</p>
        </div>

        {/* ================= FORM ================= */}
        <div className={styles.formSection}>
          {/* USERNAME */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Tên đăng nhập</label>
            <input
              value={user.username || ""}
              readOnly
              className={`${styles.input} ${styles.readonly}`}
            />
          </div>

          {/* NAME */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Họ và tên</label>

            <input
              name="name"
              value={user.name || ""}
              onChange={handleChange}
              readOnly={!edit}
              className={`${styles.input} ${
                !edit ? styles.readonly : ""
              } ${errors.name ? styles.errorInput : ""}`}
            />

            {errors.name && (
              <span className={styles.errorText}>{errors.name}</span>
            )}
          </div>

          {/* PHONE */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Số điện thoại</label>

            <div className={styles.inputWrapper}>
              <input
                name="phone"
                value={
                  edit
                    ? user.phone || ""
                    : showPhone
                    ? user.phone || ""
                    : maskPhoneVN(user.phone)
                }
                onChange={handleChange}
                readOnly={!edit}
                className={`${styles.input} ${
                  !edit ? styles.readonly : ""
                } ${errors.phone ? styles.errorInput : ""}`}
              />

              <span
                onClick={() => !edit && setShowPhone(!showPhone)}
                className={styles.eyeIcon}
              >
                {showPhone ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>

            {errors.phone && (
              <span className={styles.errorText}>{errors.phone}</span>
            )}
          </div>

          {/* EMAIL */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Email</label>

            <input
              name="email"
              value={user.email || ""}
              onChange={handleChange}
              readOnly={!edit}
              className={`${styles.input} ${
                !edit ? styles.readonly : ""
              } ${errors.email ? styles.errorInput : ""}`}
            />

            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          {/* DOB */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Ngày sinh</label>

            <div className={styles.inputWrapper}>
              <input
                name="dob"
                type={edit ? "date" : "text"}
                value={
                  edit
                    ? normalizeDob(user.dob)
                    : toDisplayDate(user.dob)
                }
                max={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                readOnly={!edit}
                className={`${styles.input} ${
                  !edit ? styles.readonly : ""
                } ${errors.dob ? styles.errorInput : ""}`}
              />

              <span
                onClick={() => !edit && setShowDob(!showDob)}
                className={styles.eyeIcon}
              >
                {showDob ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>

            {errors.dob && (
              <span className={styles.errorText}>{errors.dob}</span>
            )}
          </div>
        </div>
      </div>

      {/* ================= BUTTON ================= */}
      <div className={styles.buttonWrapper}>
        <button
          className={styles.cancelBtn}
          onClick={() => {
            if (edit) handleCancel();
            else setEdit(true);
          }}
        >
          {edit ? "Hủy" : "Sửa"}
        </button>

        {edit && (
          <button
            className={styles.saveBtn}
            onClick={handleSaveClick}
          >
            Lưu
          </button>
        )}
      </div>

      {/* ================= MEMBER ================= */}
      <div className={styles.member}>
        <h3 className={styles.memberTitle}>Hạng thành viên</h3>

        <div className={styles.memberItem}>
          <span>Hạng:</span>
          <b>{user.tier || "BRONZE"}</b>
        </div>

        <div className={styles.memberItem}>
          <span>Điểm:</span>
          <b>{user.point || 0}</b>
        </div>
      </div>
    </>
  );
}