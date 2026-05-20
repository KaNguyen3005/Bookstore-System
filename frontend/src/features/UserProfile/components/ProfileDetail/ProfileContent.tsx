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
  const [errors, setErrors] = useState<any>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return <p>Loading...</p>;

  // ================= DOB SAFE NORMALIZE =================
  const normalizeDob = (dob: any): string => {
    if (!dob) return "";

    // already yyyy-mm-dd
    if (typeof dob === "string") {
      return dob.includes("T")
        ? dob.split("T")[0]
        : dob;
    }

    // Date object
    if (dob instanceof Date) {
      return dob.toISOString().split("T")[0];
    }

    // timestamp
    if (typeof dob === "number") {
      return new Date(dob)
        .toISOString()
        .split("T")[0];
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

  // ================= AGE =================
  const calculateAge = (dobString: string) => {
    const today = new Date();
    const birth = new Date(dobString);

    let age =
      today.getFullYear() -
      birth.getFullYear();

    const monthDiff =
      today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // ================= VALIDATE =================
  const validate = () => {
    const err: any = {};

    // NAME
    if (!user.name?.trim()) {
      err.name = "Vui lòng nhập họ tên";
    }

    // PHONE
    if (!user.phone?.trim()) {
      err.phone = "Vui lòng nhập số điện thoại";
    } else if (
      !/^(0|\+84)[0-9]{9,10}$/.test(user.phone)
    ) {
      err.phone =
        "Số điện thoại không hợp lệ";
    }

    // EMAIL
    if (!user.email?.trim()) {
      err.email = "Vui lòng nhập email";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        user.email
      )
    ) {
      err.email = "Email không hợp lệ";
    }

    // DOB
    if (!user.dob) {
      err.dob = "Vui lòng nhập ngày sinh";
    } else {
      const dob = new Date(user.dob);
      const today = new Date();

      if (isNaN(dob.getTime())) {
        err.dob =
          "Ngày sinh không hợp lệ";
      } else if (dob > today) {
        err.dob =
          "Ngày sinh không được lớn hơn hôm nay";
      } else {
        const age = calculateAge(
          normalizeDob(user.dob)
        );

        if (age < 15) {
          err.dob =
            "Bạn phải từ 15 tuổi trở lên";
        }
      }
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  // ================= SAVE =================
  const handleSaveClick = async () => {
    if (!validate()) return;

    try {
      const payload: any = {
        username: user.username,
        name: user.name?.trim(),
        phone: user.phone?.trim(),
        gender: user.gender,
        dob: normalizeDob(user.dob),
        status: user.status ?? true,
        avatar:
          avatar || user.avatarUrl,
      };

      // remove undefined/null/""
      Object.keys(payload).forEach(
        (key) => {
          const k =
            key as keyof typeof payload;

          if (
            payload[k] === undefined ||
            payload[k] === null ||
            payload[k] === ""
          ) {
            delete payload[k];
          }
        }
      );

      console.log(
        "FINAL PAYLOAD",
        payload
      );

      await handleSave(payload);

      setEdit(false);
      setErrors({});
    } catch (error) {
      console.error(
        "Update profile failed:",
        error
      );
    }
  };

  // ================= CANCEL =================
  const handleCancel = () => {
    setEdit(false);
    setErrors({});
    setShowPhone(false);
  };

  // ================= AVATAR =================
  const handleClickAvatar = () => {
    fileInputRef.current?.click();
  };

  // ================= MASK PHONE =================
  const maskPhoneVN = (
    phone: any = ""
  ) => {
    const str = String(phone || "");

    if (!str) return "";

    const clean = str.replace(
      /\s+/g,
      ""
    );

    if (clean.length < 7) return str;

    return (
      clean.slice(0, 3) +
      "*".repeat(clean.length - 6) +
      clean.slice(-3)
    );
  };

  return (
    <>
      <h2 className={styles.title}>
        Hồ sơ cá nhân
      </h2>

      <div className={styles.profileContainer}>
        {/* ================= AVATAR ================= */}
        <div className={styles.avatarSection}>
          <div
            className={
              styles.avatarWrapper
            }
            onClick={handleClickAvatar}
          >
            <img
              src={
                avatar ||
                user.avatarUrl ||
                "/default-avatar.png"
              }
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
            <label
              className={styles.formLabel}
            >
              Tên đăng nhập
            </label>

            <input
              value={user.username || ""}
              readOnly
              className={`${styles.input} ${styles.readonly}`}
            />
          </div>

          {/* NAME */}
          <div className={styles.formRow}>
            <label
              className={styles.formLabel}
            >
              Họ và tên
            </label>

            <input
              name="name"
              value={user.name || ""}
              onChange={handleChange}
              readOnly={!edit}
              className={`${styles.input} ${
                !edit
                  ? styles.readonly
                  : ""
              } ${
                errors.name
                  ? styles.errorInput
                  : ""
              }`}
            />

            {errors.name && (
              <span
                className={
                  styles.errorText
                }
              >
                {errors.name}
              </span>
            )}
          </div>

          {/* PHONE */}
          <div className={styles.formRow}>
            <label
              className={styles.formLabel}
            >
              Số điện thoại
            </label>

            <div
              className={
                styles.inputWrapper
              }
            >
              <input
                name="phone"
                value={
                  edit
                    ? user.phone || ""
                    : showPhone
                    ? user.phone || ""
                    : maskPhoneVN(
                        user.phone
                      )
                }
                onChange={handleChange}
                readOnly={!edit}
                className={`${styles.input} ${
                  !edit
                    ? styles.readonly
                    : ""
                } ${
                  errors.phone
                    ? styles.errorInput
                    : ""
                }`}
              />

              {!edit && (
                <span
                  onClick={() =>
                    setShowPhone(
                      !showPhone
                    )
                  }
                  className={
                    styles.eyeIcon
                  }
                >
                  {showPhone ? (
                    <FaRegEyeSlash />
                  ) : (
                    <FaRegEye />
                  )}
                </span>
              )}
            </div>

            {errors.phone && (
              <span
                className={
                  styles.errorText
                }
              >
                {errors.phone}
              </span>
            )}
          </div>

          {/* EMAIL */}
          <div className={styles.formRow}>
            <label
              className={styles.formLabel}
            >
              Email
            </label>

            <input
              value={user.email || ""}
              readOnly
              className={`${styles.input} ${styles.readonly}`}
            />
          </div>

          {/* DOB */}
          <div className={styles.formRow}>
            <label
              className={styles.formLabel}
            >
              Ngày sinh
            </label>

            <div
              className={
                styles.inputWrapper
              }
            >
              <input
                name="dob"
                type={
                  edit ? "date" : "text"
                }
                value={
                  edit
                    ? normalizeDob(
                        user.dob
                      )
                    : toDisplayDate(
                        user.dob
                      )
                }
                max={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={handleChange}
                disabled={!edit}
                className={`${styles.input} ${
                  !edit
                    ? styles.readonly
                    : ""
                } ${
                  errors.dob
                    ? styles.errorInput
                    : ""
                }`}
              />
            </div>

            {errors.dob && (
              <span
                className={
                  styles.errorText
                }
              >
                {errors.dob}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ================= BUTTON ================= */}
      <div className={styles.buttonWrapper}>
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

      {/* ================= MEMBER ================= */}
      <div className={styles.member}>
        <h3
          className={
            styles.memberTitle
          }
        >
          Hạng thành viên
        </h3>

        <div className={styles.memberItem}>
          <span>Hạng:</span>
          <b>
            {user.tier || "BRONZE"}
          </b>
        </div>

        <div className={styles.memberItem}>
          <span>Điểm:</span>
          <b>{user.point || 0}</b>
        </div>
      </div>
    </>
  );
}