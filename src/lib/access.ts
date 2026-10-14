import type { Role } from "@/types/auth";

export type Area = "farmer" | "admin";

/**
 * Frontend route access rule. This only hides UI — the Express API must
 * enforce the same rule on every request (JWT role check).
 */
export function canAccess(role: Role | null | undefined, area: Area): boolean {
  if (!role) return false;
  if (area === "admin") return role === "admin";
  return role === "farmer" || role === "admin";
}
