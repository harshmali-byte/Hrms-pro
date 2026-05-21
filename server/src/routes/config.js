import { Router } from "express";
import {
  CompanyProfile,
  LeavePolicy,
  HrRole,
  DocumentTemplate,
  OrgPreferences,
  AuditLog,
  LeaveBalance,
} from "../models/index.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { PERMISSION_CATALOG } from "../constants/permissions.js";
import { logAudit } from "../services/auditLog.js";
import { formatPostedDate, newId } from "../utils/dates.js";

const router = Router();

router.use(requireAuth, requireAdmin);

function toCompanyJson(row) {
  return {
    legalName: row.legalName,
    displayName: row.displayName,
    address: row.address,
    country: row.country,
    industry: row.industry,
    website: row.website,
    taxId: row.taxId,
  };
}

function toPolicyJson(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    daysPerYear: row.daysPerYear,
    carryForwardLimit: row.carryForwardLimit,
    isPaid: row.isPaid,
    minNoticeDays: row.minNoticeDays,
    requiresApproval: row.requiresApproval,
    active: row.active,
    description: row.description,
  };
}

router.get("/summary", async (_req, res) => {
  const company = await CompanyProfile.findByPk("default");
  const prefs = await OrgPreferences.findByPk("default");
  res.json({
    companyDisplayName: company?.displayName ?? "Organiq Pvt. Ltd.",
    localeLabel: prefs ? `${prefs.country} · ${prefs.currency}` : "India · INR",
  });
});

router.get("/company", async (_req, res) => {
  let row = await CompanyProfile.findByPk("default");
  if (!row) {
    row = await CompanyProfile.create({
      id: "default",
      legalName: "Organiq Private Limited",
      displayName: "Organiq Pvt. Ltd.",
      address: "",
      country: "India",
      industry: "Technology",
    });
  }
  res.json(toCompanyJson(row));
});

router.patch("/company", async (req, res) => {
  let row = await CompanyProfile.findByPk("default");
  if (!row) {
    row = await CompanyProfile.create({ id: "default", ...req.body });
  } else {
    await row.update(req.body);
  }
  await logAudit(req, {
    action: "update",
    resource: "company_profile",
    resourceId: "default",
    details: `Updated company profile (${row.displayName})`,
  });
  res.json(toCompanyJson(row));
});

router.get("/leave-policies", async (_req, res) => {
  const rows = await LeavePolicy.findAll({ order: [["type", "ASC"]] });
  res.json(rows.map(toPolicyJson));
});

router.post("/leave-policies", async (req, res) => {
  const { name, type, daysPerYear, carryForwardLimit, isPaid, minNoticeDays, requiresApproval, active, description } =
    req.body;
  if (!name || !type) {
    return res.status(400).json({ error: "Name and type required" });
  }
  const row = await LeavePolicy.create({
    id: newId("LP"),
    name,
    type,
    daysPerYear: Number(daysPerYear) || 0,
    carryForwardLimit: Number(carryForwardLimit) || 0,
    isPaid: isPaid !== false,
    minNoticeDays: Number(minNoticeDays) || 0,
    requiresApproval: requiresApproval !== false,
    active: active !== false,
    description: description ?? null,
  });
  await logAudit(req, {
    action: "create",
    resource: "leave_policy",
    resourceId: row.id,
    details: `Created policy ${row.name}`,
  });
  res.status(201).json(toPolicyJson(row));
});

router.patch("/leave-policies/:id", async (req, res) => {
  const row = await LeavePolicy.findByPk(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  await row.update(req.body);

  if (req.body.syncBalances && req.body.daysPerYear != null) {
    await LeaveBalance.update(
      { total: row.daysPerYear },
      { where: { type: row.type } },
    );
  }

  await logAudit(req, {
    action: "update",
    resource: "leave_policy",
    resourceId: row.id,
    details: `Updated ${row.name}${req.body.syncBalances ? " and synced employee balances" : ""}`,
  });
  res.json(toPolicyJson(row));
});

router.delete("/leave-policies/:id", async (req, res) => {
  const row = await LeavePolicy.findByPk(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  const protectedIds = ["LP-CASUAL", "LP-SICK", "LP-EARNED", "LP-UNPAID"];
  if (protectedIds.includes(row.id)) {
    return res.status(400).json({ error: "Default policies cannot be deleted. Deactivate instead." });
  }
  const name = row.name;
  await row.destroy();
  await logAudit(req, {
    action: "delete",
    resource: "leave_policy",
    resourceId: req.params.id,
    details: `Deleted policy ${name}`,
  });
  res.json({ ok: true });
});

router.get("/permissions", (_req, res) => {
  res.json(PERMISSION_CATALOG);
});

router.get("/roles", async (_req, res) => {
  const rows = await HrRole.findAll({ order: [["name", "ASC"]] });
  res.json(
    rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      permissions: r.permissions,
      isSystem: r.isSystem,
    })),
  );
});

