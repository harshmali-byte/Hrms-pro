import { HrRole } from "../models/index.js";
import { AppError } from "../utils/errors.js";

const ADMIN_SLUG = "hr-admin";
const EMPLOYEE_SLUG = "employee";

let cache = { at: 0, map: new Map() };

async function permissionMap() {
  const now = Date.now();
  if (now - cache.at < 60_000 && cache.map.size) return cache.map;
  const roles = await HrRole.findAll();
  const map = new Map();
  for (const r of roles) map.set(r.slug, r.permissions ?? []);
  cache = { at: now, map };
  return map;
}

export async function getUserPermissions(user) {
  if (user.role === "admin") {
    const map = await permissionMap();
    return map.get(ADMIN_SLUG) ?? ["*"];
  }
  const map = await permissionMap();
  return map.get(EMPLOYEE_SLUG) ?? ["leave.view"];
}

export function hasPermission(perms, required) {
  if (perms.includes("*") || perms.includes(required)) return true;
  const [group] = required.split(".");
  return perms.includes(`${group}.*`);
}

export function requirePermission(...required) {
  return async (req, _res, next) => {
    try {
      const perms = await getUserPermissions(req.user);
      const ok = required.some((r) => hasPermission(perms, r));
      if (!ok) throw new AppError("Forbidden", 403);
      next();
    } catch (e) {
      next(e);
    }
  };
}
