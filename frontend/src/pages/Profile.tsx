import { useState } from "react";
import "../styles/Profile.css";
import { userData } from "../Data/user";

import { RxAvatar } from "react-icons/rx";

export default function Profile() {

  const [user, setUser] = useState(userData);
  const [edit, setEdit] = useState(false);
  const [active, setActive] = useState("profile");
  const [avatar, setAvatar] = useState("");

// xu ly hay doi input
  const handleChange = (e:any) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

//upload avatar
  const handleAvatar = (e:any) => {
    const file = e.target.files[0];
    if(file){
      setAvatar(URL.createObjectURL(file));
    }
  };

// save thong tin
  const handleSave = () => {
    alert("Lưu thành công!");
    setEdit(false);
  };

  return (

    <div className="account-page">

      {/* SIDEBAR */}

      <div className="sidebar">

        <h3>Tài khoản của tôi</h3>

        <ul>

          <li
          className={active==="profile"?"active":""}
          onClick={()=>setActive("profile")}
          >
          Hồ sơ cá nhân
          </li>

          <li
          className={active==="password"?"active":""}
          onClick={()=>setActive("password")}
          >
          Đổi mật khẩu
          </li>

          <li
          className={active==="info"?"active":""}
          onClick={()=>setActive("info")}
          >
          Thông tin cá nhân
          </li>

          <li
          className={active==="setting"?"active":""}
          onClick={()=>setActive("setting")}
          >
          Thiết lập tài khoản
          </li>

          <li
          className={active==="voucher"?"active":""}
          onClick={()=>setActive("voucher")}
          >
          Kho Voucher
          </li>

          <li
          className={active==="member"?"active":""}
          onClick={()=>setActive("member")}
          >
          Hạng thành viên của tôi
          </li>

        </ul>

      </div>

      {/* CONTENT */}

      <div className="content">

        <h2>Hồ sơ cá nhân</h2>

        <div className="profile-container">

          {/* AVATAR */}

          <div className="avatar-section">

            <img
            src={avatar || "https://via.placeholder.com/120"}
            className="avatar"
            />

            <input type="file" onChange={handleAvatar}/>

            <p>{user.username}</p>

          </div>

          {/* FORM. edit ---> update state*/}

          <div className="form-section">
            <div className="form-row">
              <label>Tên đăng nhập</label>
              <input
              name="username"
              value={user.username}
              readOnly
              />
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
              <input
              name="phone"
              value={user.phone}
              onChange={handleChange}
              readOnly={!edit}
              />
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
              <label>Địa chỉ</label>
              <input
              name="address"
              value={user.address}
              onChange={handleChange}
              readOnly={!edit}
              />
            </div>

          </div>

        </div>

        {/* MEMBER */}

        <div className="member">
          <h3>Hạng thành viên</h3>
          <p>Số điểm tích lũy: {user.point} điểm</p>
        </div>

        {/* BUTTON */}

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

      </div>

    </div>
  );
}