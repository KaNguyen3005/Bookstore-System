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

      {/* ================= PROFILE ================= */}
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

          <p className={styles.username}>
            {user.username}
          </p>

        </div>

        {/* ================= FORM ================= */}
        <div className={styles.formSection}>

          {/* USERNAME */}
          <div className={styles.formRow}>

            <label className={styles.formLabel}>
              Tên đăng nhập
            </label>

            <div className={styles.inputBlock}>
              <input
                value={user.username || ""}
                readOnly
                className={`${styles.input} ${styles.readonly}`}
              />
            </div>

          </div>

          {/* NAME */}
          <div className={styles.formRow}>

            <label className={styles.formLabel}>
              Họ và tên
            </label>

            <div className={styles.inputBlock}>

              <input
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                readOnly={!edit}
                className={`
                  ${styles.input}
                  ${!edit ? styles.readonly : ""}
                  ${errors.name ? styles.errorInput : ""}
                `}
              />

              <div className={styles.errorSpace}>
                {errors.name && (
                  <span className={styles.errorText}>
                    {errors.name}
                  </span>
                )}
              </div>

            </div>

          </div>

          {/* PHONE */}
          <div className={styles.formRow}>

            <label className={styles.formLabel}>
              Số điện thoại
            </label>

            <div className={styles.inputBlock}>

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
                  className={`
                    ${styles.input}
                    ${!edit ? styles.readonly : ""}
                    ${errors.phone ? styles.errorInput : ""}
                  `}
                />

                <span
                  onClick={() => !edit && setShowPhone(!showPhone)}
                  className={styles.eyeIcon}
                >
                  {showPhone ? (
                    <FaRegEyeSlash />
                  ) : (
                    <FaRegEye />
                  )}
                </span>

              </div>

              <div className={styles.errorSpace}>
                {errors.phone && (
                  <span className={styles.errorText}>
                    {errors.phone}
                  </span>
                )}
              </div>

            </div>

          </div>

          {/* EMAIL */}
          <div className={styles.formRow}>

            <label className={styles.formLabel}>
              Email
            </label>

            <div className={styles.inputBlock}>

              <input
                name="email"
                value={user.email || ""}
                onChange={handleChange}
                readOnly={!edit}
                className={`
                  ${styles.input}
                  ${!edit ? styles.readonly : ""}
                  ${errors.email ? styles.errorInput : ""}
                `}
              />

              <div className={styles.errorSpace}>
                {errors.email && (
                  <span className={styles.errorText}>
                    {errors.email}
                  </span>
                )}
              </div>

            </div>

          </div>

          {/* DOB */}
          <div className={styles.formRow}>

            <label className={styles.formLabel}>
              Ngày sinh
            </label>

            <div className={styles.inputBlock}>

              <div className={styles.inputWrapper}>

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
                  className={`
                    ${styles.input}
                    ${!edit ? styles.readonly : ""}
                    ${errors.dob ? styles.errorInput : ""}
                  `}
                />

                <span
                  onClick={() => !edit && setShowDob(!showDob)}
                  className={styles.eyeIcon}
                >
                  {showDob ? (
                    <FaRegEyeSlash />
                  ) : (
                    <FaRegEye />
                  )}
                </span>

              </div>

              <div className={styles.errorSpace}>
                {errors.dob && (
                  <span className={styles.errorText}>
                    {errors.dob}
                  </span>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= BUTTON ================= */}
      <div className={styles.buttonWrapper}>

        <div className={styles.btnGroup}>

          <button
            className={styles.cancelBtn}
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
            <button
              className={styles.saveBtn}
              onClick={handleSaveClick}
            >
              Lưu
            </button>
          )}

        </div>

      </div>

      {/* ================= MEMBER ================= */}
      <div className={styles.member}>

        <h3 className={styles.memberTitle}>
          Hạng thành viên
        </h3>

        <div className={styles.memberItem}>
          <span className={styles.label}>Hạng:</span>

          <span className={styles.value}>
            {user.tier || "BRONZE"}
          </span>
        </div>

        <div className={styles.memberItem}>
          <span className={styles.label}>
            Điểm tích lũy:
          </span>

          <span className={styles.value}>
            {user.point || 0}
          </span>
        </div>

      </div>
    </>
  );
}