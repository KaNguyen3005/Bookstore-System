export default function ChangePassword() {

  return (

    <div>

      <h2>Đổi mật khẩu</h2>

      <div className="form-row">
        <label>Mật khẩu hiện tại</label>
        <input type="password" />
      </div>

      <div className="form-row">
        <label>Mật khẩu mới</label>
        <input type="password" />
      </div>

      <div className="form-row">
        <label>Nhập lại mật khẩu</label>
        <input type="password" />
      </div>

      <button className="save-btn">Cập nhật</button>

    </div>

  );

}