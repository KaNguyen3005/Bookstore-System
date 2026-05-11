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

  // ================= VALIDATE =================
  const validate = () => {
    const err: any = {};

    if (!user.name) err.name = "Vui lòng nhập họ tên";
    if (!user.email) err.email = "Vui lòng nhập email";
    if (!user.phone) err.phone = "Vui lòng nhập số điện thoại";
    if (!user.dob) err.dob = "Vui lòng nhập ngày sinh";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSaveClick = async () => {
    const ok = validate();
    if (!ok) return;

    await handleSave();
    setEdit(false);
  };

  const handleCancel = () => {
    setEdit(false);
    setErrors({});
    setShowPhone(false);
    setShowDob(false);
  };

  // ================= AVATAR =================
  const handleClickAvatar = () => {
    fileInputRef.current?.click();
  };

  // ================= MASK =================
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

  const formatDob = (dob: string = "") => {
    if (!dob) return "";

    try {
      return new Date(dob).toISOString().split("T")[0];
    } catch {
      return dob;
    }
  };

  const maskDate = (date: string = "") => {
    if (!date) return "";

    const parts = date.split("-");

    if (parts.length !== 3) return date;

    return `${parts[0]}/**/**`;
  };

  return (
    <>
      <h2 className={styles.title}>Hồ sơ cá nhân</h2>

      <div className="profile-container">

        {/* ================= AVATAR ================= */}
        <div className="avatar-section">
          <div className="avatar-wrapper" onClick={handleClickAvatar}>
            <img
              src={avatar || user.avatarUrl || "/default-avatar.png"}
              className="avatar"
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

          <p className={styles.username}>
            {user.username}
          </p>

        </div>

        {/* ================= FORM ================= */}
        <div className="form-section">

          {/* USERNAME */}
          <div className="form-row">
            <label>Tên đăng nhập</label>
            <div className="input-block">
              <input value={user.username || ""} readOnly />
            </div>

          </div>

          {/* NAME */}
          <div className="form-row">
            <label>Họ và tên</label>
            <div className="input-block">
              <input
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                readOnly={!edit}
                className={errors.name ? "error-input" : ""}
              />
              <div className="error-space">
                {errors.name && (
                  <span className="error-text">{errors.name}</span>
                )}
              </div>

            </div>

          </div>

          {/* PHONE */}
          <div className="form-row">
            <label>Số điện thoại</label>

            <div className="input-block">
              <div style={{ position: "relative" }}>
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
                  className={errors.phone ? "error-input" : ""}
                />

                <span
                  onClick={() => !edit && setShowPhone(!showPhone)}
                  className="eye-icon"
                >
                  {showPhone ? (
                    <FaRegEyeSlash />
                  ) : (
                    <FaRegEye />
                  )}
                </span>

              </div>

              <div className="error-space">
                {errors.phone && (
                  <span className="error-text">{errors.phone}</span>
                )}
              </div>

            </div>

          </div>

          {/* EMAIL */}
          <div className="form-row">
            <label>Email</label>
            <div className="input-block">
              <input
                name="email"
                value={user.email || ""}
                onChange={handleChange}
                readOnly={!edit}
                className={errors.email ? "error-input" : ""}
              />
              <div className="error-space">
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

            </div>

          </div>

          {/* DOB */}
          <div className="form-row">
            <label>Ngày sinh</label>

            <div className="input-block">
              <div style={{ position: "relative" }}>
                <input
                  name="dob"
                  value={
                    edit
                      ? formatDob(user.dob)
                      : showDob
                      ? formatDob(user.dob)
                      : maskDate(formatDob(user.dob))
                  }
                  onChange={handleChange}
                  readOnly={!edit}
                  className={errors.dob ? "error-input" : ""}
                />

                <span
                  onClick={() => !edit && setShowDob(!showDob)}
                  className="eye-icon"
                >
                  {showDob ? (
                    <FaRegEyeSlash />
                  ) : (
                    <FaRegEye />
                  )}
                </span>

              </div>

              <div className="error-space">
                {errors.dob && (
                  <span className="error-text">{errors.dob}</span>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= BUTTONS ================= */}
      <div className="button-wrapper">
        <div className="btn-group">
        <button
          className="cancel-btn"
          onClick={() => {
            if (edit) {
              handleCancel();
            } else {
              setEdit(true);
            }
          }}
        >
          {edit ? "Hủy" : "Sửa"}
        </button>

          {edit && (
            <button className="save-btn" onClick={handleSaveClick}>
              Lưu
            </button>
          )}

        </div>

      </div>

      {/* ================= MEMBER ================= */}
      <div className="member">
        <h3>Hạng thành viên</h3>

        <div className="member-item">
          <span className="label">Hạng:</span>
          <span className="value">{user.tier || "BRONZE"}</span>
        </div>

        <div className="member-item">
          <span className="label">Điểm tích lũy:</span>
          <span className="value">{user.point || 0}</span>
        </div>

      </div>
    </>
  );
}