import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, MouseEvent } from "react";

import { userApi, type UserFE } from "../../../../services/userApi";
import { roleService } from "../../roleManagement/services/roleService";
import type { RoleResponse } from "../../roleManagement/types/role";

type FormMode = "create" | "edit";
type AccountManagementTab = "staffAdmin" | "customers";

type UserFormState = {
  email: string;
  password: string;
  username: string;
  name: string;
  phone: string;
  gender: string;
  dob: string;
  role: string;
  status: boolean;
  point: string;
};

type UserFormField = keyof UserFormState;
type UserFormErrors = Partial<Record<UserFormField, string>>;
type RoleOption = {
  roleId?: number;
  roleName: string;
};

const emptyForm: UserFormState = {
  email: "",
  password: "",
  username: "",
  name: "",
  phone: "",
  gender: "",
  dob: "",
  role: "CUSTOMER",
  status: true,
  point: "0",
};

const staffAdminRoles = new Set(["ADMIN", "STAFF"]);

const normalizeRole = (role?: string) => role?.trim().toUpperCase() ?? "";

const getDefaultRoleByTab = (tab: AccountManagementTab) =>
  tab === "staffAdmin" ? "STAFF" : "CUSTOMER";

const fallbackRoleIdByName: Record<string, number> = {
  ADMIN: 1,
  CUSTOMER: 2,
  STAFF: 3,
};

const getRoleOptionId = (role: RoleResponse) => {
  const roleId = Number(role.roleId ?? role.id);

  return Number.isFinite(roleId) && roleId > 0 ? roleId : undefined;
};

const mapRoleOptions = (roles: RoleResponse[]): RoleOption[] =>
  roles.reduce<RoleOption[]>((options, role) => {
    const roleId = getRoleOptionId(role);
    const roleName = role.roleName?.trim();

    if (!roleName) return options;

    options.push(
      roleId
        ? {
            roleId,
            roleName,
          }
        : {
            roleName,
          }
    );

    return options;
  }, []);

const getRoleIdByName = (roleOptions: RoleOption[], role?: string) => {
  const normalizedRole = normalizeRole(role);

  return roleOptions.find(
    (option) => normalizeRole(option.roleName) === normalizedRole
  )?.roleId ?? fallbackRoleIdByName[normalizedRole];
};

const getRoleNameById = (roleOptions: RoleOption[], roleId?: number) =>
  roleOptions.find((option) => option.roleId === roleId)?.roleName;

const resolveRoleId = (roleOptions: RoleOption[], role?: string) =>
  getRoleIdByName(roleOptions, role) ??
  getRoleIdByName(roleOptions, "CUSTOMER") ??
  roleOptions[0]?.roleId;

const getRoleOptionsByTab = (
  roleOptions: RoleOption[],
  tab: AccountManagementTab
) => {
  const allowedRoles =
    tab === "staffAdmin" ? staffAdminRoles : new Set(["CUSTOMER"]);

  return roleOptions.filter((role) =>
    allowedRoles.has(normalizeRole(role.roleName))
  );
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

const formatDateInput = (date: Date | string) => {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toISOString().slice(0, 10);
};

const getGenderInputValue = (gender: string) => {
  const genderText = gender.trim().toUpperCase();

  if (["MALE", "NAM"].includes(genderText)) return "MALE";
  if (["FEMALE", "NỮ", "NU"].includes(genderText)) return "FEMALE";
  if (["OTHER", "KHÁC", "KHAC"].includes(genderText)) return "OTHER";

  return gender || "";
};

const toFormState = (user: UserFE): UserFormState => ({
  email: user.email || "",
  password: "",
  username: user.username || "",
  name: user.name || "",
  phone: user.phone || "",
  gender: getGenderInputValue(user.gender || ""),
  dob: formatDateInput(user.dob),
  role: user.role || "CUSTOMER",
  status: Boolean(user.status),
  point: String(user.point ?? 0),
});

const getErrorMessage = (err: any) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "Không thể lưu thông tin người dùng";

const validateUserForm = (
  form: UserFormState,
  mode: FormMode
): UserFormErrors => {
  const errors: UserFormErrors = {};
  const email = form.email.trim();
  const password = form.password.trim();
  const phone = form.phone.trim();

  if (!email) {
    errors.email = "Vui lòng nhập email";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email không hợp lệ";
  }

  if (mode === "create") {
    if (!password) {
      errors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      errors.password = "Mật khẩu phải từ 6 ký tự";
    }
  }

  if (!form.username.trim()) errors.username = "Vui lòng nhập tên đăng nhập";
  if (!form.name.trim()) errors.name = "Vui lòng nhập họ tên";

  if (!phone) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!/^0(3|5|7|8|9)\d{8}$/.test(phone)) {
    errors.phone = "Số điện thoại phải có 10 số và bắt đầu bằng 03, 05, 07, 08 hoặc 09";
  }

  if (!form.gender.trim()) errors.gender = "Vui lòng chọn giới tính";
  if (!form.dob.trim()) errors.dob = "Vui lòng chọn ngày sinh";

  return errors;
};

