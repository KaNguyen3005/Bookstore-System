import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Profile.Sidebar.css";

import Sidebar from "./Sidebar";
import { userApi } from "../../../../services/userApi";
import { useAuth } from "../../../auth/hooks/useAuth";

type User = {
  id?: string | number;
  userId?: number;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  avatarUrl?: string;
};

export default function Profile() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(() => authUser);
  const [edit, setEdit] = useState(false);

  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // ================= FETCH USER =================
  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        if (authUser) {
          setUser((prev) => prev ?? authUser);
          setAvatar((prev) => prev || authUser.avatarUrl || "");
        }

        const res = await userApi.getMe();
        const data = res?.data ?? res;

        console.log("PROFILE USER:", data);

        if (!isMounted) return;

        if (data) {
          setUser(data);
          setAvatar(data?.avatarUrl || "");
          return;
        }

        if (authUser) {
          setUser(authUser);
        }
      } catch (error) {
        console.error("FETCH USER ERROR:", error);

        if (isMounted && authUser) {
          setUser(authUser);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  // ================= CLEAN OBJECT URL =================
  useEffect(() => {
    return () => {
      if (avatar.startsWith("blob:")) {
        URL.revokeObjectURL(avatar);
      }
    };
  }, [avatar]);

  // ================= HANDLE AVATAR =================
  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      alert("Chỉ chấp nhận file JPG, PNG!");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ảnh phải nhỏ hơn 2MB!");
      return;
    }

    const preview = URL.createObjectURL(file);

    setAvatar(preview);
    setAvatarFile(file);

    e.target.value = "";
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setUser((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : prev
    );
  };

  // ================= HANDLE SAVE =================
  const handleSave = async () => {
    try {
      if (!user) return;

      let avatarUrl = user.avatarUrl;

      // upload avatar nếu có
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);

        const uploadRes = await userApi.uploadAvatar(formData);
        const uploadData = uploadRes?.data ?? uploadRes;

        avatarUrl = uploadData.url;
      }

      // loại bỏ file khỏi payload
      const { ...cleanUser } = user;

      const updatedPayload = {
        ...cleanUser,
        avatarUrl,
      };

      const res = await userApi.updateMe(updatedPayload);
      const updated = res?.data ?? res;

      setUser(updated);
      setAvatar(updated.avatarUrl || "");
      setAvatarFile(null);

      setEdit(false);

      alert("Đã lưu thông tin");
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("Có lỗi xảy ra");
    }
  };

  // ================= LOADING =================
  if (!user) {
    return <p>Loading...</p>;
  }

  // ================= RENDER =================
  return (
    <div className="account-page">
      <Sidebar />

      <div className="content">
        <Outlet
          context={{
            user,
            edit,
            setEdit,
            avatar,
            handleAvatar,
            handleChange,
            handleSave,
          }}
        />
      </div>
    </div>
  );
}
