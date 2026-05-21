import { AuditLog } from "../models/index.js";
import { newId } from "../utils/dates.js";

export async function logAudit(req, { action, resource, resourceId, details }) {
  const user = req.user;
  if (!user) return;
  await AuditLog.create({
    id: newId("AUD"),
    userId: user.id,
    userName: user.name,
    action,
    resource,
    resourceId: resourceId ?? null,
    details: details ?? null,
  });
}
