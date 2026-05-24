import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { roleService } from "../services/roleService";
import type {
  PermissionGroup,
  PermissionResponse,
  RoleFormState,
  RoleItem,
  RoleManagementTab,
  RoleModalMode,
  RoleResponse,
  UserRoleItem,
  UserRoleResponse,
} from "../types/role";

const emptyForm: RoleFormState = {
  roleName: "",
  description: "",
  permissionIds: [],
};

const systemRoleNames = new Set([
  "ADMIN",
  "STAFF",
  "CUSTOMER",
  "USER",
]);

const customerRoleNames = new Set(["CUSTOMER", "USER"]);
const assignmentBlockedRoleNames = new Set(["ADMIN", "CUSTOMER", "USER"]);
const permissionProtectedRoleNames = new Set(["ADMIN", "CUSTOMER", "USER"]);

const isCustomerRole = (roleName?: string) =>
  customerRoleNames.has(normalizeText(roleName));

const isProtectedSystemRole = (roleName?: string) =>
  systemRoleNames.has(normalizeText(roleName));

const isAssignmentBlockedRole = (roleName?: string) =>
  assignmentBlockedRoleNames.has(normalizeText(roleName));

const isPermissionProtectedRole = (roleName?: string) =>
  permissionProtectedRoleNames.has(normalizeText(roleName));

const roleDescriptions: Record<string, string> = {
  ADMIN: "Quản trị viên với quyền vận hành hệ thống",
  STAFF: "Nhân viên xử lý nghiệp vụ bán hàng",
  EDITOR: "Biên tập viên có quyền quản lý nội dung",
  AUTHOR: "Tác giả có thể tạo và chỉnh sửa nội dung của mình",
  CUSTOMER: "Khách hàng sử dụng hệ thống mua sách",
  USER: "Người dùng tiêu chuẩn của hệ thống",
};

const fallbackRoleIdByName: Record<string, number> = {
  ADMIN: 1,
  CUSTOMER: 2,
  USER: 2,
  STAFF: 3,
};

const groupLabels: Record<string, string> = {
  USER: "Người dùng",
  ACCOUNT: "Tài khoản",
  ROLE: "Vai trò",
  PERMISSION: "Quyền hạn",
  BOOK: "Sách",
  PRODUCT: "Sản phẩm",
  CATEGORY: "Danh mục",
  AUTHOR: "Tác giả",
  PUBLISHER: "Nhà xuất bản",
  ORDER: "Đơn hàng",
  PAYMENT: "Thanh toán",
  VOUCHER: "Voucher",
  REVIEW: "Đánh giá",
  REPORT: "Báo cáo",
  DASHBOARD: "Dashboard",
  CONTENT: "Nội dung",
  SYSTEM: "Hệ thống",
};

const getErrorMessage = (err: any) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "Không thể xử lý yêu cầu";

const normalizeText = (value?: string) =>
  String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

const getPermissionName = (permission: string | PermissionResponse) =>
  typeof permission === "string" ? permission : permission.permissionName;

const toPermissionIds = (
  role: RoleResponse,
  permissions: PermissionResponse[]
) => {
  if (Array.isArray(role.permissionIds)) return role.permissionIds;

  const selectedNames = new Set(
    (role.permissions ?? []).map((permission) =>
      normalizeText(getPermissionName(permission))
    )
  );

  return permissions
    .filter((permission) =>
      selectedNames.has(normalizeText(permission.permissionName))
    )
    .map((permission) => permission.permissionId);
};

const toRoleId = (role: RoleResponse) => {
  const rawId = role.roleId ?? role.role_id ?? role.id;
  const roleId = Number(rawId);

  if (Number.isFinite(roleId) && roleId > 0) return roleId;

  return fallbackRoleIdByName[normalizeText(role.roleName)];
};

const toUserRoleId = (user: UserRoleResponse) => {
  const roleId = Number(user.roleId ?? user.role_id);

  return Number.isFinite(roleId) && roleId > 0 ? roleId : undefined;
};

const toRoleItem = (
  role: RoleResponse,
  permissions: PermissionResponse[],
  users: UserRoleItem[],
  index: number
): RoleItem => {
  const roleName = role.roleName || "ROLE_UNKNOWN";
  const normalizedRoleName = normalizeText(roleName);
  const roleId = toRoleId(role);
  const permissionNames = (role.permissions ?? []).map(getPermissionName);
  const permissionIds = toPermissionIds(role, permissions);
  const responseUserCount = Number(role.userCount);
  const userCount =
    Number.isFinite(responseUserCount) && responseUserCount >= 0
      ? responseUserCount
      : users.filter(
          (user) =>
            (roleId && user.roleId === roleId) ||
            normalizeText(user.roleName) === normalizedRoleName
        ).length;

  return {
    clientId: String(roleId ?? `${normalizedRoleName}-${index}`),
    roleId,
    roleName,
    description:
      role.description ||
      roleDescriptions[normalizedRoleName] ||
      "Vai trò tùy chỉnh trong hệ thống",
    permissions: permissionNames,
    permissionIds,
    userCount,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
    isSystemRole: isProtectedSystemRole(normalizedRoleName),
  };
};

