import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { userApi, type UserFE } from "../../../../services/userApi";

type FormMode = "create" | "edit";

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

const formatDateInput = (date: Date) => {
  if (!date || Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
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

const validateForm = (
  form: UserFormState,
  formMode: FormMode | null,
  users: UserFE[],
  editingUser: UserFE | null
) => {
  const errors: UserFormErrors = {};
  const username = form.username.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const name = form.name.trim();
  const currentUserId = formMode === "edit" ? editingUser?.userId : null;
  const isOtherUser = (user: UserFE) => user.userId !== currentUserId;

  if (!email) errors.email = "Email là bắt buộc";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email không đúng định dạng";
  }

  if (!username) errors.username = "Tên đăng nhập là bắt buộc";
  else if (username.length < 3) {
    errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username = "Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới";
  }

  if (!name) errors.name = "Họ tên là bắt buộc";
  else if (name.length < 6) errors.name = "Họ tên phải có ít nhất 6 ký tự";

  if (!phone) errors.phone = "Số điện thoại là bắt buộc";
  else if (!/^(0|\+84)[0-9]{9}$/.test(phone)) {
    errors.phone = "Số điện thoại phải có dạng 0xxxxxxxxx hoặc +84xxxxxxxxx";
  }

  if (!form.gender) errors.gender = "Vui lòng chọn giới tính";

  if (!form.dob) {
    errors.dob = "Ngày sinh là bắt buộc";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.dob)) {
    errors.dob = "Ngày sinh phải có định dạng yyyy-mm-dd";
  } else {
    const dob = new Date(`${form.dob}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(dob.getTime())) errors.dob = "Ngày sinh không hợp lệ";
    else if (dob > today) errors.dob = "Ngày sinh không được ở tương lai";
  }

  if (!form.role) errors.role = "Vui lòng chọn vai trò";

  const password = form.password.trim();

  if (formMode === "create" && !password) {
    errors.password = "Mật khẩu là bắt buộc";
  } else if (
    password &&
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,50}$/.test(
      password
    )
  ) {
    errors.password =
      "Mật khẩu phải có 6-50 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
  }

  if (
    username &&
    users.some(
      (user) =>
        isOtherUser(user) &&
        user.username?.toLowerCase() === username.toLowerCase()
    )
  ) {
    errors.username = "Tên đăng nhập đã tồn tại";
  }

  if (
    email &&
    users.some(
      (user) =>
        isOtherUser(user) && user.email?.toLowerCase() === email.toLowerCase()
    )
  ) {
    errors.email = "Email đã tồn tại";
  }

  if (
    phone &&
    users.some((user) => isOtherUser(user) && user.phone?.trim() === phone)
  ) {
    errors.phone = "Số điện thoại đã tồn tại";
  }

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
        ? "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường bắt buộc và định dạng mật khẩu"
        : getErrorMessage(err),
    errors,
  };
};

export const useCustomerManagement = () => {
  const [list, setList] = useState<UserFE[]>([]);
  const [keyword, setKeyword] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserFE | null>(null);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [editingUser, setEditingUser] = useState<UserFE | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<UserFormErrors>({});

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await userApi.getAllUsers();

      setList(data);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError(getErrorMessage(err) || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserInList = useCallback((updatedUser: UserFE) => {
    setList((prev) =>
      prev.map((user) =>
        user.userId === updatedUser.userId ? updatedUser : user
      )
    );

    setSelectedUser((prev) =>
      prev?.userId === updatedUser.userId ? updatedUser : prev
    );
  }, []);

  const filtered = useMemo(() => {
    const keywordLower = keyword.trim().toLowerCase();

    if (!keywordLower) return list;

    return list.filter((user) =>
      [user.username, user.name, user.email, user.phone, user.role].some(
        (field) => String(field ?? "").toLowerCase().includes(keywordLower)
      )
    );
  }, [keyword, list]);

  const closeForm = useCallback(() => {
    setFormMode(null);
    setEditingUser(null);
    setForm(emptyForm);
    setActionError(null);
    setFieldErrors({});
  }, []);

  const openCreateForm = useCallback(() => {
    setForm(emptyForm);
    setEditingUser(null);
    setFormMode("create");
    setActionError(null);
    setFieldErrors({});
  }, []);

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

        const validationErrors = validateForm(
          form,
          formMode,
          list,
          editingUser
        );

        if (Object.keys(validationErrors).length > 0) {
          setFieldErrors(validationErrors);
          setActionError("Vui lòng kiểm tra lại các trường thông tin");
          return;
        }

        if (formMode === "create") {
          const createdUser = await userApi.createUser({
            email: form.email,
            password: form.password.trim(),
            username: form.username,
            name: form.name,
            phone: form.phone,
            gender: form.gender,
            dob: form.dob,
            roleName: form.role,
          });

          setList((prev) => [createdUser, ...prev]);
        } else if (formMode === "edit" && editingUser) {
          const updatedUser = await userApi.updateUser({
            userId: editingUser.userId,
            username: form.username,
            password: form.password.trim() || undefined,
            name: form.name,
            email: form.email,
            phone: form.phone,
            gender: form.gender,
            dob: form.dob,
            status: form.status,
            point: Number(form.point) || 0,
          });

          updateUserInList(updatedUser);
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
      list,
      updateUserInList,
    ]
  );

  const handleDeleteUser = useCallback(async (user: UserFE) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa tài khoản "${user.username}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      await userApi.deleteUser(user.userId);
      setList((prev) => prev.filter((item) => item.userId !== user.userId));
      setSelectedUser((prev) => (prev?.userId === user.userId ? null : prev));
    } catch (err: any) {
      alert(getErrorMessage(err) || "Không thể xóa tài khoản");
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleUpdateStatus = useCallback(
    async (user: UserFE) => {
      try {
        setActionLoading(true);
        const nextStatus = !user.status;

        await userApi.updateStatus(user.userId, nextStatus);
        updateUserInList({ ...user, status: nextStatus });
      } catch (err: any) {
        alert(getErrorMessage(err) || "Không thể cập nhật trạng thái tài khoản");
      } finally {
        setActionLoading(false);
      }
    },
    [updateUserInList]
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
    handleDisableUser,
  };
};
