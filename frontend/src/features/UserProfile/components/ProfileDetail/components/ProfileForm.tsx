import { Check, Pencil, X } from "lucide-react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import styles from "../ProfileContent.module.css";
import { normalizeDob } from "../utils/profileUtils";

type EditableField = "name" | "phone" | "dob";

type Props = {
  user: any;
  errors: any;
  editingField: EditableField | null;
  draftValue: string;
  savingField: EditableField | null;
  showPhone: boolean;
  setShowPhone: (v: boolean) => void;
  onDraftChange: (value: string) => void;
  onEditField: (field: EditableField) => void;
  onCancelField: () => void;
  onSaveField: () => void;
};

const getMaskedPhone = (phone?: string) => {
  if (!phone) return "";
  if (phone.length <= 4) return phone;

  return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
};

export default function ProfileForm({
  user,
  errors,
  editingField,
  draftValue,
  savingField,
  showPhone,
  setShowPhone,
  onDraftChange,
  onEditField,
  onCancelField,
  onSaveField,
}: Props) {
  const renderActions = (field: EditableField) => {
    const isEditing = editingField === field;
    const isAnotherFieldEditing = editingField !== null && !isEditing;
    const isSaving = savingField === field;

    if (isEditing) {
      return (
        <div className={styles.fieldActions}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={onSaveField}
            disabled={isSaving}
            aria-label="Lưu"
            title="Lưu"
          >
            <Check size={17} />
          </button>

          <button
            type="button"
            className={styles.iconButtonSecondary}
            onClick={onCancelField}
            disabled={isSaving}
            aria-label="Hủy"
            title="Hủy"
          >
            <X size={17} />
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        className={styles.iconButtonSecondary}
        onClick={() => onEditField(field)}
        disabled={isAnotherFieldEditing}
        aria-label="Sửa"
        title="Sửa"
      >
        <Pencil size={16} />
      </button>
    );
  };

  const getInputValue = (field: EditableField) => {
    if (editingField === field) return draftValue;
    if (field === "dob") return normalizeDob(user.dob);
    if (field === "phone" && !showPhone) return getMaskedPhone(user.phone || "");

    return user[field] || "";
  };

  const renderEditableInput = (
    field: EditableField,
    type: "text" | "date" = "text"
  ) => {
    const isEditing = editingField === field;

    return (
      <div className={styles.fieldControl}>
        <div className={styles.inputWrapper}>
          <input
            name={field}
            type={field === "dob" && isEditing ? "date" : type}
            value={getInputValue(field)}
            onChange={(event) => onDraftChange(event.target.value)}
            readOnly={!isEditing}
            className={`${styles.input} ${
              !isEditing ? styles.readonly : ""
            } ${errors[field] ? styles.errorInput : ""}`}
          />

          {field === "phone" && !isEditing && (
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPhone(!showPhone)}
            >
              {showPhone ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          )}
        </div>

        {renderActions(field)}
      </div>
    );
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.formRow}>
        <label className={styles.formLabel}>Họ và tên</label>

        <div className={styles.inputBlock}>
          {renderEditableInput("name")}

          {errors.name && (
            <span className={styles.errorText}>{errors.name}</span>
          )}
        </div>
      </div>

      <div className={styles.formRow}>
        <label className={styles.formLabel}>Số điện thoại</label>

        <div className={styles.inputBlock}>
          {renderEditableInput("phone")}

          {errors.phone && (
            <span className={styles.errorText}>{errors.phone}</span>
          )}
        </div>
      </div>

      <div className={styles.formRow}>
        <label className={styles.formLabel}>Ngày sinh</label>

        <div className={styles.inputBlock}>
          {renderEditableInput("dob")}

          {errors.dob && (
            <span className={styles.errorText}>{errors.dob}</span>
          )}
        </div>
      </div>

      <div className={styles.formRow}>
        <label className={styles.formLabel}>Email</label>

        <div className={styles.inputBlock}>
          <input
            value={user.email || ""}
            readOnly
            className={`${styles.input} ${styles.readonly}`}
          />
        </div>
      </div>
    </div>
  );
}
