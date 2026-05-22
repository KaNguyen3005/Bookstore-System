import axiosClient from "./axiosClient";
import users from "../data/user1";

const IS_MOCK = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface UserFE {
  id?: number;
  userId: number;
  username: string;
  name: string;
  email?: string;
  phone: string;
  point: number;
  avatarUrl?: string;
  dob: Date | string;
  status?: boolean;
  gender: string;
  role: string;
  roleId?: number;
  tier?: string;
  address?: unknown;
}

export interface UsersResponse {
  content: UserFE[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export type GetUsersParams = {
  page?: number;
  size?: number;
};

export interface CreateUserPayload {
  email: string;
  password: string;
  username: string;
  name: string;
  phone: string;
  gender: string;
  dob: string;
  roleName?: string;
  roleId: number;
  status?: boolean;
}

export type UpdateUserPayload = {
  userId: number;
  username?: string;
  password?: string;
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dob?: Date | string;
  status?: boolean;
  roleId?: number;
  point?: number;
};

const clean = (value: any) =>
  typeof value === "string" ? value.trim() : value;

const getStatusBoolean = (status: any) => {
  if (status === undefined || status === null) return true;
  if (typeof status === "boolean") return status;

  const statusText = String(status ?? "").toUpperCase();

  if (["ACTIVE", "ENABLED", "UNLOCKED"].includes(statusText)) return true;
  if (["INACTIVE", "DISABLED", "BANNED", "LOCKED"].includes(statusText)) {
    return false;
  }

  return Boolean(status);
};

const getRoleName = (role: any) => {
  if (typeof role === "string") return role;

  return role?.name ?? role?.roleName ?? "";
};

const getRoleId = (u: any) => {
  const roleId = Number(u.roleId ?? u.role_id ?? u.role?.roleId ?? u.role?.id);

  return Number.isFinite(roleId) && roleId > 0 ? roleId : undefined;
};

const getGenderCode = (gender: any) => {
  const genderText = clean(gender)?.toUpperCase();

  if (!genderText) return "";
  if (["MALE", "NAM"].includes(genderText)) return "MALE";
  if (["FEMALE", "NỮ", "NU"].includes(genderText)) return "FEMALE";
  if (["OTHER", "KHÁC", "KHAC"].includes(genderText)) return "OTHER";

  return clean(gender) ?? "";
};

const toUsersResponse = (data: any): UsersResponse => {
  const result = data.result;

  return {
    content: result.content.map(mapToFE),
    totalPages: result.totalPages,
    totalElements: result.totalElements,
    size: result.size,
    number: result.number,
  };
};

const getUserPayload = (data: any) => data?.result ?? data?.data ?? data;

const formatDatePayload = (date?: Date | string) => {
  if (!date) return undefined;
  if (typeof date === "string") return date;
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toISOString().slice(0, 10);
};

const mapToFE = (u: any = {}): UserFE => {
  const userId = Number(u.userId ?? u.user_id ?? u.id ?? 0);
  const firstName = clean(u.firstName ?? u.first_name ?? u.firstname);
  const lastName = clean(u.lastName ?? u.last_name ?? u.lastname);
  const name = clean(
    u.name ??
      u.fullName ??
      u.fullname ??
      [firstName, lastName].filter(Boolean).join(" "),
  );

  return {
    id: userId,
    userId,
    username: clean(u.username) ?? "",
    name: name ?? "",
    email: clean(u.email),
    phone: clean(u.phone) ?? "",
    point: Number(u.point ?? 0),
    avatarUrl: u.avatarUrl ?? u.avatar_url,
    dob: u.dob || u.birth ? new Date(u.dob ?? u.birth) : new Date(),
    status: getStatusBoolean(u.status ?? u.active ?? u.enabled ?? u.isActive),
    gender: getGenderCode(u.gender),
    role: getRoleName(u.role ?? u.roleName ?? u.role_id),
    roleId: getRoleId(u),
    tier: u.tier,
    address: u.address,
  };
};

const mapToUpdatePayload = (u: UserFE | UpdateUserPayload) => ({
  username: u.username,
  password: "password" in u ? u.password : undefined,
  name: u.name,
  email: u.email,
  phone: u.phone,
  gender: u.gender,
  point: u.point,
  dob: formatDatePayload(u.dob),
  roleId: u.roleId,
  isChangeAccount: u.status,
});

const mapToCreatePayload = (u: CreateUserPayload) => ({
  email: clean(u.email),
  password: u.password,
  username: clean(u.username),
  name: clean(u.name),
  phone: clean(u.phone),
  gender: clean(u.gender),
  dob: u.dob,
  roleName: clean(u.roleName),
  roleId: u.roleId,
  isChangeAccount: u.status,
});

export const userApi = {
  // ================= GET ME =================

  getMe: async (): Promise<UserFE | null> => {
    try {
      const res: any = await axiosClient.get("/users/me", {
        skipAuthRedirect: true,
      } as any);

      return mapToFE(getUserPayload(res.data));
    } catch (error) {
      console.error("getMe failed:", error);
      return null;
    }
  },

  // ================= GET ALL =================
  getAllUsers: async (params?: GetUsersParams): Promise<UsersResponse> => {
    if (IS_MOCK) {
      await delay(500);
      const mappedUsers = users.map(mapToFE);
      const size = params?.size ?? 10;
      const page = params?.page ?? 0;
      const start = page * size;

      return {
        content: mappedUsers.slice(start, start + size),
        totalPages: Math.max(1, Math.ceil(mappedUsers.length / size)),
        totalElements: mappedUsers.length,
        size,
        number: page,
      };
    }

    const res = await axiosClient.get("/users", {
      params,
      skipAuthRedirect: true,
    } as any);

    return toUsersResponse(res.data);
  },

  // ================= CREATE =================
  createUser: async (data: CreateUserPayload): Promise<UserFE> => {
    if (IS_MOCK) {
      await delay(500);

      return mapToFE({
        ...data,
        userId: Date.now(),
        point: 0,
      });
    }

    const res = await axiosClient.post("/users", mapToCreatePayload(data));

    return mapToFE(getUserPayload(res.data));
  },

  // ================= GET BY ID =================
  getUserById: async (id: number): Promise<UserFE | null> => {
    if (IS_MOCK) {
      await delay(500);

      const user = users.find((u: any) => u.userId === id);

      return user ? mapToFE(user) : null;
    }

    const res = await axiosClient.get(`/users/${id}`);

    return mapToFE(getUserPayload(res.data));
  },

  // ================= UPDATE =================
  updateMe: async (data: Partial<UserFE>) => {
    const payload = {
      username: data.username,
      name: data.name,
      phone: data.phone,
      gender: data.gender,
      dob: formatDatePayload(data.dob),
      status: data.status,
    };

    // remove undefined/null/""
    Object.keys(payload).forEach((key) => {
      const k = key as keyof typeof payload;

      if (
        payload[k] === undefined ||
        payload[k] === null ||
        payload[k] === ""
      ) {
        delete payload[k];
      }
    });

    console.log("UPDATE ME PAYLOAD", payload);

    const res: any = await axiosClient.patch("/users/me", payload);

    return mapToFE(getUserPayload(res.data));
  },

  updateUser: async (data: UpdateUserPayload): Promise<UserFE> => {
    const res = await axiosClient.patch(
      `/users/${data.userId}`,
      mapToUpdatePayload(data),
    );

    return mapToFE(getUserPayload(res.data));
  },

  // ================= DISABLE =================
  disableUser: async (id: number): Promise<void> => {
    await axiosClient.post(`/users/${id}/disable`);
  },

  // ================= UPDATE STATUS =================
  updateStatus: async (id: number, status: boolean): Promise<UserFE> => {
    const res = await axiosClient.put(`/users/${id}/status`, {
      status,
    });

    return mapToFE(getUserPayload(res.data));
  },

  // ================= DELETE =================
  deleteUser: async (id: number): Promise<void> => {
    await axiosClient.delete(`/users/${id}`);
  },

  // ================= UPDATE AVATAR =================
  updateAvatar: async (file: File): Promise<UserFE> => {
    const formData = new FormData();

    formData.append("avatar", file);

    const res = await axiosClient.patch("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return mapToFE(getUserPayload(res.data));
  },
};
