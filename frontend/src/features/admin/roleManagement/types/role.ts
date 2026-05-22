export interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

export interface PermissionResponse {
  permissionId: number;
  permissionName: string;
  description?: string;
}

export interface RoleResponse {
  roleId?: number;
  role_id?: number;
  id?: number;
  roleName: string;
  description?: string;
  permissions?: Array<string | PermissionResponse>;
  permissionIds?: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleRequest {
  roleName: string;
  permissionIds: number[];
}

export interface UserRoleResponse {
  userId: number;
  id?: number;
  username: string;
  name?: string;
  email?: string;
  role?: string;
  roleId?: number;
  role_id?: number;
  roleName?: string;
  status?: boolean | string;
  avatarUrl?: string;
}

export interface RoleItem {
  clientId: string;
  roleId?: number;
  roleName: string;
  description: string;
  permissions: string[];
  permissionIds: number[];
  userCount: number;
  createdAt?: string;
  updatedAt?: string;
  isSystemRole: boolean;
}

export interface UserRoleItem {
  userId: number;
  username: string;
  name: string;
  email: string;
  roleName: string;
  roleId?: number;
  status: boolean;
  avatarUrl?: string;
}

export interface PermissionGroup {
  key: string;
  label: string;
  permissions: PermissionResponse[];
}

export interface RoleFormState {
  roleName: string;
  description: string;
  permissionIds: number[];
}

export interface RoleStats {
  totalRoles: number;
  assignedUsers: number;
  totalPermissions: number;
  recentChanges: number;
}

export type RoleModalMode = "create" | "edit";
export type RoleManagementTab = "roles" | "users";
