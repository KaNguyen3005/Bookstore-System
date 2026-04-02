import "./CustomerManagement.css";
import { UserService } from "../../../../services/UserService";
import { useEffect, useState } from "react";

import { IoMdSearch } from "react-icons/io";

import UserDetail from "../../components/UserDetail";

export default function CustomerManagement(){

const [list, setList] = useState<UserFE[]>([]);



useEffect(() => {
  const fetchUsers = async () => {
    const data = await UserService.getAllUsers();
    setList(data);
  };

  fetchUsers();
}, []);

const [keyword, setKeyword] = useState("");

const filtered = list.filter(u =>
  u.username.toLowerCase().includes(keyword.toLowerCase())
);

const [selectedUser, setSelectedUser] = useState<UserFE | null>(null);
  return(

    <div>

      <h2>THÔNG TIN KHÁCH HÀNG</h2>
        <div className="card-sum">
          <h3 className="title-card">Tổng số tài khoản</h3>
          <p>{list.length}</p>
        </div>

        <div className="search-cm">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm..."
          />
          <button className="button-search"><IoMdSearch /></button>
        </div>


        <div className="table-wrapper">

          <h2>Danh sách</h2>

          <table className="customer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên người dùng</th>
                <th>Họ</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.fullname.split(" ")[0]}</td>
                  <td>{user.fullname.split(" ").slice(1).join(" ")}</td>
                  <td>{user.email}</td>
                  <td className={user.status ? "active" : "inactive"}>
                    {user.status ? "Hoạt động" : "Ngừng hoạt động"}
                  </td>
                  <td>
                    <button className="btn edit">Sửa</button>
                    <button className="btn delete">Xóa</button>
                     <button
                       className="btn view"
                       onClick={() => setSelectedUser(user)}
                     >
                       Xem chi tiết
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {selectedUser && (
          <UserDetail
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
    </div>

  )

}