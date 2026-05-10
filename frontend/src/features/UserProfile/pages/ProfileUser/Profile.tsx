import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Profile.Sidebar.css";

import Sidebar from "./Sidebar";

import { userApi } from "../../../../services/userApi";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [avatar, setAvatar] = useState("");

  // ================= FETCH USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userApi.getMe();

        console.log("PROFILE USER:", data);

        if (data) {
          setUser(data);
          setAvatar(data.avatarUrl || "");
        }
      } catch (error) {
        console.error("FETCH USER ERROR:", error);
      }
    };

    fetchUser();
  }, []);

  // ================= HANDLE AVATAR =================
  const handleAvatar = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

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

    setUser((prev: any) => ({
      ...prev,
      avatarFile: file,
    }));

    e.target.value = "";
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setUser((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= HANDLE SAVE =================
  const handleSave = async () => {
    try {
      let avatarUrl = user.avatarUrl;

      // upload avatar first
      if (user.avatarFile) {
        const formData = new FormData();

        formData.append("file", user.avatarFile);

        const uploadRes =
          await userApi.uploadAvatar(formData);

        avatarUrl = uploadRes.url;
      }

      // update user
      const updatedUser = {
        ...user,
        avatarUrl,
      };

      const updated =
        await userApi.updateMe(updatedUser);

      setUser(updated);

      if (updated.avatarUrl) {
        setAvatar(updated.avatarUrl);
      }

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