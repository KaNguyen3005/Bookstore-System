import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import styles from "../ProfileContent.module.css";
import { normalizeDob } from "../utils/profileUtils";

type Props = {
  user: any;
  edit: boolean;
  errors: any;
  showPhone: boolean;
  setShowPhone: (v: boolean) => void;
  handleChange: (e: any) => void;
};

export default function ProfileForm({
  user,
  edit,
  errors,
  showPhone,
  setShowPhone,
  handleChange,
}: Props) {
  return (
    <div className={styles.formSection}>
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
            value={user.phone || ""}
            onChange={handleChange}
            readOnly={!edit}
            className={`${styles.input} ${
              !edit ? styles.readonly : ""
            } ${errors.phone ? styles.errorInput : ""}`}
          />

          {!edit && (
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPhone(!showPhone)}
            >
              {showPhone ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          )}
        </div>

        {errors.phone && (
          <span className={styles.errorText}>{errors.phone}</span>
        )}
      </div>

      {/* DOB */}
      <div className={styles.formRow}>
        <label className={styles.formLabel}>Ngày sinh</label>

        <input
          name="dob"
          type={edit ? "date" : "text"}
          value={normalizeDob(user.dob)}
          disabled={!edit}
          onChange={handleChange}
          className={`${styles.input} ${
            !edit ? styles.readonly : ""
          } ${errors.dob ? styles.errorInput : ""}`}
        />

        {errors.dob && (
          <span className={styles.errorText}>{errors.dob}</span>
        )}
      </div>

      {/* EMAIL (readonly) */}
      <div className={styles.formRow}>
        <label className={styles.formLabel}>Email</label>

        <input
          value={user.email || ""}
          readOnly
          className={`${styles.input} ${styles.readonly}`}
        />
      </div>
    </div>
  );
}