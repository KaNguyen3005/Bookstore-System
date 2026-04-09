import { useEffect, useState } from "react";
import "./AuthorManagement.css";

import {
  getAuthors,
  getTotalAuthors,
  type Author,
} from "../../../../services/authorApi";

export default function AuthorManagement() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadData = async () => {
    const data = await getAuthors();
    const total = await getTotalAuthors();

    setAuthors(data);
    setTotal(total);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h2>QUẢN LÝ THÔNG TIN TÁC GIẢ</h2>

      <div className="card-sum">
        <h3 className="title-card">Tổng số tác giả</h3>
        <p>{total}</p>
      </div>

      <div className="table-wrapper">

        <h2>Danh sách</h2>

        <table className="customer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên tác giả</th>
              <th>Bí danh</th>
              <th>Quản lý</th>
            </tr>
          </thead>

          <tbody>
            <td>1</td>
            <td>Nguyễn Khánh Huyền</td>
            <td>Nika</td>
            <td>
              <button className="btn edit">Sửa</button>
              <button className="btn delete">Xóa</button>
              <button className="btn view">Xem chi tiết</button>
            </td>
          </tbody>

        </table>
      </div>


    </div>
  );
}