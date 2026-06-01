import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import styles from "./ProfileContent.module.css";

import AvatarSection from "./components/AvatarSection";
import ProfileForm from "./components/ProfileForm";
import MemberInfo from "./components/MemberInfo";

import {
  normalizeDob,
  calculateAge,
} from "./utils/profileUtils";

type EditableField = "name" | "phone" | "dob";

export default function ProfileContent() {
  const {
    user,
    handleSaveField,
  }: any = useOutletContext();

  const [showPhone, setShowPhone] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [savingField, setSavingField] = useState<EditableField | null>(null);

  if (!user) return <p>Loading...</p>;

  const getFieldValue = (field: EditableField) => {
    if (field === "dob") return normalizeDob(user.dob);

    return user[field] || "";
  };

  const validateField = (field: EditableField, value: string) => {
    const nextErrors = { ...errors };
    const normalizedValue = value.trim();

    delete nextErrors[field];

    if (field === "name" && !normalizedValue) {
      nextErrors.name = "Vui lòng nhập họ tên";
    }

    if (field === "phone") {
      if (!normalizedValue) {
        nextErrors.phone = "Vui lòng nhập số điện thoại";
      } else if (!/^0(3|5|7|8|9)\d{8}$/.test(normalizedValue)) {
        nextErrors.phone = "Số điện thoại không hợp lệ";
      }
    }

    if (field === "dob") {
      if (!normalizedValue) {
        nextErrors.dob = "Vui lòng nhập ngày sinh";
      } else {
        const age = calculateAge(normalizedValue);

        if (age < 15) {
          nextErrors.dob = "Bạn phải từ 15 tuổi trở lên";
        }
      }
    }

    setErrors(nextErrors);
    return !nextErrors[field];
  };

  const handleEditField = (field: EditableField) => {
    setEditingField(field);
    setDraftValue(getFieldValue(field));
    setErrors((prev: any) => {
      const next = { ...prev };
      delete next[field];

      return next;
    });
  };

  const handleCancelField = () => {
    const field = editingField;

    setEditingField(null);
    setDraftValue("");

    if (field) {
      setErrors((prev: any) => {
        const next = { ...prev };
        delete next[field];

        return next;
      });
    }
  };

  const handleSaveCurrentField = async () => {
    if (!editingField || savingField) return;

    const normalizedValue =
      editingField === "dob" ? draftValue : draftValue.trim();

    if (!validateField(editingField, normalizedValue)) return;

    try {
      setSavingField(editingField);
      await handleSaveField(editingField, normalizedValue);
      setEditingField(null);
      setDraftValue("");
    } catch (error) {
      console.error("SAVE PROFILE FIELD ERROR:", error);
      setErrors((prev: any) => ({
        ...prev,
        [editingField]: "Không thể lưu thay đổi",
      }));
    } finally {
      setSavingField(null);
    }
  };

  return (
    <>
      <h2 className={styles.title}>Hồ sơ cá nhân</h2>

      <div className={styles.profileContainer}>
        <AvatarSection />

        <ProfileForm
          user={user}
          errors={errors}
          editingField={editingField}
          draftValue={draftValue}
          savingField={savingField}
          showPhone={showPhone}
          setShowPhone={setShowPhone}
          onDraftChange={setDraftValue}
          onEditField={handleEditField}
          onCancelField={handleCancelField}
          onSaveField={handleSaveCurrentField}
        />
      </div>

      <MemberInfo user={user} />
    </>
  );
}
