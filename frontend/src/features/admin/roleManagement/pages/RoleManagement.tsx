import { Plus, Search, ShieldCheck } from "lucide-react";

import { RoleModal } from "../components/RoleModal";
import { RoleStats } from "../components/RoleStats";
import { RoleTable } from "../components/RoleTable";
import { RoleTabs } from "../components/RoleTabs";
import { UserRoleTable } from "../components/UserRoleTable";
import { useRoleManagement } from "../hooks/useRoleManagement";

import "../styles/RoleManagement.css";

export default function RoleManagement() {
  const {
    activeTab,
    setActiveTab,
    keyword,
    setKeyword,
    loading,
    actionLoading,
    error,
    actionError,
    modalMode,
    form,
    stats,
    permissionGroups,
    filteredRoles,
    filteredUsers,
    roleOptions,
    openCreateModal,
    openEditModal,
    closeModal,
    updateFormField,
    togglePermission,
    setGroupPermissions,
    handleSubmitRole,
    handleDeleteRole,
    handleAssignUserRole,
  } = useRoleManagement();

  return (
    <div className="role-mgmt">
      <header className="role-mgmt__header">
        <div className="role-mgmt__header-icon">
          <ShieldCheck size={26} />
        </div>
        <div>
          <h1>Quản lý Phân quyền & Vai trò</h1>
          <p>Quản lý vai trò, quyền hạn và phân quyền cho người dùng</p>
        </div>
      </header>

      <RoleStats stats={stats} />

      <RoleTabs activeTab={activeTab} onChange={setActiveTab} />

      <section className="role-mgmt__panel">
        <div className="role-mgmt__panel-header">
          <div>
            <h2>
              {activeTab === "roles"
                ? "Quản lý Vai trò"
                : "Phân quyền Người dùng"}
            </h2>
            <p>
              {activeTab === "roles"
                ? "Tạo và quản lý các vai trò với quyền hạn tương ứng"
                : "Theo dõi và cập nhật vai trò cho từng người dùng"}
            </p>
          </div>

          <div className="role-mgmt__toolbar">
            <label className="role-mgmt__search">
              <Search size={17} />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={
                  activeTab === "roles"
                    ? "Tìm vai trò, quyền hạn..."
                    : "Tìm người dùng, email..."
                }
              />
            </label>

            {activeTab === "roles" && (
              <button
                type="button"
                className="role-mgmt__btn role-mgmt__btn--primary"
                onClick={openCreateModal}
              >
                <Plus size={17} />
                Thêm vai trò
              </button>
            )}
          </div>
        </div>

        {activeTab === "roles" ? (
          <RoleTable
            roles={filteredRoles}
            loading={loading}
            error={error}
            actionLoading={actionLoading}
            onEdit={openEditModal}
            onDelete={handleDeleteRole}
          />
        ) : (
          <UserRoleTable
            users={filteredUsers}
            roleOptions={roleOptions}
            loading={loading}
            error={error}
            actionLoading={actionLoading}
            onAssignRole={handleAssignUserRole}
          />
        )}
      </section>

      {modalMode && (
        <RoleModal
          mode={modalMode}
          form={form}
          permissionGroups={permissionGroups}
          actionLoading={actionLoading}
          actionError={actionError}
          onClose={closeModal}
          onSubmit={handleSubmitRole}
          onFieldChange={updateFormField}
          onTogglePermission={togglePermission}
          onSetGroupPermissions={setGroupPermissions}
        />
      )}
    </div>
  );
}
