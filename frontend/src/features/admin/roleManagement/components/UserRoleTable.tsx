import { UserRound } from "lucide-react";

import type { UserRoleItem } from "../types/role";

interface RoleOption {
  roleId: number;
  roleName: string;
}

interface UserRoleTableProps {
  users: UserRoleItem[];
  roleOptions: RoleOption[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  currentUserId: number | null;
  onAssignRole: (userId: number, roleId: number) => void;
}

export const UserRoleTable = ({
  users,
  roleOptions,
  loading,
  error,
  actionLoading,
  currentUserId,
  onAssignRole,
}: UserRoleTableProps) => {
  const emptyColSpan = 5;
  const canAssign = roleOptions.length > 0;

  return (
    <div className="role-mgmt__table-wrap">
      <table className="role-mgmt__table">
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Email</th>
            <th>Vai trò hiện tại</th>
            <th>Trạng thái</th>
            <th className="role-mgmt__table-right">Phân quyền</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={emptyColSpan} className="role-mgmt__empty">
                Đang tải danh sách người dùng...
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

          {!loading && !error && users.length === 0 && (
            <tr>
              <td colSpan={emptyColSpan} className="role-mgmt__empty">
                Không tìm thấy người dùng phù hợp.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            users.map((user) => {
              const isCurrentUser = user.userId === currentUserId;

              return (
                <tr key={user.userId}>
                  <td>
                    <div className="role-mgmt__user-cell">
                      <span className="role-mgmt__avatar">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} />
                        ) : (
                          <UserRound size={17} />
                        )}
                      </span>
                      <div>
                        <strong>{user.name}</strong>
                        <span>@{user.username}</span>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className="role-mgmt__pill">{user.roleName}</span>
                  </td>
                  <td>
                    <span
                      className={
                        user.status
                          ? "role-mgmt__status role-mgmt__status--active"
                          : "role-mgmt__status role-mgmt__status--inactive"
                      }
                    >
                      {user.status ? "Hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </td>
                  <td className="role-mgmt__table-right">
                    <select
                      className="role-mgmt__select"
                      value={user.roleId ?? ""}
                      disabled={actionLoading || !canAssign || isCurrentUser}
                      title={
                        isCurrentUser
                          ? "Admin không thể tự chỉnh quyền của chính mình"
                          : undefined
                      }
                      onChange={(event) =>
                        onAssignRole(user.userId, Number(event.target.value))
                      }
                    >
                      <option value="">
                        {canAssign ? "Chọn vai trò" : "Backend chưa trả roleId"}
                      </option>
                      {roleOptions.map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