const parseBackendErrors = (err: any) => {
  const data = err?.response?.data;
  const errors: UserFormErrors = {};
  const fieldMap: Record<string, UserFormField> = {
    email: "email",
    password: "password",
    username: "username",
    name: "name",
    phone: "phone",
    gender: "gender",
    dob: "dob",
    roleName: "role",
    roleId: "role",
    isChangeAccount: "status",
    point: "point",
  };

  const setFieldError = (field: unknown, message: unknown) => {
    if (typeof field !== "string") return;

    const target = fieldMap[field];
    if (!target || errors[target]) return;

    errors[target] =
      typeof message === "string" && message.trim()
        ? message
        : "Giá trị không hợp lệ";
  };

  if (Array.isArray(data?.errors)) {
    data.errors.forEach((item: any) => {
      setFieldError(
        item?.field ?? item?.property ?? item?.name,
        item?.defaultMessage ?? item?.message ?? item?.reason
      );
    });
  }

  if (data?.errors && typeof data.errors === "object") {
    Object.entries(data.errors).forEach(([field, message]) => {
      setFieldError(field, message);
    });
  }

  return {
    summary:
      data?.message === "Invalid key"
        ? "Dữ liệu không hợp lệ. Vui lòng kiểm tra email, số điện thoại, ngày sinh và mật khẩu phải từ 6 ký tự"
        : getErrorMessage(err),
    errors,
  };
};

