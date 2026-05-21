import "./CustomerManagement.css";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { IoMdSearch } from "react-icons/io";

import { Pagination } from "../../orderManagement/components/Pagination";
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
    totalElements,
    activeTab,
    setActiveTab,
    accountCounts,
    totalPages,
    currentPage,
    setPage,
    keyword,
    setKeyword,
    selectedUser,
    setSelectedUser,
    formMode,
    editingUser,
    currentUserId,
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

  const isStaffAdminTab = activeTab === "staffAdmin";
  const normalizedFormRole = form.role.trim().toUpperCase();
  const isEditingAdmin = formMode === "edit" && normalizedFormRole === "ADMIN";
  const isEditingCurrentAdmin =
    isEditingAdmin && editingUser?.userId === currentUserId;

  return (
    <div>
      <h2>QUẢN LÝ THÔNG TIN TÀI KHOẢN</h2>

      <div className="card-sum">
        <h3>Tổng số tài khoản</h3>
        <p>{totalElements}</p>
      </div>

      <div className="account-tabs" role="tablist" aria-label="Quản lý tài khoản">
        <button
          type="button"
          role="tab"
          aria-selected={isStaffAdminTab}
          className={isStaffAdminTab ? "account-tab account-tab--active" : "account-tab"}
          onClick={() => setActiveTab("staffAdmin")}
        >
          <ShieldCheck size={17} />
          Staff & Admin
          <span>{accountCounts.staffAdmin}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={!isStaffAdminTab}
          className={!isStaffAdminTab ? "account-tab account-tab--active" : "account-tab"}
          onClick={() => setActiveTab("customers")}
        >
          <UsersRound size={17} />
          Khách hàng
          <span>{accountCounts.customers}</span>
        </button>
      </div>

      <div className="search-cm">
        <button
          type="button"
          className="btn add-user"
          onClick={openCreateForm}
        >
          <Plus size={16} />
          {isStaffAdminTab ? "Thêm nhân viên" : "Thêm khách hàng"}
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
        <h2>
          {isStaffAdminTab
            ? "Danh sách tài khoản Staff & Admin"
            : "Danh sách tài khoản khách hàng"}
        </h2>

        <table className="customer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên người dùng</th>
              <th>Họ</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Quản lý</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={8}>Đang tải danh sách người dùng...</td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8}>{error}</td>
              </tr>
            )}

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={8}>Không có người dùng phù hợp</td>
              </tr>
            )}

            {!loading &&
              !error &&
              filtered.map((user) => {
                const parts = splitName(user.name);
                const isAdminAccount = user.role?.trim().toUpperCase() === "ADMIN";

                return (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.username}</td>
                    <td>{parts.firstPart}</td>
                    <td>{parts.rest}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="account-role-pill">
                        {user.role || "CUSTOMER"}
                      </span>
                    </td>
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
                      {!isAdminAccount && (
                        <>
                          <button
                            type="button"
                            className="btn status-action"
                            disabled={actionLoading}
                            onClick={(event) => {
                              console.log("CLICK STATUS BUTTON:", {
                                userId: user.userId,
                                status: user.status,
                              });
                              handleUpdateStatus(user, event);
                            }}
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
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
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
            noValidate
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
                  onChange={(event) =>
                    updateFormField("email", event.target.value)
                  }
                />
                {fieldErrors.email && (
                  <span className="field-error">{fieldErrors.email}</span>
                )}
              </label>

              {formMode === "create" && (
                <label>
                  Mật khẩu
                  <div className="password-input-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(event) =>
                        updateFormField("password", event.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <span className="field-error">{fieldErrors.password}</span>
                  )}
                </label>
              )}

              <label>
                Tên đăng nhập
                <input
                  value={form.username}
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
                  disabled={isEditingCurrentAdmin}
                  title={
                    isEditingCurrentAdmin
                      ? "Admin không thể tự chỉnh vai trò của chính mình"
                      : undefined
                  }
                  onChange={(event) =>
                    updateFormField("role", event.target.value)
                  }
                >
                  {isEditingAdmin ? (
                    <option value="ADMIN">ADMIN</option>
                  ) : isStaffAdminTab ? (
                    <option value="STAFF">STAFF</option>
                  ) : (
                    <option value="CUSTOMER">CUSTOMER</option>
                  )}
                </select>
                {fieldErrors.role && (
                  <span className="field-error">{fieldErrors.role}</span>
                )}
              </label>

              {formMode === "edit" && (
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
              )}

              <label className="user-form-status">
                <input
                  type="checkbox"
                  checked={form.status}
                  disabled={isEditingAdmin}
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
