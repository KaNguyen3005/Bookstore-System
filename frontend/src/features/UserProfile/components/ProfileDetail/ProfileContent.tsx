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

  if (!user) return <p>Loading...</p>;

  const validate = () => {
    const err: any = {};

    if (!user.name?.trim())
      err.name = "Vui lòng nhập họ tên";

    if (!user.phone?.trim())
      err.phone = "Vui lòng nhập số điện thoại";

    if (!user.dob) err.dob = "Vui lòng nhập ngày sinh";
    else {
      const age = calculateAge(normalizeDob(user.dob));
      if (age < 15)
        err.dob = "Bạn phải từ 15 tuổi trở lên";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSaveClick = async () => {
    if (!validate()) return;

    const payload = {
      ...user,
      dob: normalizeDob(user.dob),
      avatar,
    };

    await handleSave(payload);
    setEdit(false);
  };

  return (
    <>
      <h2 className={styles.title}>Hồ sơ cá nhân</h2>

      <div className={styles.profileContainer}>
        <AvatarSection
          avatar={avatar}
          user={user}
          handleAvatar={handleAvatar}
        />

        <ProfileForm
          user={user}
          edit={edit}
          errors={errors}
          showPhone={showPhone}
          setShowPhone={setShowPhone}
          handleChange={handleChange}
        />
      </div>

      <div className={styles.buttonWrapper}>
        <div className={styles.btnGroup}>
            <button className={styles.cancelBtn} onClick={() => setEdit(!edit)}>
              {edit ? "Hủy" : "Sửa"}
            </button>

            {edit && (
              <button className={styles.saveBtn} onClick={handleSaveClick}>
                 Lưu
              </button> )}
        </div>

      </div>

      <MemberInfo user={user} />
    </>
  );
}