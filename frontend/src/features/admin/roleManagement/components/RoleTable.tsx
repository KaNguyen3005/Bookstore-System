import { Pencil, Shield, Trash2 } from "lucide-react";

import type { RoleItem } from "../types/role";

interface RoleTableProps {
  roles: RoleItem[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  onEdit: (role: RoleItem) => void;
  onDelete: (role: RoleItem) => void;
}

const getRoleBadge = (role: RoleItem) => {
  if (role.isSystemRole) return "Hệ thống";
  if (role.permissionIds.length >= 10) return "Toàn quyền";
  if (role.permissionIds.length >= 5) return "Quản trị";

  return "Tùy chỉnh";
};

const isPermissionProtectedRole = (role: RoleItem) =>
  ["ADMIN", "CUSTOMER", "USER"].includes(role.roleName.trim().toUpperCase());

const isDeleteProtectedRole = (role: RoleItem) =>
  ["ADMIN", "STAFF", "CUSTOMER", "USER"].includes(
    role.roleName.trim().toUpperCase()
  );

export const RoleTable = ({
  roles,
  loading,
  error,
  actionLoading,
  onEdit,
  onDelete,
}: RoleTableProps) => {
  const emptyColSpan = 5;

  return (
    <div className="role-mgmt__table-wrap">
      <table className="role-mgmt__table">
        <thead>
          <tr>
            <th>Vai trò</th>
            <th>Mô tả</th>
            <th className="role-mgmt__table-center">Người dùng</th>
            <th className="role-mgmt__table-center">Quyền hạn</th>
            <th className="role-mgmt__table-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={emptyColSpan} className="role-mgmt__empty">
                Đang tải danh sách vai trò...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={emptyColSpan} className="role-mgmt__empty role-mgmt__empty--error">
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && roles.length === 0 && (
            <tr>
              <td colSpan={emptyColSpan} className="role-mgmt__empty">
                Không tìm thấy vai trò phù hợp.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            roles.map((role) => (
              <tr key={role.clientId}>
                <td>
                  <div className="role-mgmt__role-cell">
                    <Shield size={17} />
                    <div>
                      <strong>{role.roleName}</strong>
                      <span>{getRoleBadge(role)}</span>
                    </div>
                  </div>
                </td>
                <td>{role.description}</td>
                <td className="role-mgmt__table-center">
                  <span className="role-mgmt__pill">{role.userCount} người</span>
                </td>
                <td className="role-mgmt__table-center">
                  <span className="role-mgmt__pill role-mgmt__pill--muted">
                    {role.permissionIds.length || role.permissions.length} quyền
                  </span>
                </td>
                <td>
                  <div className="role-mgmt__actions">
                    <button
                      type="button"
                      className="role-mgmt__icon-btn"
                      onClick={() => onEdit(role)}
                      disabled={actionLoading || isPermissionProtectedRole(role)}
                      title="Chỉnh sửa vai trò"
                      aria-label={`Chỉnh sửa vai trò ${role.roleName}`}
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      type="button"
                      className="role-mgmt__icon-btn role-mgmt__icon-btn--danger"
                      onClick={() => onDelete(role)}
                      disabled={actionLoading || isDeleteProtectedRole(role)}
                      title="Xóa vai trò"
                      aria-label={`Xóa vai trò ${role.roleName}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
