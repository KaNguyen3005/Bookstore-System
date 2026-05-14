import axiosClient from "./axiosClient";
import users from "../data/user1";

const IS_MOCK = false;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface UserFE {
  id?: number;
  userId: number;
  username: string;
  name: string;
  email?: string;
  phone: string;
  point: number;
  avatarUrl?: string;
  dob: Date;
  status?: boolean;
  gender: string;
  role: string;
  tier?: string;
  address?: unknown;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  username: string;
  name: string;
  phone: string;
  gender: string;
  dob: string;
  roleName: string;
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
  point?: number;
};

const clean = (value: any) =>
  typeof value === "string" ? value.trim() : value;

const normalizeStatus = (status: any) => {
  if (status === undefined || status === null) return true;
  if (typeof status === "boolean") return status;

  const normalized = String(status ?? "").toUpperCase();

  if (["ACTIVE", "ENABLED", "UNLOCKED"].includes(normalized)) return true;
  if (["INACTIVE", "DISABLED", "BANNED", "LOCKED"].includes(normalized)) {
    return false;
  }

  return Boolean(status);
};

const normalizeRole = (role: any) => {
  if (typeof role === "string") return role;

  return role?.name ?? role?.roleName ?? "";
};

const normalizeGender = (gender: any) => {
  const normalized = clean(gender)?.toUpperCase();

  if (!normalized) return "";
  if (["MALE", "NAM"].includes(normalized)) return "MALE";
  if (["FEMALE", "NỮ", "NU"].includes(normalized)) return "FEMALE";
  if (["OTHER", "KHÁC", "KHAC"].includes(normalized)) return "OTHER";

  return clean(gender) ?? "";
};

const getUsersPayload = (data: any) => {
  const payload = data?.result ?? data?.data ?? data;
  const usersPayload =
    payload?.content ?? payload?.items ?? payload?.users ?? payload;

  return Array.isArray(usersPayload) ? usersPayload : [];
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
      [firstName, lastName].filter(Boolean).join(" ")
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
    status: normalizeStatus(
      u.status ?? u.active ?? u.enabled ?? u.isActive
    ),
    gender: normalizeGender(u.gender),
    role: normalizeRole(u.role ?? u.roleName ?? u.role_id),
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
});

export const userApi = {
  // ================= GET ME =================

    getMe: async (): Promise<UserFE | null> => {
      try {
        const res: any = await axiosClient.get("/users/me");

        return mapToFE(getUserPayload(res.data));
      } catch (error) {
        console.error("getMe failed:", error);
        return null;
      }
    },

      // ================= GET ALL =================
      getAllUsers: async (): Promise<UserFE[]> => {
        if (IS_MOCK) {
          await delay(500);
          return users.map(mapToFE);
        }

        const res = await axiosClient.get("/users", {
          skipAuthRedirect: true,
        } as any);

        return getUsersPayload(res.data).map(mapToFE);
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

    const res = await axiosClient.post(
      "/users",
      mapToCreatePayload(data)
    );

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
  updateUser: async (data: UserFE | UpdateUserPayload): Promise<UserFE> => {
    if (IS_MOCK) {
      await delay(500);

      return mapToFE(data);
    }

    const payload = mapToUpdatePayload(data);

    const res = await axiosClient.patch(
      `/users/${data.userId}`,
      payload
    );

    return mapToFE(getUserPayload(res.data));
  },

  // ================= UPDATE ME =================
  updateMe: async (data: Partial<UserFE>) => {
    const res: any = await axiosClient.patch(
      "/users/me",
      data
    );

    return mapToFE(getUserPayload(res.data));
  },

  // ================= DISABLE =================
  disableUser: async (id: number): Promise<void> => {
    await axiosClient.post(
      `/users/${id}/disable`
    );
  },

  // ================= UPDATE STATUS =================
  updateStatus: async (
    id: number,
    status: boolean
  ): Promise<void> => {
    await axiosClient.put(
      `/users/${id}/status`,
      { status }
    );
  },

  // ================= DELETE =================
  deleteUser: async (id: number): Promise<void> => {
    await axiosClient.delete(`/users/${id}`);
  },
};