router.patch("/roles/:id", async (req, res) => {
  const row = await HrRole.findByPk(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  const { permissions, description, name } = req.body;
  if (permissions) row.permissions = permissions;
  if (description !== undefined) row.description = description;
  if (name) row.name = name;
  await row.save();
  await logAudit(req, {
    action: "update",
    resource: "hr_role",
    resourceId: row.id,
    details: `Updated role ${row.name}`,
  });
  res.json({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    permissions: row.permissions,
    isSystem: row.isSystem,
  });
});

router.get("/templates", async (_req, res) => {
  const rows = await DocumentTemplate.findAll({ order: [["name", "ASC"]] });
  res.json(
    rows.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      description: t.description,
      version: t.version,
      updatedAt: t.updatedAtLabel,
    })),
  );
});

router.post("/templates", async (req, res) => {
  const { name, category, description, version } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const row = await DocumentTemplate.create({
    id: newId("DT"),
    name,
    category: category || "other",
    description: description ?? null,
    version: version || "1.0",
    updatedAtLabel: formatPostedDate(),
  });
  await logAudit(req, {
    action: "create",
    resource: "document_template",
    resourceId: row.id,
    details: `Added template ${row.name}`,
  });
  res.status(201).json({
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    version: row.version,
    updatedAt: row.updatedAtLabel,
  });
});

router.patch("/templates/:id", async (req, res) => {
  const row = await DocumentTemplate.findByPk(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  await row.update({
    ...req.body,
    updatedAtLabel: formatPostedDate(),
  });
  await logAudit(req, {
    action: "update",
    resource: "document_template",
    resourceId: row.id,
    details: `Updated template ${row.name}`,
  });
  res.json({
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    version: row.version,
    updatedAt: row.updatedAtLabel,
  });
});

router.delete("/templates/:id", async (req, res) => {
  const row = await DocumentTemplate.findByPk(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  const name = row.name;
  await row.destroy();
  await logAudit(req, {
    action: "delete",
    resource: "document_template",
    resourceId: req.params.id,
    details: `Removed template ${name}`,
  });
  res.json({ ok: true });
});

router.get("/preferences", async (_req, res) => {
  let row = await OrgPreferences.findByPk("default");
  if (!row) {
    row = await OrgPreferences.create({ id: "default" });
  }
  res.json({
    locale: row.locale,
    country: row.country,
    currency: row.currency,
    timezone: row.timezone,
    emailNotifications: row.emailNotifications,
    pushNotifications: row.pushNotifications,
    leaveReminders: row.leaveReminders,
    payrollAlerts: row.payrollAlerts,
    policyUpdates: row.policyUpdates,
  });
});

router.patch("/preferences", async (req, res) => {
  let row = await OrgPreferences.findByPk("default");
  if (!row) row = await OrgPreferences.create({ id: "default", ...req.body });
  else await row.update(req.body);
  await logAudit(req, {
    action: "update",
    resource: "org_preferences",
    resourceId: "default",
    details: "Updated organisation preferences",
  });
  res.json({
    locale: row.locale,
    country: row.country,
    currency: row.currency,
    timezone: row.timezone,
    emailNotifications: row.emailNotifications,
    pushNotifications: row.pushNotifications,
    leaveReminders: row.leaveReminders,
    payrollAlerts: row.payrollAlerts,
    policyUpdates: row.policyUpdates,
  });
});

router.get("/audit-log", async (req, res) => {
  const limit = Math.min(100, Number(req.query.limit) || 50);
  const rows = await AuditLog.findAll({
    order: [["createdAt", "DESC"]],
    limit,
  });
  res.json(
    rows.map((a) => ({
      id: a.id,
      userName: a.userName,
      action: a.action,
      resource: a.resource,
      resourceId: a.resourceId,
      details: a.details,
      createdAt: a.createdAt
        ? new Date(a.createdAt).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    })),
  );
});

export default router;