export const useCustomerManagement = () => {
  const [users, setUsers] = useState<UserFE[]>([]);
  const [allUsers, setAllUsers] = useState<UserFE[]>([]);
  const [activeTab, setActiveTab] =
    useState<AccountManagementTab>("staffAdmin");
  const [keyword, setKeyword] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserFE | null>(null);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [editingUser, setEditingUser] = useState<UserFE | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [currentUserId] = useState<number | null>(() => getCurrentUserId());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<UserFormErrors>({});
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const formRoleOptions = useMemo(
    () => getRoleOptionsByTab(roleOptions, activeTab),
    [activeTab, roleOptions]
  );

  const displayedUsers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return allUsers
      .filter((user) => {
        const role = normalizeRole(user.role);
        const isStaffAdmin = staffAdminRoles.has(role);

        if (activeTab === "staffAdmin" && !isStaffAdmin) return false;
        if (activeTab === "customers" && role !== "CUSTOMER") return false;

        if (!normalizedKeyword) return true;

        return [user.username, user.name, user.email, user.phone, user.role].some(
          (field) => field?.toLowerCase().includes(normalizedKeyword)
        );
      })
      .sort((first, second) => first.userId - second.userId);
  }, [activeTab, allUsers, keyword]);

  const accountCounts = useMemo(() => {
    return allUsers.reduce(
      (counts, user) => {
        const role = normalizeRole(user.role);

        if (staffAdminRoles.has(role)) {
          counts.staffAdmin += 1;
        } else if (role === "CUSTOMER") {
          counts.customers += 1;
        }

        return counts;
      },
      {
        staffAdmin: 0,
        customers: 0,
      },
    );
  }, [allUsers]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const summary = await userApi.getAllUsers({
        page: 0,
        size: 1,
      });
      const data = await userApi.getAllUsers({
        page: 0,
        size: Math.max(summary.totalElements, size),
      });

      setAllUsers(data.content);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError(getErrorMessage(err) || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [size]);

  const fetchRoles = useCallback(async () => {
    try {
      setRolesLoading(true);

      const roles = await roleService.getRoles();

      setRoleOptions(mapRoleOptions(roles));
    } catch (err: any) {
      console.error("Failed to fetch roles:", err);
      setActionError(getErrorMessage(err) || "Không thể tải danh sách vai trò");
      setRoleOptions([]);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchRoles, fetchUsers]);

  useEffect(() => {
    setPage(0);
  }, [activeTab, keyword]);

  useEffect(() => {
    const nextTotalPages = Math.max(1, Math.ceil(displayedUsers.length / size));

    if (page > nextTotalPages - 1) {
      setPage(nextTotalPages - 1);
      return;
    }

    const start = page * size;

    setUsers(displayedUsers.slice(start, start + size));
    setTotalPages(nextTotalPages);
    setTotalElements(displayedUsers.length);
  }, [displayedUsers, page, size]);

  const updateUserInList = useCallback((updatedUser: UserFE) => {
    setAllUsers((prev) =>
      prev.map((user) =>
        user.userId === updatedUser.userId ? updatedUser : user
      )
    );

    setSelectedUser((prev) =>
      prev?.userId === updatedUser.userId ? updatedUser : prev
    );
  }, []);

  const closeForm = useCallback(() => {
    setFormMode(null);
    setEditingUser(null);
    setForm(emptyForm);
    setActionError(null);
    setFieldErrors({});
  }, []);

  const openCreateForm = useCallback(() => {
    setForm({
      ...emptyForm,
      role: getDefaultRoleByTab(activeTab),
    });
    setEditingUser(null);
    setFormMode("create");
    setActionError(null);
    setFieldErrors({});
  }, [activeTab]);

  const openEditForm = useCallback((user: UserFE) => {
    setForm(toFormState(user));
    setEditingUser(user);
    setFormMode("edit");
    setActionError(null);
    setFieldErrors({});
  }, []);

  const updateFormField = useCallback(
    <T extends UserFormField>(field: T, value: UserFormState[T]) => {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
      setFieldErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    },
    []
  );

  const handleSubmitUser = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (actionLoading) return;

      try {
        setActionLoading(true);
        setActionError(null);
        setFieldErrors({});

        if (!formMode) return;

        const validationErrors = validateUserForm(form, formMode);

        if (Object.keys(validationErrors).length > 0) {
          setFieldErrors(validationErrors);
          setActionError("Vui lòng kiểm tra lại thông tin tài khoản");
          return;
        }

        if (formMode === "create") {
          const roleId = resolveRoleId(roleOptions, form.role);

          if (!roleId) {
            setFieldErrors({ role: "Vui lòng chọn vai trò hợp lệ" });
            setActionError("Không thể xác định Role ID từ danh sách vai trò");
            return;
          }

          const createdUser = await userApi.createUser({
            email: form.email.trim(),
            password: form.password.trim(),
            username: form.username.trim(),
            name: form.name.trim(),
            phone: form.phone.trim(),
            gender: form.gender.trim().toUpperCase(),
            dob: form.dob,
            roleName: form.role.trim().toUpperCase(),
            roleId,
            status: form.status,
          });
          const selectedRoleName =
            getRoleNameById(roleOptions, roleId) ?? form.role.trim().toUpperCase();

          setAllUsers((prev) => [
            {
              ...createdUser,
              role: createdUser.role || selectedRoleName,
              roleId: createdUser.roleId ?? roleId,
              status: createdUser.status ?? form.status,
            },
            ...prev,
          ]);
        } else if (formMode === "edit" && editingUser) {
          const nextRoleId =
            editingUser.roleId ??
            resolveRoleId(
              roleOptions,
              normalizeRole(editingUser.role) === "ADMIN"
                ? editingUser.role
                : form.role
            );

          if (!nextRoleId) {
            setFieldErrors({ role: "Vui lòng chọn vai trò hợp lệ" });
            setActionError("Không thể xác định Role ID từ danh sách vai trò");
            return;
          }

          const updatedUser = await userApi.updateUser({
            userId: editingUser.userId,
            username: form.username.trim(),
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            gender: form.gender.trim().toUpperCase(),
            dob: form.dob,
            status:
              normalizeRole(editingUser.role) === "ADMIN"
                ? editingUser.status
                : form.status,
            roleId: nextRoleId,
            point: Number(form.point) || 0,
          });

          updateUserInList({
            ...updatedUser,
            role: editingUser.role,
            status:
              normalizeRole(editingUser.role) === "ADMIN"
                ? editingUser.status
                : updatedUser.status,
          });
        }

        closeForm();
      } catch (err: any) {
        console.error("Save user failed:", err);
        console.error("Save user response:", err?.response?.data);
        const parsedError = parseBackendErrors(err);

        setFieldErrors(parsedError.errors);
        setActionError(parsedError.summary);
      } finally {
        setActionLoading(false);
      }
    },
    [
      actionLoading,
      closeForm,
      editingUser,
      form,
      formMode,
      roleOptions,
      updateUserInList,
    ]
  );

  const handleDeleteUser = useCallback(async (user: UserFE) => {
    if (normalizeRole(user.role) === "ADMIN") {
      alert("Không thể xóa tài khoản admin");
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa tài khoản "${user.username}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      await userApi.deleteUser(user.userId);
      setAllUsers((prev) => prev.filter((item) => item.userId !== user.userId));
      setSelectedUser((prev) => (prev?.userId === user.userId ? null : prev));
    } catch (err: any) {
      alert(getErrorMessage(err) || "Không thể xóa tài khoản");
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleUpdateStatus = useCallback(
    async (user: UserFE, event?: MouseEvent<HTMLButtonElement>) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (actionLoading) return;

      if (normalizeRole(user.role) === "ADMIN") {
        alert("Không thể ngừng hoạt động tài khoản admin");
        return;
      }

      try {
        setActionLoading(true);
        const nextStatus = !user.status;

        console.log("HANDLE UPDATE STATUS:", {
          userId: user.userId,
          currentStatus: user.status,
          nextStatus,
        });

        const updatedUser = await userApi.updateStatus(user.userId, nextStatus);

        updateUserInList({
          ...user,
          ...updatedUser,
          status: updatedUser.status ?? nextStatus,
        });
      } catch (err: any) {
        console.error("Update user status failed:", err);
        alert(getErrorMessage(err) || "Không thể cập nhật trạng thái tài khoản");
      } finally {
        setActionLoading(false);
      }
    },
    [actionLoading, updateUserInList]
  );

  const handleDisableUser = useCallback(
    async (user: UserFE) => {
      const confirmed = window.confirm(
        `Bạn có chắc muốn vô hiệu hóa tài khoản "${user.username}"?`
      );

      if (!confirmed) return;

      try {
        setActionLoading(true);
        await userApi.disableUser(user.userId);
        updateUserInList({ ...user, status: false });
      } catch (err: any) {
        alert(getErrorMessage(err) || "Không thể vô hiệu hóa tài khoản");
      } finally {
        setActionLoading(false);
      }
    },
    [updateUserInList]
  );

  return {
    list: users,
    activeTab,
    setActiveTab,
    accountCounts,
    totalElements,
    totalPages,
    currentPage: page,
    setPage,
    pageSize: size,
    keyword,
    setKeyword,
    selectedUser,
    setSelectedUser,
    formMode,
    editingUser,
    currentUserId,
    form,
    formRoleOptions,
    roleOptions,
    rolesLoading,
    loading,
    actionLoading,
    error,
    actionError,
    fieldErrors,
    filtered: users,
    closeForm,
    openCreateForm,
    openEditForm,
    updateFormField,
    handleSubmitUser,
    handleDeleteUser,
    handleUpdateStatus,
    handleDisableUser,
  };
};
