export default function ProfileContent({
  user,
  edit,
  setEdit,
  avatar,
  handleAvatar,
  handleChange,
  handleSave
}: any){

  return(

    <>

      <h2>Hồ sơ cá nhân</h2>

      <div className="profile-container">

        <div className="avatar-section">

          <img
          src={avatar || "https://via.placeholder.com/120"}
          className="avatar"
          />

          <input type="file" onChange={handleAvatar}/>

          <p>{user?.username}</p>

        </div>

        <div className="form-section">

          <div className="form-row">
            <label>Tên đăng nhập</label>
            <input value={user?.username} readOnly />
          </div>

          <div className="form-row">
            <label>Họ và tên</label>
            <input
            name="fullname"
            value={user?.fullname}
            onChange={handleChange}
            readOnly={!edit}
            />
          </div>

          <div className="form-row">
            <label>Số điện thoại</label>
            <input
            name="phone"
            value={user?.phone}
            onChange={handleChange}
            readOnly={!edit}
            />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input
            name="email"
            value={user?.email}
            onChange={handleChange}
            readOnly={!edit}
            />
          </div>

          <div className="form-row">
            <label>Địa chỉ</label>
            <input
            name="address"
            value={user?.address}
            onChange={handleChange}
            readOnly={!edit}
            />
          </div>

        </div>

      </div>

      <div className="member">

        <h3>Hạng thành viên</h3>

        <p>Số điểm tích lũy: {user?.point} điểm</p>

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