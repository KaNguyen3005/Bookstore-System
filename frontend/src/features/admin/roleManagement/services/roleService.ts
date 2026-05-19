import axiosClient from "../../../../services/axiosClient";
import type {
  ApiResponse,
  PermissionResponse,
  RoleRequest,
  RoleResponse,
  UserRoleResponse,
} from "../types/role";

const getPayload = (data: any) => data?.result ?? data?.data ?? data;

const getArrayPayload = <T>(data: any): T[] => {
  const payload = getPayload(data);
  const items = payload?.content ?? payload;

  return Array.isArray(items) ? items : [];
};

export const roleService = {
  getRoles: async (): Promise<RoleResponse[]> => {
    const res = await axiosClient.get<ApiResponse<RoleResponse[]>>(
      "/roles",
      { skipAuthRedirect: true } as any
    );

    return getArrayPayload<RoleResponse>(res.data);
  },

  createRole: async (payload: RoleRequest): Promise<RoleResponse> => {
    const res = await axiosClient.post<ApiResponse<RoleResponse>>(
      "/roles",
      payload
    );

    return res.data.result;
  },

  updateRole: async (
    roleId: number,
    payload: RoleRequest
  ): Promise<RoleResponse> => {
    const res = await axiosClient.patch<ApiResponse<RoleResponse>>(
      `/roles/${roleId}`,
      payload
    );

    return res.data.result;
  },

  deleteRole: async (roleId: number): Promise<void> => {
    await axiosClient.delete(`/roles/${roleId}`);
  },

  getPermissions: async (): Promise<PermissionResponse[]> => {
    const res = await axiosClient.get<ApiResponse<PermissionResponse[]>>(
      "/permissions",
      { skipAuthRedirect: true } as any
    );

    return getArrayPayload<PermissionResponse>(res.data);
  },

  getUsers: async (): Promise<UserRoleResponse[]> => {
    const res = await axiosClient.get<ApiResponse<UserRoleResponse[]>>(
      "/users",
      { skipAuthRedirect: true } as any
    );

    return getArrayPayload<UserRoleResponse>(res.data);
  },

  updateUserRole: async (
    userId: number,
    roleId: number
  ): Promise<UserRoleResponse> => {
    const res = await axiosClient.patch<ApiResponse<UserRoleResponse>>(
      `/users/${userId}`,
      { roleId }
    );

    return res.data.result;
  },
};
