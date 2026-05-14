import "./CustomerManagement.css";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { IoMdSearch } from "react-icons/io";

import UserDetail from "../components/UserDetail/UserDetail";
import { useCustomerManagement } from "../hooks/useCustomerManagement";

const splitName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  return {
    firstPart: parts[0] ?? "",
    rest: parts.slice(1).join(" "),
  };
};

export default function CustomerManagement() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    list,
    keyword,
    setKeyword,
    selectedUser,
    setSelectedUser,
    formMode,
    form,
    loading,
    actionLoading,
    error,
    actionError,
    fieldErrors,
    filtered,
    closeForm,
    openCreateForm,
    openEditForm,
    updateFormField,
    handleSubmitUser,
    handleDeleteUser,
    handleUpdateStatus,
  } = useCustomerManagement();

  return (
    <div>
      <h2>QUẢN LÝ THÔNG TIN KHÁCH HÀNG</h2>

      <div className="card-sum">
        <h3>Tổng số tài khoản</h3>
        <p>{list.length}</p>
      </div>

      <div className="search-cm">
        <button
          type="button"
          className="btn add-user"
          onClick={openCreateForm}
        >
          <Plus size={16} />
          Thêm người dùng
        </button>
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm kiếm..."
        />
        <button type="button" className="button-search">
          <IoMdSearch />
        </button>
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
              <th>Quản lý</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7}>Đang tải danh sách người dùng...</td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={7}>{error}</td>
              </tr>
            )}

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={7}>Không có người dùng phù hợp</td>
              </tr>
            )}

            {!loading &&
              !error &&
              filtered.map((user) => {
                const parts = splitName(user.name);

                return (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.username}</td>
                    <td>{parts.firstPart}</td>
                    <td>{parts.rest}</td>
                    <td>{user.email}</td>
                    <td className={user.status ? "active" : "inactive"}>
                      {user.status ? "Hoạt động" : "Ngừng hoạt động"}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn view"
                        onClick={() => setSelectedUser(user)}
                      >
                        Xem chi tiết
                      </button>
                      <button
                        type="button"
                        className="btn edit"
                        onClick={() => openEditForm(user)}
                      >
                        <Pencil size={14} />
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="btn status-action"
                        disabled={actionLoading}
                        onClick={() => handleUpdateStatus(user)}
                      >
                        <CheckCircle2 size={14} />
                        {user.status ? "Ngừng" : "Mở"}
                      </button>
                      <button
                        type="button"
                        className="btn delete"
                        disabled={actionLoading}
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 size={14} />
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserDetail
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {formMode && (
        <div className="modal-overlay" onClick={closeForm}>
          <form
            className="modal user-form-modal"
            onSubmit={handleSubmitUser}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="user-form-header">
              <div>
                <span>{formMode === "create" ? "Tạo tài khoản" : "Cập nhật"}</span>
                <h3>
                  {formMode === "create"
                    ? "Thêm người dùng"
                    : "Sửa thông tin người dùng"}
                </h3>
              </div>

              <button
                type="button"
                className="user-detail-close"
                onClick={closeForm}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            <div className="user-form-grid">
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  required
                  onChange={(event) =>
                    updateFormField("email", event.target.value)
                  }
                />
                {fieldErrors.email && (
                  <span className="field-error">{fieldErrors.email}</span>
                )}
              </label>

              <label>
                Mật khẩu
                <div className="password-input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    required={formMode === "create"}
                    placeholder={
                      formMode === "edit" ? "Để trống nếu không đổi" : ""
                    }
                    onChange={(event) =>
                      updateFormField("password", event.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span className="field-error">{fieldErrors.password}</span>
                )}
              </label>

              <label>
                Tên đăng nhập
                <input
                  value={form.username}
                  required
                  onChange={(event) =>
                    updateFormField("username", event.target.value)
                  }
                />
                {fieldErrors.username && (
                  <span className="field-error">{fieldErrors.username}</span>
                )}
              </label>

              <label>
                Họ tên
                <input
                  value={form.name}
                  required
                  onChange={(event) =>
                    updateFormField("name", event.target.value)
                  }
                />
                {fieldErrors.name && (
                  <span className="field-error">{fieldErrors.name}</span>
                )}
              </label>

              <label>
                Số điện thoại
                <input
                  value={form.phone}
                  required
                  onChange={(event) =>
                    updateFormField("phone", event.target.value)
                  }
                />
                {fieldErrors.phone && (
                  <span className="field-error">{fieldErrors.phone}</span>
                )}
              </label>

              <label>
                Giới tính
                <select
                  value={form.gender}
                  required
                  onChange={(event) =>
                    updateFormField("gender", event.target.value)
                  }
                >
                  <option value="">Chưa cập nhật</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
                {fieldErrors.gender && (
                  <span className="field-error">{fieldErrors.gender}</span>
                )}
              </label>

              <label>
                Ngày sinh
                <input
                  type="date"
                  value={form.dob}
                  required
                  onChange={(event) =>
                    updateFormField("dob", event.target.value)
                  }
                />
                {fieldErrors.dob && (
                  <span className="field-error">{fieldErrors.dob}</span>
                )}
              </label>

              <label>
                Vai trò
                <select
                  value={form.role}
                  required
                  onChange={(event) =>
                    updateFormField("role", event.target.value)
                  }
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="STAFF">STAFF</option>
                </select>
                {fieldErrors.role && (
                  <span className="field-error">{fieldErrors.role}</span>
                )}
              </label>

              <label>
                Điểm
                <input
                  type="number"
                  min="0"
                  value={form.point}
                  onChange={(event) =>
                    updateFormField("point", event.target.value)
                  }
                />
                {fieldErrors.point && (
                  <span className="field-error">{fieldErrors.point}</span>
                )}
              </label>

              <label className="user-form-status">
                <input
                  type="checkbox"
                  checked={form.status}
                  onChange={(event) =>
                    updateFormField("status", event.target.checked)
                  }
                />
                Tài khoản đang hoạt động
              </label>
            </div>

            {actionError && <p className="user-form-error">{actionError}</p>}

            <div className="user-form-actions">
              <button
                type="button"
                className="btn form-cancel"
                onClick={closeForm}
                disabled={actionLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn form-submit"
                disabled={actionLoading}
              >
                {actionLoading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
