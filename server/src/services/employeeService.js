import bcrypt from "bcryptjs";
import {
  AttendanceDay,
  Employee,
  EmployeeDocument,
  LeaveBalance,
  LeavePolicy,
  LeaveRequest,
  Payslip,
  PrivacyPreference,
  SupportTicket,
  User,
  UserPreference,
} from "../models/index.js";
import { AppError, assertFound } from "../utils/errors.js";
import { formatPostedDate, newId } from "../utils/dates.js";
import { employeeToJson } from "../utils/serializers.js";
import { logAudit } from "./auditLog.js";

const DEPT_COLORS = {
  Engineering: "#4F46E5",
  Design: "#0EA5E9",
  People: "#10B981",
  Marketing: "#F59E0B",
  Finance: "#EF4444",
  Sales: "#8B5CF6",
};

export async function listEmployees() {
  const rows = await Employee.findAll({ order: [["name", "ASC"]] });
  return rows.map(employeeToJson);
}

export async function getEmployee(id) {
  const row = await Employee.findByPk(id);
  assertFound(row, "Employee");
  return employeeToJson(row);
}

export async function createEmployee(req, input) {
  const { name, email, role, department, phone, createLogin } = input;
  if (!name?.trim() || !email?.trim() || !role?.trim()) {
    throw new AppError("Name, email, and role are required");
  }

  const existing = await Employee.findOne({
    where: { email: email.trim().toLowerCase() },
  });
  if (existing) throw new AppError("Email already in use", 409);

  const id = newId("EMP");
  const dept = (department || "General").trim();
  const employee = await Employee.create({
    id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: role.trim(),
    department: dept,
    phone: phone?.trim() || "+91 90000 00000",
    avatarColor: DEPT_COLORS[dept] ?? "#4F6BED",
    joinedOn: formatPostedDate(),
    status: "active",
    location: "Bengaluru, IN",
    employeeCode: `ORG-${id.replace("EMP-", "")}`,
  });

  const policies = await LeavePolicy.findAll({ where: { active: true } });
  for (const p of policies) {
    await LeaveBalance.create({
      employeeId: id,
      type: p.type,
      total: p.daysPerYear,
      used: 0,
    });
  }

  if (createLogin) {
    const hash = await bcrypt.hash("demo123", 10);
    await User.create({
      email: employee.email,
      passwordHash: hash,
      role: "employee",
      employeeId: id,
      name: employee.name,
    });
  }

  await logAudit(req, {
    action: "create",
    resource: "employee",
    resourceId: id,
    details: `Hired ${employee.name}`,
  });

  return employeeToJson(employee);
}

export async function updateEmployee(req, id, patch) {
  const row = await Employee.findByPk(id);
  assertFound(row, "Employee");
  const allowed = [
    "name",
    "email",
    "phone",
    "role",
    "department",
    "reportsTo",
    "status",
    "location",
    "employeeCode",
  ];
  const next = {};
  for (const key of allowed) {
    if (key in patch) next[key] = typeof patch[key] === "string" ? patch[key].trim() : patch[key];
  }
  if (next.email) {
    next.email = next.email.toLowerCase();
    const existing = await Employee.findOne({ where: { email: next.email } });
    if (existing && existing.id !== id) throw new AppError("Email already in use", 409);
  }
  await row.update(next);
  const userPatch = {};
  if (next.name) userPatch.name = next.name;
  if (next.email) userPatch.email = next.email;
  if (Object.keys(userPatch).length > 0) {
    await User.update(userPatch, { where: { employeeId: id } });
  }
  await logAudit(req, {
    action: "update",
    resource: "employee",
    resourceId: id,
    details: `Updated ${row.name}`,
  });
  return employeeToJson(row);
}

export async function deleteEmployee(req, id) {
  const row = await Employee.findByPk(id);
  assertFound(row, "Employee");
  await User.destroy({ where: { employeeId: id } });
  await AttendanceDay.destroy({ where: { employeeId: id } });
  await LeaveBalance.destroy({ where: { employeeId: id } });
  await LeaveRequest.destroy({ where: { employeeId: id } });
  await Payslip.destroy({ where: { employeeId: id } });
  await EmployeeDocument.destroy({ where: { employeeId: id } });
  await PrivacyPreference.destroy({ where: { employeeId: id } });
  await SupportTicket.destroy({ where: { employeeId: id } });
  await UserPreference.destroy({ where: { employeeId: id } });
  await row.destroy();
  await logAudit(req, {
    action: "delete",
    resource: "employee",
    resourceId: id,
    details: `Removed ${row.name}`,
  });
  return { ok: true };
}

export async function getDepartmentStats() {
  const employees = await Employee.findAll();
  const map = new Map();
  for (const e of employees) {
    const cur = map.get(e.department) ?? { name: e.department, headcount: 0, color: DEPT_COLORS[e.department] ?? "#64748B" };
    cur.headcount += 1;
    map.set(e.department, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.headcount - a.headcount);
}
