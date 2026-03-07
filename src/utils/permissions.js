export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SALES: 'sales',
}

export const PERMISSIONS = {
  LEAD_READ: 'lead:read',
  LEAD_WRITE: 'lead:write',
  LEAD_DELETE: 'lead:delete',
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  DASHBOARD_READ: 'dashboard:read',
  NOTIFICATION_READ: 'notification:read',
}

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [
    PERMISSIONS.LEAD_READ,
    PERMISSIONS.LEAD_WRITE,
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.NOTIFICATION_READ,
  ],
  [ROLES.SALES]: [PERMISSIONS.LEAD_READ, PERMISSIONS.LEAD_WRITE, PERMISSIONS.NOTIFICATION_READ],
}

export function hasPermission(user, permission) {
  if (!user?.role) return false
  const rolePerms = ROLE_PERMISSIONS[user.role] || []
  return rolePerms.includes(permission)
}

export function hasAnyPermission(user, permissions) {
  return permissions.some((p) => hasPermission(user, p))
}
