import bcrypt from "bcryptjs";
import {
  Employee,
  EmployeeDocument,
  PrivacyPreference,
  SupportTicket,
  User,
  UserPreference,
} from "../models/index.js";
import { AppError, assertFound } from "../utils/errors.js";
import { employeeToJson } from "../utils/serializers.js";
import { newId } from "../utils/dates.js";
import { logAudit } from "./auditLog.js";

const editableEmployeeFields = ["name", "phone", "location", "reportsTo"];

function requireEmployeeId(req) {
  const employeeId = req.user?.employeeId;
  if (!employeeId) throw new AppError("Employee profile required", 403);
  return employeeId;
}

function documentToJson(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    fileUrl: row.fileUrl ?? "",
    notes: row.notes ?? "",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function privacyToJson(row) {
  return {
    profileVisibility: row.profileVisibility,
    shareBirthday: row.shareBirthday,
    sharePhone: row.sharePhone,
    twoFactorEnabled: row.twoFactorEnabled,
  };
}

function ticketToJson(row) {
  return {
    id: row.id,
    subject: row.subject,
    message: row.message,
    status: row.status,
    priority: row.priority,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function preferenceToJson(row) {
  return {
    language: row.language,
    timezone: row.timezone,
    emailNotifications: row.emailNotifications,
    pushNotifications: row.pushNotifications,
    compactMode: row.compactMode,
  };
}

async function getOrCreatePrivacy(employeeId) {
  const [row] = await PrivacyPreference.findOrCreate({ where: { employeeId } });
  return row;
}

async function getOrCreatePreferences(employeeId) {
  const [row] = await UserPreference.findOrCreate({ where: { employeeId } });
  return row;
}

export async function getAccountOverview(req) {
  const employeeId = requireEmployeeId(req);
  const employee = await Employee.findByPk(employeeId);
  assertFound(employee, "Employee");
  const [documents, privacy, tickets, preferences] = await Promise.all([
    EmployeeDocument.findAll({ where: { employeeId }, order: [["updatedAt", "DESC"]] }),
    getOrCreatePrivacy(employeeId),
    SupportTicket.findAll({ where: { employeeId }, order: [["updatedAt", "DESC"]] }),
    getOrCreatePreferences(employeeId),
  ]);
  return {
    employee: employeeToJson(employee),
    documents: documents.map(documentToJson),
    privacy: privacyToJson(privacy),
    supportTickets: tickets.map(ticketToJson),
    settings: preferenceToJson(preferences),
  };
}

export async function updateMyProfile(req, input) {
  const employeeId = requireEmployeeId(req);
  const employee = await Employee.findByPk(employeeId);
  assertFound(employee, "Employee");

  const patch = {};
  for (const field of editableEmployeeFields) {
    if (field in input) patch[field] = input[field]?.trim?.() ?? input[field];
  }
  if (!patch.name?.trim()) delete patch.name;
  await employee.update(patch);

  if (patch.name) {
    await User.update({ name: patch.name }, { where: { employeeId } });
  }
  await logAudit(req, {
    action: "update",
    resource: "account_profile",
    resourceId: employeeId,
    details: `Updated own profile (${employee.name})`,
  });
  return employeeToJson(employee);
}

export async function listDocuments(req) {
  const employeeId = requireEmployeeId(req);
  const rows = await EmployeeDocument.findAll({
    where: { employeeId },
    order: [["updatedAt", "DESC"]],
  });
  return rows.map(documentToJson);
}

export async function createDocument(req, input) {
  const employeeId = requireEmployeeId(req);
  if (!input.title?.trim()) throw new AppError("Document title is required");
  const row = await EmployeeDocument.create({
    id: newId("DOC"),
    employeeId,
    title: input.title.trim(),
    category: input.category || "other",
    fileUrl: input.fileUrl?.trim() || null,
    notes: input.notes?.trim() || null,
  });
  await logAudit(req, {
    action: "create",
    resource: "employee_document",
    resourceId: row.id,
    details: `Added document ${row.title}`,
  });
  return documentToJson(row);
}

export async function updateDocument(req, id, input) {
  const employeeId = requireEmployeeId(req);
  const row = await EmployeeDocument.findOne({ where: { id, employeeId } });
  assertFound(row, "Document");
  await row.update({
    title: input.title?.trim() || row.title,
    category: input.category || row.category,
    fileUrl: input.fileUrl?.trim() || null,
    notes: input.notes?.trim() || null,
  });
  await logAudit(req, {
    action: "update",
    resource: "employee_document",
    resourceId: row.id,
    details: `Updated document ${row.title}`,
  });
  return documentToJson(row);
}

export async function deleteDocument(req, id) {
  const employeeId = requireEmployeeId(req);
  const row = await EmployeeDocument.findOne({ where: { id, employeeId } });
  assertFound(row, "Document");
  await row.destroy();
  await logAudit(req, {
    action: "delete",
    resource: "employee_document",
    resourceId: id,
    details: `Deleted document ${row.title}`,
  });
  return { ok: true };
}

export async function getPrivacy(req) {
  return privacyToJson(await getOrCreatePrivacy(requireEmployeeId(req)));
}

export async function updatePrivacy(req, input) {
  const employeeId = requireEmployeeId(req);
  const row = await getOrCreatePrivacy(employeeId);
  await row.update({
    profileVisibility: input.profileVisibility ?? row.profileVisibility,
    shareBirthday: Boolean(input.shareBirthday),
    sharePhone: Boolean(input.sharePhone),
    twoFactorEnabled: Boolean(input.twoFactorEnabled),
  });

  if (input.currentPassword && input.newPassword) {
    const user = await User.findByPk(req.user.id);
    const ok = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!ok) throw new AppError("Current password is incorrect", 400);
    if (input.newPassword.length < 6) throw new AppError("New password must be at least 6 characters");
    user.passwordHash = await bcrypt.hash(input.newPassword, 10);
    await user.save();
  }

  await logAudit(req, {
    action: "update",
    resource: "privacy_preferences",
    resourceId: employeeId,
    details: "Updated privacy and security preferences",
  });
  return privacyToJson(row);
}

export async function listTickets(req) {
  const employeeId = requireEmployeeId(req);
  const rows = await SupportTicket.findAll({
    where: { employeeId },
    order: [["updatedAt", "DESC"]],
  });
  return rows.map(ticketToJson);
}

export async function createTicket(req, input) {
  const employeeId = requireEmployeeId(req);
  if (!input.subject?.trim() || !input.message?.trim()) {
    throw new AppError("Subject and message are required");
  }
  const row = await SupportTicket.create({
    id: newId("SUP"),
    employeeId,
    subject: input.subject.trim(),
    message: input.message.trim(),
    priority: input.priority || "medium",
  });
  await logAudit(req, {
    action: "create",
    resource: "support_ticket",
    resourceId: row.id,
    details: `Created support ticket ${row.subject}`,
  });
  return ticketToJson(row);
}

export async function updateTicket(req, id, input) {
  const employeeId = requireEmployeeId(req);
  const row = await SupportTicket.findOne({ where: { id, employeeId } });
  assertFound(row, "Support ticket");
  await row.update({
    subject: input.subject?.trim() || row.subject,
    message: input.message?.trim() || row.message,
    priority: input.priority || row.priority,
    status: input.status || row.status,
  });
  await logAudit(req, {
    action: "update",
    resource: "support_ticket",
    resourceId: row.id,
    details: `Updated support ticket ${row.subject}`,
  });
  return ticketToJson(row);
}

export async function deleteTicket(req, id) {
  const employeeId = requireEmployeeId(req);
  const row = await SupportTicket.findOne({ where: { id, employeeId } });
  assertFound(row, "Support ticket");
  await row.destroy();
  await logAudit(req, {
    action: "delete",
    resource: "support_ticket",
    resourceId: id,
    details: `Deleted support ticket ${row.subject}`,
  });
  return { ok: true };
}

export async function getSettings(req) {
  return preferenceToJson(await getOrCreatePreferences(requireEmployeeId(req)));
}

export async function updateSettings(req, input) {
  const employeeId = requireEmployeeId(req);
  const row = await getOrCreatePreferences(employeeId);
  await row.update({
    language: input.language?.trim() || row.language,
    timezone: input.timezone?.trim() || row.timezone,
    emailNotifications: Boolean(input.emailNotifications),
    pushNotifications: Boolean(input.pushNotifications),
    compactMode: Boolean(input.compactMode),
  });
  await logAudit(req, {
    action: "update",
    resource: "user_preferences",
    resourceId: employeeId,
    details: "Updated account settings",
  });
  return preferenceToJson(row);
}
