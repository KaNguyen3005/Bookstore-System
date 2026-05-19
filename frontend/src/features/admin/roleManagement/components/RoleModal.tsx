import { KeyRound, Lock, X } from "lucide-react";
import type { FormEvent } from "react";

import type {
  PermissionGroup,
  RoleFormState,
  RoleModalMode,
} from "../types/role";

interface RoleModalProps {
  mode: RoleModalMode;
  form: RoleFormState;
  permissionGroups: PermissionGroup[];
  actionLoading: boolean;
  actionError: string | null;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: <T extends keyof RoleFormState>(
    field: T,
    value: RoleFormState[T]
  ) => void;
  onTogglePermission: (permissionId: number) => void;
  onSetGroupPermissions: (group: PermissionGroup, checked: boolean) => void;
}

export const RoleModal = ({
  mode,
  form,
  permissionGroups,
  actionLoading,
  actionError,
  onClose,
  onSubmit,
  onFieldChange,
  onTogglePermission,
  onSetGroupPermissions,
}: RoleModalProps) => {
  const selectedCount = form.permissionIds.length;
  const title = mode === "create" ? "Thêm vai trò" : "Chỉnh sửa vai trò";
  const subtitle =
    mode === "create"
      ? "Tạo vai trò mới và gán quyền hạn tương ứng"
      : "Cập nhật thông tin và quyền hạn cho vai trò";

  return (
    <div className="role-mgmt__modal-overlay" onClick={onClose}>
      <form
        className="role-mgmt__modal"
        onSubmit={onSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="role-mgmt__modal-header">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button
            type="button"
            className="role-mgmt__modal-close"
            onClick={onClose}
            aria-label="Đóng"
            title="Đóng"
          >
            <X size={19} />
          </button>
        </div>

        <div className="role-mgmt__modal-body">
          <label className="role-mgmt__field">
            <span>Tên vai trò</span>
            <input
              value={form.roleName}
              maxLength={50}
              onChange={(event) =>
                onFieldChange("roleName", event.target.value)
              }
              autoFocus
            />
          </label>

          <label className="role-mgmt__field">
            <span>Mô tả</span>
            <textarea
              value={form.description}
              onChange={(event) =>
                onFieldChange("description", event.target.value)
              }
              rows={3}
            />
          </label>

          <div className="role-mgmt__permission-header">
            <span>Quyền hạn</span>
            <strong>{selectedCount} quyền được chọn</strong>
          </div>

          <div className="role-mgmt__permission-list">
            {permissionGroups.length === 0 ? (
              <div className="role-mgmt__empty">
                Chưa có danh sách quyền từ backend.
              </div>
            ) : (
              permissionGroups.map((group) => {
                const selectedInGroup = group.permissions.filter((permission) =>
                  form.permissionIds.includes(permission.permissionId)
                ).length;
                const checked =
                  selectedInGroup > 0 &&
                  selectedInGroup === group.permissions.length;

                return (
                  <section className="role-mgmt__permission-group" key={group.key}>
                    <label className="role-mgmt__permission-group-title">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          onSetGroupPermissions(group, event.target.checked)
                        }
                      />
                      <Lock size={16} />
                      <span>{group.label}</span>
                      <strong>
                        {selectedInGroup}/{group.permissions.length}
                      </strong>
                    </label>

                    <div className="role-mgmt__permission-options">
                      {group.permissions.map((permission) => (
                        <label
                          key={permission.permissionId}
                          className="role-mgmt__permission-option"
                        >
                          <input
                            type="checkbox"
                            checked={form.permissionIds.includes(
                              permission.permissionId
                            )}
                            onChange={() =>
                              onTogglePermission(permission.permissionId)
                            }
                          />
                          <KeyRound size={15} />
                          <span>
                            <strong>{permission.permissionName}</strong>
                            {permission.description && (
                              <small>{permission.description}</small>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </section>
                );
              })
            )}
          </div>

          {actionError && <p className="role-mgmt__form-error">{actionError}</p>}
        </div>

        <div className="role-mgmt__modal-footer">
          <button
            type="button"
            className="role-mgmt__btn role-mgmt__btn--ghost"
            onClick={onClose}
            disabled={actionLoading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="role-mgmt__btn role-mgmt__btn--primary"
            disabled={actionLoading}
          >
            {actionLoading ? "Đang lưu..." : mode === "create" ? "Tạo vai trò" : "Cập nhật"}
          </button>
        </div>
      </form>
    </div>
  );
};