const getStatusBoolean = (status: UserRoleResponse["status"]) => {
  if (typeof status === "boolean") return status;
  if (status === undefined || status === null) return true;

  const statusText = normalizeText(String(status));

  if (["ACTIVE", "ENABLED", "TRUE"].includes(statusText)) return true;
  if (["INACTIVE", "DISABLED", "LOCKED", "FALSE"].includes(statusText)) {
    return false;
  }

  return Boolean(status);
};

const toUserRoleItem = (user: UserRoleResponse): UserRoleItem => ({
  userId: Number(user.userId ?? user.id),
  username: user.username || "",
  name: user.name || "Chưa cập nhật",
  email: user.email || "Chưa cập nhật",
  roleName: user.role || user.roleName || "Chưa phân quyền",
  roleId: toUserRoleId(user),
  status: getStatusBoolean(user.status),
  avatarUrl: user.avatarUrl,
});

const getPermissionGroupKey = (permissionName: string) => {
  const normalizedName = normalizeText(permissionName);
  const [firstPart] = normalizedName.split(/[_:. -]/).filter(Boolean);

  if (groupLabels[firstPart]) return firstPart;
  if (normalizedName.includes("USER")) return "USER";
  if (normalizedName.includes("ROLE")) return "ROLE";
  if (normalizedName.includes("ORDER")) return "ORDER";
  if (normalizedName.includes("BOOK") || normalizedName.includes("PRODUCT")) {
    return "PRODUCT";
  }
  if (normalizedName.includes("VOUCHER")) return "VOUCHER";
  if (normalizedName.includes("REPORT") || normalizedName.includes("STAT")) {
    return "REPORT";
  }

  return "SYSTEM";
};

