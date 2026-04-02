type Props = {
  user: UserFE;
  onClose: () => void;
};

export default function UserDetail({ user, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Chi tiết người dùng</h3>

        <p><b>ID:</b> {user.id}</p>
        <p><b>Username:</b> {user.username}</p>
        <p><b>Họ:</b> {user.firstname}</p>
        <p><b>Têb:</b> {user.lastname}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Số điện thoại:</b> {user.phone}</p>
        <p><b>Giới tính:</b> {user.gender}</p>
        <p><b>Điểm thành viên:</b> {user.point}</p>
        <p>
          <b>Trạng thái:</b>{" "}
          {user.status ? "Hoạt động" : "Ngừng hoạt động"}
        </p>
        <p>Thông tin khác:
            <ul>
                <li> Mã số thuế công ty </li>
                <li> Tên công ty </li>
                <li> Email </li>
                <li> Số điện thoại </li>
            </ul>
        </p>

        <button onClick={onClose}>Sửa</button>
        <button onClick={onClose}>Xóa tài khoản</button>
        <button onClick={onClose}>Đóng</button>

      </div>
    </div>
  );
}