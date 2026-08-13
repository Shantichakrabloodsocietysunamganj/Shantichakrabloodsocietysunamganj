// =============================================================
//  Role helpers — single source of truth for authorization.
//  Database roles: 'user' | 'donor' | 'admin' | 'moderator'.
//  ("staff" is NOT a database role — it maps to admin OR moderator.)
// =============================================================

export const ADMIN_ROLE = "admin" as const;
export const MODERATOR_ROLE = "moderator" as const;
export const STAFF_ROLES = [ADMIN_ROLE, MODERATOR_ROLE] as const;

export type Role = "user" | "donor" | "admin" | "moderator";

export function isAdminRole(role: string | null | undefined): boolean {
  return role === ADMIN_ROLE;
}

/** admin OR moderator — allowed to manage blood-related content. */
export function isStaffRole(role: string | null | undefined): boolean {
  return role === ADMIN_ROLE || role === MODERATOR_ROLE;
}
