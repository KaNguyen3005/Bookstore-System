import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Profile.Sidebar.css";
import Sidebar from "./Sidebar";
import { userApi } from "../../../../services/userApi";

import {useAuth} from "../../../auth/hooks/useAuth";

export default function Profile() {

  const [user, setUser] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [avatar, setAvatar] = useState("");

  const { user: authUser } = useAuth();

     useEffect(() => {
       if (!authUser?.user_id) return;

       const fetchUser = async () => {
         const data = await userApi.getUserById(authUser.user_id);

         if (data) {
           setUser(data);
           setAvatar(data.avatar || "");
         }
       };

       fetchUser();
     }, [authUser]);

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

    // preview
    const preview = URL.createObjectURL(file);
    setAvatar(preview);

    // lưu file (QUAN TRỌNG)
    setUser((prev: any) => ({
      ...prev,
      avatarFile: file
    }));

    // fix bug chọn lại cùng ảnh
    e.target.value = "";
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setUser((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      let avatarUrl = user.avatar;

      // nếu có file mới thì upload trước
      if (user.avatarFile) {
        const formData = new FormData();
        formData.append("file", user.avatarFile);

        // gọi API upload
        const uploadRes = await userApi.uploadAvatar(formData);

        avatarUrl = uploadRes.url; // backend trả về url
      }

      // update user
      const updatedUser = {
        ...user,
        avatar: avatarUrl
      };

      const updated = await userApi.updateUser(updatedUser);

      setUser(updated);
      if (updated.avatar) setAvatar(updated.avatar);

      setEdit(false);
      alert("Đã lưu thông tin");

    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra");
    }
  };

  if (!user) return <p>Loading...</p>;

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
            handleSave
          }}
        />
      </div>
    </div>
  );
}