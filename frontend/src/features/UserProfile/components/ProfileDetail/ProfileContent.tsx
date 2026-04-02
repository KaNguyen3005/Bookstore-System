import { useOutletContext } from "react-router-dom";
import { useState, useRef } from "react";

import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import "../../styles/ProfileContent.css";

export default function ProfileContent(){

  const {

    user,
    edit,
    setEdit,
    avatar,
    handleAvatar,
    handleChange,
    handleSave

  }:any = useOutletContext();

    const [showPhone, setShowPhone] = useState(false);
    const [showDob, setShowDob] = useState(false);

  {/*} console.log("USER:", user);*/}

  if(!user){
    return <p>Loading...</p>
  }

//avatar
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClickAvatar = () => {
      fileInputRef.current?.click();
    };
//sdt
    const maskPhoneVN = (phone: string ="") => {
      if (!phone) return "";

      // bỏ khoảng trắng nếu có
      const clean = phone.replace(/\s+/g, "");

      if (clean.length < 7) return phone; // tránh lỗi

      const first = clean.slice(0, 3);   // 090
      const last = clean.slice(-3);      // 567
      const middle = "*".repeat(clean.length - 6);

      return `${first}${middle}${last}`;
    };

//ngay sinh
    const maskDate = (date: string="") => {
      if (!date) return "";

      const parts = date.split("/"); // ["01","01","2006"]

      if (parts.length !== 3) return date;

      return `**/**/${parts[2]}`;
    };

  return(

    <>

      <h2>Hồ sơ cá nhân</h2>

      <div className="profile-container">

          <div className="avatar-section">
              <div className="avatar-wrapper" onClick={handleClickAvatar}>
                <img
                  src={avatar || user.avatar || "/default-avatar.png"}
                  className="avatar"
                />
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatar}
                style={{ display: "none" }}
              />

              <p>{user.username}</p>
            </div>

        <div className="form-section">

          <div className="form-row">
            <label>Tên đăng nhập</label>
            <input value={user.username} readOnly />
          </div>

          <div className="form-row">
            <label>Họ và tên</label>
            <input
              name="fullname"
              value={user.fullname}
              onChange={handleChange}
              readOnly={!edit}
            />
          </div>

          <div className="form-row">
            <label>Số điện thoại</label>

            <div style={{ position: "relative" }}>
              <input
                name="phone"
                value={
                  edit
                    ? (user.phone || "")
                    : showPhone
                      ? (user.phone || "")
                      : maskPhoneVN(user.phone || "")
                }
                onChange={handleChange}
                readOnly={!edit}
              />

              <span
                onClick={() => !edit && setShowPhone(!showPhone)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                {showPhone ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>
          </div>

          <div className="form-row">
            <label>Email</label>
            <input
              name="email"
              value={user.email}
              onChange={handleChange}
              readOnly={!edit}
            />
          </div>

          <div className="form-row">
            <label>Ngày sinh</label>

            <div style={{ position: "relative" }}>
              <input
                name="birth"
                value={
                  edit
                    ? (user.birth || "")
                    : showDob
                      ? (user.birth || "")
                      : maskDate(user.birth || "")
                }
                onChange={handleChange}
                readOnly={!edit}
              />

              <span
                onClick={() => !edit && setShowDob(!showDob)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                {showDob ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>
          </div>

        </div>

      </div>

      <div className="member">

        <h3>Hạng thành viên</h3>

        <p>Số điểm tích lũy: {user.point} điểm</p>

      </div>

      <div style={{marginTop:"20px"}}>

        <button
          className="save-btn"
          onClick={()=>setEdit(!edit)}
        >
          {edit ? "Hủy" : "Sửa"}
        </button>

        {edit && (

          <button
            className="save-btn"
            style={{marginLeft:"10px"}}
            onClick={handleSave}
          >
            Lưu
          </button>

        )}

      </div>

    </>

  )
}