export const normalizeRole = (value?: string) =>
  value?.trim().toUpperCase().replace(/^ROLE_/, "") ?? "";

export const normalizePermission = (value?: string) =>
  value?.trim().toUpperCase() ?? "";

const getStoredToken = () =>
  localStorage.getItem("access_token") ||
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  "";

const decodeJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

export const getPermissionsFromToken = (token = getStoredToken()) => {
  const scope = decodeJwtPayload(token)?.scope;

  if (typeof scope !== "string") return [];

  return scope
    .split(/\s+/)
    .map(normalizePermission)
    .filter((permission) => permission && !permission.startsWith("ROLE_"));
};

export const hasAnyPermission = (
  availablePermissions: string[] = [],
  requiredPermissions: string[] = [],
) => {
  if (requiredPermissions.length === 0) return true;

  const available = new Set(availablePermissions.map(normalizePermission));

  return requiredPermissions.some((permission) =>
    available.has(normalizePermission(permission)),
  );
};

export const isAdminRole = (role?: string) => normalizeRole(role) === "ADMIN";
