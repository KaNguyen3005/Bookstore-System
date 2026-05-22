import { useEffect, useRef, useState } from "react";
import { userApi } from "../../../../../services/userApi";
import type { UserFE } from "../../../../services/userApi";
import { useAuth } from "../../../../auth/hooks/useAuth";

import styles from "./AvatarSection.module.css";

export default function AvatarSection() {
  const fileRef = useRef<HTMLInputElement>(null);

  const { updateUser } = useAuth();

  const [user, setUser] = useState<UserFE | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>("");

  // load user
  useEffect(() => {
    userApi.getMe().then(setUser);
  }, []);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview ảnh ngay lập tức
    setPreview(URL.createObjectURL(file));

    try {
      setLoading(true);

      const updatedUser = await userApi.updateAvatar(file);

      // update local state
      setUser(updatedUser);

      // update auth context -> Header render lại avatar ngay
      updateUser({
        avatarUrl: updatedUser.avatarUrl,
      });

      // clear preview sau khi upload thành công
      setPreview("");
    } catch (err) {
      console.error("upload failed", err);
    } finally {
      setLoading(false);
    }

    e.target.value = "";
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Profile Avatar</h2>

      <div className={styles.avatarBox}>
        <img
          src={
            preview ||
            user?.avatarUrl ||
            "/default-avatar.png"
          }
          className={styles.avatar}
          alt="avatar"
        />
      </div>

      <button
        className={styles.button}
        onClick={() => fileRef.current?.click()}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Change Avatar"}
      </button>

      <input
        type="file"
        hidden
        ref={fileRef}
        accept="image/*"
        onChange={handleFileChange}
      />

      {user && (
        <p className={styles.username}>{user.name || user.username}</p>
      )}
    </div>
  );
}