const buildPermissionGroups = (
  permissions: PermissionResponse[]
): PermissionGroup[] => {
  const groups = new Map<string, PermissionResponse[]>();

  permissions.forEach((permission) => {
    const key = getPermissionGroupKey(permission.permissionName);
    const current = groups.get(key) ?? [];

    groups.set(key, [...current, permission]);
  });

  return Array.from(groups.entries())
    .map(([key, groupPermissions]) => ({
      key,
      label: groupLabels[key] ?? key,
      permissions: groupPermissions,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "vi"));
};

const isRecent = (value?: string) => {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - date.getTime() <= sevenDays;
};

const getCurrentUserId = () => {
  try {
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const userId = Number(user?.userId ?? user?.id);

    return Number.isFinite(userId) && userId > 0 ? userId : null;
  } catch {
    return null;
  }
};

export const useRoleManagement = () => {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [users, setUsers] = useState<UserRoleItem[]>([]);
  const [activeTab, setActiveTab] = useState<RoleManagementTab>("roles");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<RoleModalMode | null>(null);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [form, setForm] = useState<RoleFormState>(emptyForm);
  const [currentUserId] = useState<number | null>(() => getCurrentUserId());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [rolePayload, permissionPayload, userPayload] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissions(),
        roleService.getUsers(),
      ]);

      const baseUsers = userPayload.map(toUserRoleItem);
      const mappedRoles = rolePayload.map((role, index) =>
        toRoleItem(role, permissionPayload, baseUsers, index)
      );
      const roleIdByName = new Map(
        mappedRoles
          .filter((role) => role.roleId)
          .map((role) => [normalizeText(role.roleName), role.roleId as number])
      );
      const mappedUsers = baseUsers.map((user) => ({
        ...user,
        roleId: user.roleId ?? roleIdByName.get(normalizeText(user.roleName)),
      }));

      setPermissions(permissionPayload);
      setUsers(mappedUsers);
      setRoles(mappedRoles);
    } catch (err: any) {
      console.error("Failed to fetch role management data:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const permissionGroups = useMemo(
    () => buildPermissionGroups(permissions),
    [permissions]
  );

  const stats = useMemo(
    () => ({
      totalRoles: roles.length,
      assignedUsers: users.filter((user) => user.roleName !== "Chưa phân quyền")
        .length,
      totalPermissions: permissions.length,
      recentChanges: roles.filter(
        (role) => isRecent(role.updatedAt) || isRecent(role.createdAt)
      ).length,
    }),
    [permissions.length, roles, users]
  );

  const filteredRoles = useMemo(() => {
    const searchValue = keyword.trim().toLowerCase();

    if (!searchValue) return roles;

    return roles.filter((role) =>
      [
        role.roleName,
        role.description,
        role.permissions.join(" "),
        String(role.userCount),
      ].some((field) => field.toLowerCase().includes(searchValue))
    );
  }, [keyword, roles]);

  const filteredUsers = useMemo(() => {
    const searchValue = keyword.trim().toLowerCase();
    const manageableUsers = users.filter(
      (user) => !isAssignmentBlockedRole(user.roleName)
    );

    if (!searchValue) return manageableUsers;

    return manageableUsers.filter((user) =>
      [user.username, user.name, user.email, user.roleName].some((field) =>
        field.toLowerCase().includes(searchValue)
      )
    );
  }, [keyword, users]);

  const roleOptions = useMemo(
    () =>
      roles
        .filter((role) => role.roleId)
        .filter((role) => !isAssignmentBlockedRole(role.roleName))
        .map((role) => ({
          roleId: role.roleId as number,
          roleName: role.roleName,
        })),
    [roles]
  );

  const openCreateModal = useCallback(() => {
    setForm(emptyForm);
    setEditingRole(null);
    setActionError(null);
    setModalMode("create");
  }, []);

  const openEditModal = useCallback((role: RoleItem) => {
    if (isPermissionProtectedRole(role.roleName)) {
      alert("Không thể thay đổi quyền của vai trò admin hoặc khách hàng");
      return;
    }

    setForm({
      roleName: role.roleName,
      description: role.description,
      permissionIds: role.permissionIds,
    });
    setEditingRole(role);
    setActionError(null);
    setModalMode("edit");
  }, []);

  const closeModal = useCallback(() => {
    setModalMode(null);
    setEditingRole(null);
    setForm(emptyForm);
    setActionError(null);
  }, []);

  const updateFormField = useCallback(
    <T extends keyof RoleFormState>(field: T, value: RoleFormState[T]) => {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
      setActionError(null);
    },
    []
  );

  const togglePermission = useCallback((permissionId: number) => {
    setForm((prev) => {
      const selected = new Set(prev.permissionIds);

      if (selected.has(permissionId)) {
        selected.delete(permissionId);
      } else {
        selected.add(permissionId);
      }

      return {
        ...prev,
        permissionIds: Array.from(selected),
      };
    });
  }, []);

  const setGroupPermissions = useCallback(
    (group: PermissionGroup, checked: boolean) => {
      setForm((prev) => {
        const selected = new Set(prev.permissionIds);

        group.permissions.forEach((permission) => {
          if (checked) {
            selected.add(permission.permissionId);
          } else {
            selected.delete(permission.permissionId);
          }
        });

        return {
          ...prev,
          permissionIds: Array.from(selected),
        };
      });
    },
    []
  );

  const handleSubmitRole = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (actionLoading) return;

      const roleName = form.roleName.trim();

      if (modalMode === "edit" && isPermissionProtectedRole(editingRole?.roleName)) {
        setActionError("Không thể thay đổi quyền của vai trò admin hoặc khách hàng");
        return;
      }

      if (!roleName) {
        setActionError("Tên vai trò không được để trống");
        return;
      }

      try {
        setActionLoading(true);
        setActionError(null);

        const payload = {
          roleName,
          permissionIds: form.permissionIds,
        };

        if (modalMode === "create") {
          await roleService.createRole(payload);
        } else if (modalMode === "edit" && editingRole?.roleId) {
          await roleService.updateRole(editingRole.roleId, payload);
        } else {
          throw new Error(
            "Backend chưa trả roleId cho vai trò này nên không thể cập nhật"
          );
        }

        await fetchData();
        closeModal();
      } catch (err: any) {
        console.error("Save role failed:", err);
        setActionError(getErrorMessage(err));
      } finally {
        setActionLoading(false);
      }
    },
    [
      actionLoading,
      closeModal,
      editingRole?.roleId,
      editingRole?.roleName,
      fetchData,
      form.permissionIds,
      form.roleName,
      modalMode,
    ]
  );

  const handleDeleteRole = useCallback(
    async (role: RoleItem) => {
      if (isProtectedSystemRole(role.roleName)) {
        alert("Không được xóa các vai trò có sẵn của hệ thống");
        return;
      }

      if (!role.roleId) {
        alert("Backend chưa trả roleId cho vai trò này nên không thể xóa");
        return;
      }

      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa vai trò "${role.roleName}"?`
      );

      if (!confirmed) return;

      try {
        setActionLoading(true);
        await roleService.deleteRole(role.roleId);
        await fetchData();
      } catch (err: any) {
        alert(getErrorMessage(err));
      } finally {
        setActionLoading(false);
      }
    },
    [fetchData]
  );

  const handleAssignUserRole = useCallback(
    async (userId: number, roleId: number) => {
      if (userId === currentUserId) {
        alert("Admin không thể tự chỉnh quyền của chính tài khoản đang đăng nhập");
        return;
      }

      try {
        const targetRole = roles.find((role) => role.roleId === roleId);

        if (!targetRole || isAssignmentBlockedRole(targetRole.roleName)) {
          alert("Không thể phân quyền người dùng thành vai trò admin hoặc khách hàng");
          return;
        }

        setActionLoading(true);
        await roleService.updateUserRole(userId, roleId);
        await fetchData();
      } catch (err: any) {
        alert(getErrorMessage(err));
      } finally {
        setActionLoading(false);
      }
    },
    [currentUserId, fetchData, roles]
  );

  return {
    roles,
    permissions,
    users,
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
    editingRole,
    stats,
    permissionGroups,
    filteredRoles,
    filteredUsers,
    roleOptions,
    currentUserId,
    refresh: fetchData,
    openCreateModal,
    openEditModal,
    closeModal,
    updateFormField,
    togglePermission,
    setGroupPermissions,
    handleSubmitRole,
    handleDeleteRole,
    handleAssignUserRole,
  };
};
